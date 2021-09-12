module.exports = {
  network:"testnet",
  "testnet":{
    dburl : "mongodb://localhost:27017/testDb",
    startBlock: 15408713,
    wasp:"0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f",
    zoo:"0x890589dC8BD3F973dcAFcB02b6e1A133A76C8135",
    web3Url: "https://gwan-ssl.wandevs.org:46891"//"http://192.168.1.36:8545"
  },
  "mainnet":{
    dburl : "mongodb://localhost:27017/mainDb",
  }
}