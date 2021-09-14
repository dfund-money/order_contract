
const HDWalletProvider = require('@truffle/hdwallet-provider');
const keythereum = require("keythereum");

const fs = require('fs');


const We3 =require('web3')
let web3 = new We3()
let zoot = "0x890589dC8BD3F973dcAFcB02b6e1A133A76C8135"
let waspt = "0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f"



let zoo = "0x6e11655d6ab3781c6613db8cb1bc3dee9a7e111f"
let wasp = "0x8b9f9f4aa70b1b0d586be8adfb19c1ac38e05e9a"

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
    operator: "0x2Ffc3D614Ea8Cb4d95D9AeF12bAdE14E24405Ce2",
    router: "0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1",
    admin: "0xa09d1b9f1262a9a19f85336dD198bBdbf57EEF70",
    feeTo: "0x7dAe6A1E7592a6Bb709d2DA4b8E7825d35f124AA",
    web3Url: "https://gwan-ssl.wandevs.org:56891",
    provider: ()=>{
      const passwd = process.env.PASSWD
      const keystore = require('fs').readFileSync(__dirname+'/.keystore').toString();
      const keyObject = JSON.parse(keystore)
      const privateKey = keythereum.recover(passwd, keyObject);
      return new HDWalletProvider('0x'+privateKey.toString('hex'), "https://gwan-ssl.wandevs.org:56891")
    },
    swAddr: "0xF0c10c37A1b39Dfa0c06C6d1d0508390e3c0dF20",
    supportedPair:[{
      fromToken:zoo,
      toToken: wasp,
      path: [zoo,wasp],
      minAmount: web3.utils.toWei("1"),
    }]
  }
}