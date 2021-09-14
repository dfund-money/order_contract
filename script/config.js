
const HDWalletProvider = require('@truffle/hdwallet-provider');
const keythereum = require("keythereum");

const fs = require('fs');


const We3 =require('web3')
let web3 = new We3()
let zoot = "0x890589dC8BD3F973dcAFcB02b6e1A133A76C8135"
let waspt = "0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f"



let zoo = "0x6e11655d6aB3781C6613db8CB1Bc3deE9a7e111F"
let wasp = "0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a"

module.exports = {
  network:"mainnet",
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
    provider:  ()=>{
      const mnemonic = fs.readFileSync(__dirname+"/../.secret").toString().trim();
      return new HDWalletProvider(mnemonic, "https://gwan-ssl.wandevs.org:46891", 0, 9)
      // const passwd = process.env.PASSWD
      // const keystore = require('fs').readFileSync(__dirname+'/.keystore').toString();
      // const keyObject = JSON.parse(keystore)
      // const privateKey = keythereum.recover(passwd, keyObject);
      // return new HDWalletProvider('0x'+privateKey.toString('hex'), "https://gwan-ssl.wandevs.org:46891")

    },
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
    startBlock: 15408713,
    wasp:wasp,
    zoo:zoo,
    operator: "0x70310086a85135c97308B66e2CaFcB6EaDB345E6",
    router: "0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1",
    admin: "0x0984a8b9c81067822f18479319a02a73Dd535a9e",
    feeTo: "0x3c360C2269286690E8c5CBC6Df1D1A6e628831F9",
    web3Url: "https://gwan-ssl.wandevs.org:56891",
    provider: ()=>{
      const passwd = process.env.PASSWD
      const keystore = require('fs').readFileSync(__dirname+'/.keystore').toString();
      const keyObject = JSON.parse(keystore)
      const privateKey = keythereum.recover(passwd, keyObject);
      return new HDWalletProvider('0x'+privateKey.toString('hex'), "https://gwan-ssl.wandevs.org:56891")
    },
    swAddr: "0xefF511bC46D6f3fB2398061F6F49eC2518334799",
    supportedPair:[{
      fromToken:zoo,
      toToken: wasp,
      path: [zoo,wasp],
      minAmount: web3.utils.toWei("1"),
    }]
  }
}