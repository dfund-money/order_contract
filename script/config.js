
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();
module.exports = {
  network:"testnet",
  "testnet":{
    dburl : "mongodb://localhost:27017/testDb",
    startBlock: 15408713,
    wasp:"0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f",
    zoo:"0x890589dC8BD3F973dcAFcB02b6e1A133A76C8135",
    web3Url: "https://gwan-ssl.wandevs.org:46891", //"http://192.168.1.36:8545"
    provider: ()=>new HDWalletProvider(mnemonic, "https://gwan-ssl.wandevs.org:46891", 0, 9),
    swAddr: "0x6D76aBb6A68FD6D55554751cF77BF39D3227E4BE",
  },
  "mainnet":{
    dburl : "mongodb://localhost:27017/mainDb",
  }
}