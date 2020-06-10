# PreDAuth

## Plans

### Folder structure

```
./
├── app/
│   ├── backend/
│   │   ├── src/
│   │   ├── typings/
│   │   └── ...
│   └── frontend/
│       ├── src/
│       ├── typings/
│       └── ...
├── fabric/
│   ├── chaincode/
│   │   ├── src/
│   │   ├── typings/
│   │   └── ...
│   └── frontend/
│       ├── src/
│       ├── typings/
│       └── ...
└── lib/
    ├── mcl
    └── ...

```
## Notes

### Build blockchain network

#### Generate certificates

```shell script
cryptogen generate --config=./crypto-config.yaml
```

```yaml
OrdererOrgs:
  - Name: Orderer
    Domain: example.com
    Specs:
      - Hostname: orderer
      - Hostname: orderer2
      - Hostname: orderer3
      - Hostname: orderer4
      - Hostname: orderer5
PeerOrgs:
  - Name: Org1
    Domain: org1.example.com
    EnableNodeOUs: true
    Template:
      Count: 2
    Users:
      Count: 1
  - Name: Org2
    Domain: org2.example.com
    EnableNodeOUs: true
    Template:
      Count: 2
    Users:
      Count: 1
```

#### Generate configs

```shell script
export FABRIC_CFG_PATH=$PWD
export CHANNEL_NAME=mychannel
configtxgen -profile SampleMultiNodeEtcdRaft -channelID byfn-sys-channel -outputBlock ./channel-artifacts/genesis.block
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP
```

#### Start network

```shell script
docker-compose -f docker-compose-cli.yaml -f docker-compose-etcdraft2.yaml up -d
```

#### Create and join channel

```shell script
docker exec -it cli bash
```

Inside container:

```shell script
export CHANNEL_NAME=mychannel
export CA=/srv/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
# create channel
peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile $CA
# join org1
peer channel join -b $CHANNEL_NAME.block
# join org2
CORE_PEER_MSPCONFIGPATH=/srv/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp CORE_PEER_ADDRESS=peer0.org2.example.com:9051 CORE_PEER_LOCALMSPID="Org2MSP" CORE_PEER_TLS_ROOTCERT_FILE=/srv/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt peer channel join -b mychannel.block
```

#### Update anchor peers

```shell script
# update org1
peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile $CA
# update org2
CORE_PEER_MSPCONFIGPATH=/srv/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp CORE_PEER_ADDRESS=peer0.org2.example.com:9051 CORE_PEER_LOCALMSPID="Org2MSP" CORE_PEER_TLS_ROOTCERT_FILE=/srv/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org2MSPanchors.tx --tls --cafile $CA
```

#### Install chaincode

```shell script
# package chaincode
peer lifecycle chaincode package mycc.tar.gz --path /srv/fabric/chaincode/dist/ --lang node --label mycc_1
# install on org1
peer lifecycle chaincode install mycc.tar.gz
# install on org2
CORE_PEER_MSPCONFIGPATH=/srv/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp CORE_PEER_ADDRESS=peer0.org2.example.com:9051 CORE_PEER_LOCALMSPID="Org2MSP" CORE_PEER_TLS_ROOTCERT_FILE=/srv/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt peer lifecycle chaincode install mycc.tar.gz
# get the latest installed chaincode
export CC_PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | awk 'END{print $3}' | sed 's/.$//')
# approve for org1
peer lifecycle chaincode approveformyorg --channelID $CHANNEL_NAME --name mycc --version 1.0 --init-required --package-id $CC_PACKAGE_ID --sequence 1 --tls true --cafile $CA
# approve for org2
CORE_PEER_MSPCONFIGPATH=/srv/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp CORE_PEER_ADDRESS=peer0.org2.example.com:9051 CORE_PEER_LOCALMSPID="Org2MSP" CORE_PEER_TLS_ROOTCERT_FILE=/srv/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt peer lifecycle chaincode approveformyorg --channelID $CHANNEL_NAME --name mycc --version 1.0 --init-required --package-id $CC_PACKAGE_ID --sequence 1 --tls true --cafile $CA
# get status of chaincode
peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name mycc --version 1.0 --init-required --sequence 1 --tls true --cafile $CA --output json
# commit chaincode to channel
peer lifecycle chaincode commit -o orderer.example.com:7050 --channelID $CHANNEL_NAME --name mycc --version 1.0 --sequence 1 --init-required --tls true --cafile $CA --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /srv/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /srv/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
```

#### CRUD

```shell script
# create
peer chaincode invoke -o orderer.example.com:7050 --isInit --tls true --cafile $CA -C $CHANNEL_NAME -n mycc --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /srv/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /srv/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"saveData","Args":[]}' --waitForEvent
# read
peer chaincode query -C $CHANNEL_NAME -n mycc -c '...'
# update
peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile $CA -C $CHANNEL_NAME -n mycc --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /src/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /src/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '...' --waitForEvent
```
