const keccak256 = require('keccak256')
const BigNumber = require('bignumber.js')
const swAbi = require('../build/contracts/Swap.json').abi
const IUniswapV2PairAbi = require('../build/contracts/IUniswapV2Pair.json').abi
const IUniswapV2Router02Abi = require('../build/contracts/IUniswapV2Router02.json').abi
const IUniswapV2FactoryAbi = require('../build/contracts/IUniswapV2Factory.json').abi
const IErc20Abi = require("../build/contracts/IERC20.json").abi
const DbData = require('./db.js')
const Web3 = require('web3')
const cfg =  require('./config.js')
const util = require('./util.js')


let admin = "0xef73eaa714dc9a58b0990c40a01f4c0573599959"
let feeTo = "0xbED2Af202C908d4134bbDFe280A3423597C204FD"
let routerAddr = "0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1"

let wanEth = "0x48344649B9611a891987b2Db33fAada3AC1d05eC"
let wanUsdt = "0x3D5950287b45F361774E5fB6e50d70eEA06Bc167"
let wand = "0x230f0c01b8e2c027459781e6a56da7e1876efdbe"
let IUniswapV2PairAddr = "0xfE5486f20826c3199bf6b68E05a49775C823A1D8"  //wasp zoo


let sw,router,factory
let web3 

let zoo = cfg[cfg.network].zoo
let wasp = cfg[cfg.network].wasp
async function init() {
  return await util.init()



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

  let v  = web3.utils.toWei("0.1")
  let outMin = await router.methods.getAmountsOut(v,[zoo,wasp]).call()
  console.log("outMin:",outMin)


  let o = new BigNumber(outMin[1])
  let tx = await sw.methods.swap(order.key,[zoo, wasp], v, o).send({from:admin})
  console.log("tx:",JSON.stringify(tx,null,2))
}


async function addOrder(){
  let price = 1* 10 **9
  let amount = web3.utils.toWei("0.2")
  let t1 = await sw.methods.changeOrder(zoo, wasp, price, amount).send({from:admin})
  console.log("t1:",JSON.stringify(t1,null,2))

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
    let obj = await init()
    sw = obj.sw
    web3 = obj.web3
    router = obj.router
    await addOrder()
    //await check()
    await addSwap()
  }catch(err) {
    console.log("err:", err)
  }
}

main()