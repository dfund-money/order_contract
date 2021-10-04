
const HDWalletProvider = require('@truffle/hdwallet-provider');
const keythereum = require("keythereum");

/* mainnet */
class Tokens {
  constructor(_tokens) {
    this.supportedTokens = _tokens
  }

  name2addr(name) {
    let res = this.supportedTokens.filter(item=>{
      if(name === item.name) return true
    })
    return res[0].address
  }
  getnames() {
    return this.supportedTokens.map(item=>{
      return item.name
    })
  }
  addr2name(addr) {
    let res = this.supportedTokens.filter(item=>{
      if(addr === item.address) return true
    })
    if(res.length === 0) console.log("unknown address:", addr)
    return res[0].name
  }
  getSupportedTokens(){
    return this.supportedTokens
  }
  getAddrbyName(name){
    let res = this.supportedTokens.filter(item=>{
      if(name === item.name) return true
    })
    return res[0].address
  }
  getDecimal(addr){
    let res = this.supportedTokens.filter(item=>{
      if(addr === item.address) return true
    })
    return res[0].decimal
  }
  getMinAmount(addr){
    let res = this.supportedTokens.filter(item=>{
      if(addr === item.address) return true
    })
    return res[0].minAmount
  }
}

module.exports = {
  networks:["Wanchain","WanchainTestnet"],
  "WanchainTestnet":{
    dburl : "mongodb://localhost:27017/testDb",
    startBlock: 15920243,
    operator: "0xb9b7bb706598f27c62b90cc1a978318683c08df1",
    router: "0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1",
    admin: "0x0984a8b9c81067822f18479319a02a73Dd535a9e",
    feeTo: "0x3c360C2269286690E8c5CBC6Df1D1A6e628831F9",
    web3Url: "https://gwan-ssl.wandevs.org:46891",
    baseTokens:["0x916283cc60fdaf05069796466af164876e35d21f"], //wwan
    provider:  ()=>{
      const passwd = process.env.PASSWD
      const keystore = require('fs').readFileSync(__dirname+'/.keystore/WanchainTestnet').toString();
      const keyObject = JSON.parse(keystore)
      const privateKey = keythereum.recover(passwd, keyObject);
      return new HDWalletProvider('0x'+privateKey.toString('hex'), "https://gwan-ssl.wandevs.org:46891")
    },
    swAddr: "0x65152a1BA29ee6355F37C363a2C2BB2e5CdE1c34",
    tokens:new Tokens([
      {address:("0x890589dC8BD3F973dcAFcB02b6e1A133A76C8135").toLowerCase(),name: "zoo",decimal:18, minAmount: 1},
      {address:("0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f").toLowerCase(),name: "wasp",decimal:18, minAmount: 1},
    ])
  },
  "Wanchain":{
    dburl : "mongodb://localhost:27017/mainDb",
    startBlock: 16886280,
    operator: "0x70310086a85135c97308B66e2CaFcB6EaDB345E6",
    router: "0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1",
    admin: "0x0984a8b9c81067822f18479319a02a73Dd535a9e",
    feeTo: "0x3c360C2269286690E8c5CBC6Df1D1A6e628831F9",
    web3Url: "https://gwan-ssl.wandevs.org:56891",
    provider: ()=>{
      const passwd = process.env.PASSWD
      const keystore = require('fs').readFileSync(__dirname+'/.keystore/Wanchain').toString();
      const keyObject = JSON.parse(keystore)
      const privateKey = keythereum.recover(passwd, keyObject);
      return new HDWalletProvider('0x'+privateKey.toString('hex'), "https://gwan-ssl.wandevs.org:56891")
    },
    swAddr: "0x352a2b1f7324c39f7a62aF031F0B5ef20dDCbEC6",
    baseTokens: [ // wwan, wasp
      "0xdabd997ae5e4799be47d6e69d9431615cba28f48", "0x8b9f9f4aa70b1b0d586be8adfb19c1ac38e05e9a"
    ],
    tokens:new Tokens([
      {address:"0x6e11655d6ab3781c6613db8cb1bc3dee9a7e111f",name: "zoo",decimal:18, minAmount: 1},
      {address:"0x8b9f9f4aa70b1b0d586be8adfb19c1ac38e05e9a",name: "wasp",decimal:18, minAmount: 1},
      {address:"0x11e77e27af5539872efed10abaa0b408cfd9fbbd",name: "wanUsdt",decimal:6, minAmount: 1},
      {address:"0x230f0c01b8e2c027459781e6a56da7e1876efdbe",name: "wand",decimal:18, minAmount: 1},
      {address:"0xf665e0e3e75d16466345e1129530ec28839efaea",name: "wanXrp",decimal:8, minAmount: 1},
      {address:"0xe3ae74d1518a76715ab4c7bedf1af73893cd435a",name: "wanEth",decimal:18, minAmount: 1},
      {address:"0x50c439b6d602297252505a6799d84ea5928bcfb6",name: "wanBtc",decimal:8, minAmount: 1},
    ])
  }
}
