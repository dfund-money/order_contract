module.exports = {
  network:"testnet",
  "testnet":{
    dburl : "mongodb://localhost:27017/testDb",
    startBlock: 15408713,
    web3Url: "http://192.168.1.36:8545"
  },
  "mainnet":{
    dburl : "mongodb://localhost:27017/mainDb",
  }
}