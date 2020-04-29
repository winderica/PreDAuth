#!/bin/bash

export PATH=${PWD}/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}/config
export VERBOSE=false

function clearContainers() {
  docker rm -f "$(docker ps -a | awk '($2 ~ /dev-peer.*/) {print $1}')"
}

function removeUnwantedImages() {
  docker rm -f "$(docker images | awk '($1 ~ /dev-peer.*/) {print $3}')"
}

function createOrgs() {
  if [ -d "organizations/peerOrganizations" ]; then
    rm -Rf organizations/peerOrganizations && rm -Rf organizations/ordererOrganizations
  fi
  docker-compose -f "$COMPOSE_FILE_CA" up -d 2>&1
  . organizations/fabric-ca/registerEnroll.sh
  sleep 10
  createOrg1
  createOrg2
  createOrderer
  ./organizations/ccp-generate.sh
}

function createConsortium() {
  configtxgen -profile TwoOrgsOrdererGenesis -channelID system-channel -outputBlock ./system-genesis-block/genesis.block
}

function networkUp() {
  if [ ! -d "organizations/peerOrganizations" ]; then
    createOrgs
    createConsortium
  fi
  docker-compose -f "${COMPOSE_FILE_BASE}" -f "${COMPOSE_FILE_COUCH}" up -d
}

function createChannel() {
  if [ ! -d "organizations/peerOrganizations" ]; then
    networkUp
  fi
  scripts/createChannel.sh "$CHANNEL_NAME"
}

function deployCC() {
  scripts/deployCC.sh "$CHANNEL_NAME" "$VERSION"
  exit 0
}

function networkDown() {
  docker-compose -f "$COMPOSE_FILE_BASE" -f "$COMPOSE_FILE_COUCH" -f "$COMPOSE_FILE_CA" down --volumes --remove-orphans
  if [ "$MODE" != "restart" ]; then
    clearContainers
    removeUnwantedImages
    rm -rf system-genesis-block/*.block organizations/peerOrganizations organizations/ordererOrganizations
    rm -rf organizations/fabric-ca/org1/msp organizations/fabric-ca/org1/tls-cert.pem organizations/fabric-ca/org1/ca-cert.pem organizations/fabric-ca/org1/IssuerPublicKey organizations/fabric-ca/org1/IssuerRevocationPublicKey organizations/fabric-ca/org1/fabric-ca-server.db
    rm -rf organizations/fabric-ca/org2/msp organizations/fabric-ca/org2/tls-cert.pem organizations/fabric-ca/org2/ca-cert.pem organizations/fabric-ca/org2/IssuerPublicKey organizations/fabric-ca/org2/IssuerRevocationPublicKey organizations/fabric-ca/org2/fabric-ca-server.db
    rm -rf organizations/fabric-ca/ordererOrg/msp organizations/fabric-ca/ordererOrg/tls-cert.pem organizations/fabric-ca/ordererOrg/ca-cert.pem organizations/fabric-ca/ordererOrg/IssuerPublicKey organizations/fabric-ca/ordererOrg/IssuerRevocationPublicKey organizations/fabric-ca/ordererOrg/fabric-ca-server.db
    rm -rf channel-artifacts log.txt PreDAuth.tar.gz PreDAuth
  fi
}

CHANNEL_NAME="channel"
VERSION=1
COMPOSE_FILE_BASE=docker/docker-compose-test-net.yaml
COMPOSE_FILE_COUCH=docker/docker-compose-couch.yaml
COMPOSE_FILE_CA=docker/docker-compose-ca.yaml

if [[ $# -lt 1 ]]; then
  exit 0
else
  MODE=$1
  shift
fi

if [[ $# -ge 1 ]]; then
  key="$1"
  if [[ "$key" == "createChannel" ]]; then
    export MODE="createChannel"
    shift
  fi
fi

while [[ $# -ge 1 ]]; do
  key="$1"
  case $key in
  -c)
    CHANNEL_NAME="$2"
    shift
    ;;
  -v)
    VERSION="$2"
    shift
    ;;
  esac
  shift
done

if [ "${MODE}" == "up" ]; then
  networkUp
elif [ "${MODE}" == "createChannel" ]; then
  createChannel
elif [ "${MODE}" == "deployCC" ]; then
  deployCC
elif [ "${MODE}" == "down" ]; then
  networkDown
elif [ "${MODE}" == "restart" ]; then
  networkDown
  networkUp
else
  exit 1
fi
