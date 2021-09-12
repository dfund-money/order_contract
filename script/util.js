const keccak256 = require('keccak256')
const swAbi = require('../build/contracts/Swap.json').abi
const IUniswapV2PairAbi = require('../build/contracts/IUniswapV2Pair.json').abi
const IUniswapV2Router02Abi = require('../build/contracts/IUniswapV2Router02.json').abi
const IUniswapV2FactoryAbi = require('../build/contracts/IUniswapV2Factory.json').abi
const IErc20Abi = require("../build/contracts/IERC20.json").abi
const DbData = require('./db.js')
const Web3 = require('web3')

const cfg = require('./config.js')
const network = 'testnet'

async function init() {
  let admin = "0xEf73Eaa714dC9a58B0990c40a01F4C0573599959"
  let feeTo = "0xbED2Af202C908d4134bbDFe280A3423597C204FD"
  let routerAddr = "0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1"
  let swAddr = "0xcD1a6DdEae2Ce3EaE2Dd8677dCe18E52b75A6390"

  let wanEth = "0x48344649B9611a891987b2Db33fAada3AC1d05eC"
  let wanUsdt = "0x3D5950287b45F361774E5fB6e50d70eEA06Bc167"
  let wand = "0x230f0c01b8e2c027459781e6a56da7e1876efdbe"
  let wasp = "0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f"
  let zoo = "0x890589dC8BD3F973dcAFcB02b6e1A133A76C8135"
  let IUniswapV2PairAddr = "0xfE5486f20826c3199bf6b68E05a49775C823A1D8"  //wasp zoo

  let facctoryAddr = "0x1125C5F53C72eFd175753d427aA116B972Aa5537"

  let sw,router,factory
  let web3 = new Web3(cfg[cfg.network].web3Url)
  
  sw = new web3.eth.Contract(swAbi, swAddr)
  router = new web3.eth.Contract(IUniswapV2Router02Abi, routerAddr)
  factory = new web3.eth.Contract(IUniswapV2FactoryAbi, facctoryAddr)


  // let allPairsLength = await factory.methods.allPairsLength().call()
  // console.log("allPairsLength:", allPairsLength)

    // let i=19; 
    // let pairOneAddr = await factory.methods.allPairs(i).call()
    // console.log("pairOneAddr:", i, pairOneAddr)
    // let pair = new web3.eth.Contract(IUniswapV2PairAbi, pairOneAddr)
    // let token0Addr = await pair.methods.token0().call();
    // let token0 = new web3.eth.Contract(IErc20Abi, token0Addr)
    
    // let token1Addr = await pair.methods.token1().call();
    // let token1 = new web3.eth.Contract(IErc20Abi, token1Addr)
    // console.log("pair tokens:", await token0.methods.symbol().call(), token0Addr,  await token1.methods.symbol().call(), token1Addr) 
    // let price0CumulativeLast = await pair.methods.price0CumulativeLast().call()
    // console.log("price0CumulativeLast:", price0CumulativeLast)

    // let getReserves = await pair.methods.getReserves().call()
    // console.log("getReserves:", getReserves)




  // let factoryAddr = await router.methods.factory().call()
  // console.log("factoryAddr:", factoryAddr)

  // let price = 1100000; // base 10 **6
  // let amount = web3.utils.toWei("2")
  // let t1 = await sw.methods.changeOrder(wanEth, wanUsdt, price, amount).send({from:admin})
  // console.log("t1:",t1)


  // let blockNumber = await web3.eth.getBlockNumber();
  // let fromBlock = blockNumber - 1000
  // let eventOption = {
  //   fromBlock
  // }
  // let events = await sw.getPastEvents("changeOrderEvent", eventOption)
  // console.log("events:", events)

  return {sw}
}

module.exports = {
  init
}