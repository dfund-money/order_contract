
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(__dirname+"/../.secret").toString().trim();
const We3 =require('web3')
let web3 = new We3()
let zoot = "0x890589dC8BD3F973dcAFcB02b6e1A133A76C8135"
let waspt = "0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f"
module.exports = {
  network:"testnet",
  "testnet":{
    dburl : "mongodb://localhost:27017/testDb",
    startBlock: 15408713,
    wasp:waspt,
    zoo:zoot,
    operator: "0xfaeB08EF75458BbC511Bca1CAf4d7f5DF08EA834",
    router: "0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1",
    admin: "0xEf73Eaa714dC9a58B0990c40a01F4C0573599959",
    feeTo: "0xdC49B58d1Dc15Ff96719d743552A3d0850dD7057",
    web3Url: "https://gwan-ssl.wandevs.org:46891", //"http://192.168.1.36:8545"
    provider: ()=>new HDWalletProvider(mnemonic, "https://gwan-ssl.wandevs.org:46891", 0, 9),
    swAddr: "0xD29275b16a859fccd193a1a824D451e63b874D14",
    supportedPair:[{
      fromToken:zoot,
      toToken: waspt,
      path: [zoot,waspt],
      minAmount: web3.utils.toWei("1"),
    }]
  },
  "mainnet":{
    dburl : "mongodb://localhost:27017/mainDb",
  }
}