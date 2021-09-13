const keccak256 = require('keccak256')
const swAbi = require('../build/contracts/Swap.json').abi
const IUniswapV2PairAbi = require('../build/contracts/IUniswapV2Pair.json').abi
const IUniswapV2Router02Abi = require('../build/contracts/IUniswapV2Router02.json').abi
const IUniswapV2FactoryAbi = require('../build/contracts/IUniswapV2Factory.json').abi
const IErc20Abi = require("../build/contracts/IERC20.json").abi
const DbData = require('./db.js')
const Web3 = require('web3')

const cfg = require('./config.js')

async function init() {
  let routerAddr = cfg[cfg.network].router
  let facctoryAddr = "0x1125C5F53C72eFd175753d427aA116B972Aa5537"

  let sw,router,factory
  let web3 = new Web3(await cfg[cfg.network].provider())
  
  sw = new web3.eth.Contract(swAbi, cfg[cfg.network].swAddr)
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

  return {sw,web3,router,factory}
}

module.exports = {
  init
}