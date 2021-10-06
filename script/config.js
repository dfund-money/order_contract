
const HDWalletProvider = require('@truffle/hdwallet-provider');


module.exports = {
  "WanchainTestnet":{
    operator: "0xb9b7bb706598f27c62b90cc1a978318683c08df1",
    router: "0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1",
    admin: "0x0984a8b9c81067822f18479319a02a73Dd535a9e",
    feeTo: "0x3c360C2269286690E8c5CBC6Df1D1A6e628831F9",
    web3Url: "https://gwan-ssl.wandevs.org:46891",
    baseTokens:["0x916283cc60fdaf05069796466af164876e35d21f"], //wwan
    provider:  ()=>{
      const mnemonic = require('fs').readFileSync(__dirname+'/.secret').toString().trim();
      return new HDWalletProvider(mnemonic, "https://gwan-ssl.wandevs.org:46891", 0, 10)
    },
  },
  "Wanchain":{
    operator: "0x70310086a85135c97308B66e2CaFcB6EaDB345E6",
    router: "0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1",
    admin: "0x0984a8b9c81067822f18479319a02a73Dd535a9e",
    feeTo: "0x3c360C2269286690E8c5CBC6Df1D1A6e628831F9",
    web3Url: "https://gwan-ssl.wandevs.org:56891",
    provider: ()=>{
      const mnemonic = require('fs').readFileSync(__dirname+'/.secret').toString().trim();
      return new HDWalletProvider(mnemonic, "https://gwan-ssl.wandevs.org:56891", 0, 10)
    },
  },
  "Moonbase":{
    operator: "0xCe24b773dBB3238b3F3b612543e0768b85654c39",
    router: "0x2d4e873f9Ab279da9f1bb2c532d4F06f67755b77",
    admin: "0x0984a8b9c81067822f18479319a02a73Dd535a9e",
    feeTo: "0x3c360C2269286690E8c5CBC6Df1D1A6e628831F9",
    web3Url: "https://rpc.testnet.moonbeam.network",
    provider: ()=>{
      const mnemonic = require('fs').readFileSync(__dirname+'/.secret').toString().trim();
      return new HDWalletProvider(mnemonic, "https://rpc.testnet.moonbeam.network", 0, 10)
    },
  },
  "Moonriver":{
    operator: "0x41CEB06DaCc0f1fa3B1052691cdB16000363Defa",
    router: "0x2d4e873f9Ab279da9f1bb2c532d4F06f67755b77",
    admin: "0x0984a8b9c81067822f18479319a02a73Dd535a9e",
    feeTo: "0x3c360C2269286690E8c5CBC6Df1D1A6e628831F9",
    web3Url: "https://rpc.moonriver.moonbeam.network",
    provider: ()=>{
      const mnemonic = require('fs').readFileSync(__dirname+'/.secret').toString().trim();
      return new HDWalletProvider(mnemonic, "https://rpc.moonriver.moonbeam.network", 0, 10)
    },
  },
}
