#!/bin/bash

CHANNEL_NAME="$1"

export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export CORE_PEER_TLS_ENABLED=true
export PEER0_ORG1_CA=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export PEER0_ORG2_CA=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/config

setGlobals() {
  if [ "$1" -eq 1 ]; then
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
  elif [ "$1" -eq 2 ]; then
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
  fi
}

createChannelTx() {
  configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/"${CHANNEL_NAME}".tx -channelID "$CHANNEL_NAME"
}

createAncorPeerTx() {
  for orgmsp in Org1MSP Org2MSP; do
    configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/${orgmsp}anchors.tx -channelID "$CHANNEL_NAME" -asOrg ${orgmsp}
  done
}

createChannel() {
  setGlobals 1
  peer channel create -o localhost:7050 -c "$CHANNEL_NAME" --ordererTLSHostnameOverride orderer.example.com -f ./channel-artifacts/"${CHANNEL_NAME}".tx --outputBlock ./channel-artifacts/"${CHANNEL_NAME}".block --tls "$CORE_PEER_TLS_ENABLED" --cafile "$ORDERER_CA"
}

joinChannel() {
  setGlobals "$1"
  peer channel join -b ./channel-artifacts/"$CHANNEL_NAME".block
}

updateAnchorPeers() {
  setGlobals "$1"
  peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c "$CHANNEL_NAME" -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls "$CORE_PEER_TLS_ENABLED" --cafile "$ORDERER_CA"
}

createChannelTx
createAncorPeerTx

createChannel

joinChannel 1
joinChannel 2

updateAnchorPeers 1
updateAnchorPeers 2
