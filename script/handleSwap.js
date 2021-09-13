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
const {init} = require('./util.js')

const sleep = async (ms)=>new Promise((resolve)=>setTimeout(resolve,ms))

async function fetchRecords(fromToken, toToken, price){
  let records = await dbData.fetchRecord(fromToken,toToken,price)
  //console.log("fetchRecords:",records)
  return records
}
let web3, sw,router,dbData
async function getCurPrice(fromToken, toToken, amount) {
  let vi  = new BigNumber(amount)
  let outMin = await router.methods.getAmountsOut(vi,[fromToken,toToken]).call()
  let vo = new BigNumber(outMin[outMin.length-1])
  let price = vo.times(10**9).idiv(vi)
  return price
}
async function getCurVout(fromToken, toToken, amount) {
  let vi  = new BigNumber(amount)
  let outMin = await router.methods.getAmountsOut(vi,[fromToken,toToken]).call()
  let vo = new BigNumber(outMin[outMin.length-1])
  return vo
}
async function handle() {
  dbData = new DbData()
  await dbData.dbinit()
  

  let supportedPair = cfg[cfg.network].supportedPair
  for(let i=0; i<supportedPair.length; i++){
    let price = await getCurPrice(supportedPair[i].fromToken, supportedPair[i].toToken, supportedPair[i].minAmount)
    console.log("handle price:",price)
    let records = await fetchRecords(supportedPair[i].fromToken, supportedPair[i].toToken, price)
    console.log("records:",records)
    for(let k=0;k<records.length;k++){
      // check the real price with amount
      let vin = new BigNumber(records[k].amount)
      let v2 = vin.times(997).div(1000)

      let rprice = await getCurPrice(supportedPair[i].fromToken, supportedPair[i].toToken, v2.toString(10))
      if(rprice.lt(price)){
        continue;
      }

      //TODO send swap
      let voutMin = await getCurVout(supportedPair[i].fromToken, supportedPair[i].toToken, v2)
      try {
        let tx = await sw.methods.swap(records[k].key,supportedPair[i].path, vin, voutMin).send({from:cfg[cfg.network].operator})
        console.log("tx:",JSON.stringify(tx,null,2))
      }catch(err){
        // ignore err.
        console.log("swap err:",err)
      }

    }
  }
  
}
async function main() {
  process.on('uncaughtException', (err, origin) => {
    console.log("uncaughtException:", err)
  });
  let  obj = await init()
  sw = obj.sw
  web3 = obj.web3
  router = obj.router
  while(true){
    try {
      
      await handle()
      
    }catch(err) {
      console.log("err:", err)
    }
    await sleep(20*1000)

  }
}

main()