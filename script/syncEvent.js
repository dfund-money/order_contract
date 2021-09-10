const keccak256 = require('keccak256')
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

async function sync() {
  let dbData = new DbData()
  await dbData.dbinit()
  startBlock = cfg[cfg.network].startBlock
  let lastBlock = await dbData.getLastBlock()
  if(startBlock < lastBlock ){
    startBlock = lastBlock
  }
  console.log("startBlock:", startBlock)
  
  let web3 = new Web3(cfg[cfg.network].web3Url)
  let curBlock = await web3.eth.getBlockNumber()
  console.log("curBlock:", curBlock)

  let {sw} = await init()

  let step = 1000
  for(let i=startBlock; i<curBlock; ){
    let endBlock = i+step-1
    if(endBlock > curBlock) {
      endBlock = curBlock
    }
    let eventOption = {
      fromBlock: i,
      toBlock: endBlock
    }
    let events = await sw.getPastEvents('changeOrderEvent', eventOption)


    let logs = []
    events.map(item=>{
      one = {}
      one.key = item.returnValues.key
      one.user = item.returnValues.user
      one.fromToken = item.returnValues.fromToken
      one.toToken = item.returnValues.toToken
      one.price = item.returnValues.price
      one.amount = item.returnValues.amount
      logs.push(one)
    })
    console.log("logs:", logs)

    dbData.saveLastBlock(endBlock)
    dbData.saveRecords(logs)
    i = endBlock+1
  }

  
}
async function main() {
  while(true){
    try {
      
      await sync()
      
    }catch(err) {
      console.log("err:", err)
    }
    await sleep(5000)

  }
}

main()