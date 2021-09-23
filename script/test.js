const keccak256 = require('keccak256')
const BigNumber = require('bignumber.js')
const HDWalletProvider = require('@truffle/hdwallet-provider');

const swAbi = require('../build/contracts/Swap.json').abi
const IUniswapV2PairAbi = require('../build/contracts/IUniswapV2Pair.json').abi
const IUniswapV2Router02Abi = require('../build/contracts/IUniswapV2Router02.json').abi
const IUniswapV2FactoryAbi = require('../build/contracts/IUniswapV2Factory.json').abi
const IErc20Abi = require("../build/contracts/IERC20.json").abi
const DbData = require('./db.js')
const Web3 = require('web3')
const cfg =  require('./config.js')
const util = require('./util.js')


let admin = cfg[cfg.network].admin

let testPrivider =  new HDWalletProvider("skill level pulse dune pattern rival used syrup inner first balance sad", cfg[cfg.network].web3Url, 0, 9)
let testUser = "0xEf73Eaa714dC9a58B0990c40a01F4C0573599959"
let sw,router,factory
let web3 

let zoo = cfg[cfg.network].zoo
let wasp = cfg[cfg.network].wasp
async function init() {
  let obj = await util.init(testPrivider)
  sw = obj.sw
  web3 = obj.web3
  router = obj.router


}

async function initToken() {
  let zooToken = new web3.eth.Contract(IErc20Abi, zoo)
  let waspToken = new web3.eth.Contract(IErc20Abi, wasp)
  let tx
  tx = await zooToken.methods.approve(cfg[cfg.network].swAddr,web3.utils.toWei("0")).send({from:testUser})
  await waspToken.methods.approve(cfg[cfg.network].swAddr,web3.utils.toWei("0")).send({from:testUser})
  await zooToken.methods.approve(cfg[cfg.network].swAddr,web3.utils.toWei("1000000000")).send({from:testUser})
  await waspToken.methods.approve(cfg[cfg.network].swAddr,web3.utils.toWei("1000000000")).send({from:testUser})
}
async function check() {





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

  // let price = 1200000; // base 10 **9
  // let amount = web3.utils.toWei("2.844")
  // let t1 = await sw.methods.changeOrder(wanEth, wanUsdt, price, amount).send({from:admin})
  // console.log("t1:",t1)



}

async function addSwap(){

  const slide = 0.002
  let order = {
    key: '0x30211082b9b706865d1a3ced8ea417338fa453eae35742c10a8db36f4bee2182',
    user: '0xEf73Eaa714dC9a58B0990c40a01F4C0573599959',
    fromToken: '0x890589dC8BD3F973dcAFcB02b6e1A133A76C8135',
    toToken: '0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f',
    price: '1000000000',
    amount: '200000000000000000'
  }

  let v  = "0.1"

  let v2  = new BigNumber(web3.utils.toWei(v))
  let v3 = v2.times(997).div(1000)
  let outMin = await router.methods.getAmountsOut(v3,[zoo,wasp]).call()
  console.log("outMin:",outMin)


  let o = new BigNumber(outMin[1])
  let tx = await sw.methods.swap(order.key,[zoo, wasp], v2, o).send({from:admin})
  console.log("tx:",JSON.stringify(tx,null,2))
}


async function addOrder(){

  let vi  = "0.135"
  let v2  = new BigNumber(web3.utils.toWei(vi))
  let outMin = await router.methods.getAmountsOut(v2,[zoo,wasp]).call()
  let vo = new BigNumber(outMin[outMin.length-1])
  let price = vo.times(10**9).idiv(v2)
  console.log("cur price:", price.toString(10))


for(let i=-5; i<5; i++){
  let t1 = await sw.methods.changeOrder(zoo, wasp, price.times(100+i).idiv(100), v2).send({from:testUser})
  console.log("t1:",JSON.stringify(t1,null,2))
}


  /*
    {
    key: '0x30211082b9b706865d1a3ced8ea417338fa453eae35742c10a8db36f4bee2182',
    user: '0xEf73Eaa714dC9a58B0990c40a01F4C0573599959',
    fromToken: '0x890589dC8BD3F973dcAFcB02b6e1A133A76C8135',
    toToken: '0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f',
    price: '1000000000',
    amount: '200000000000000000'
  }

  */ 
}



async function main() {

  try {
    await init()

  
    await initToken()

    await addOrder()
    //await check()
    //await addSwap()
  }catch(err) {
    console.log("err:", err)
  }
}

main()