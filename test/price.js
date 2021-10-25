const Swap = artifacts.require("Swap");
const FakeErc20 = artifacts.require("FakeErc20");
const FakeUni = artifacts.require("FakeUni");

const BigNumber = require('bignumber.js')
const assert = require('assert')
const keccak256 = require('keccak256')

const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');


function getKey(user, fromToken, toToken, price) {
  let binaryData = web3.eth.abi.encodeParameters(['address','address','address','uint256'], [user, fromToken,toToken, price]);
  let key = keccak256(binaryData);
  return '0x'+key.toString('hex')
}
contract("Swap check", function (accounts) {
  let router
  let admin = accounts[98];
  let feeTo = accounts[97];
  let operator = accounts[96];
  let tuser = accounts[21]

  let swap, token18, token6,fakeUni
  before("init",async function () {
    fakeUni = await FakeUni.new();
    router = fakeUni.address;
    swap = await Swap.new(admin, router, feeTo, operator);
    token18 = await FakeErc20.new("T18", "T18", 18)
    token6 = await FakeErc20.new("T6", "T6", 6)
    await token6.mint(router, BigNumber('1e24'))
  })
  it("check price",async function () {
    let vin = new BigNumber("1000000000000000")
    let vout = new BigNumber("730095")
    let res = await swap.getRealPrice(token18.address, 
    token6.address, '0x'+vout.toString(16), '0x'+vin.toString(16))
    console.log("getRealPrice:",res.toString(10))
  })
  it("check changeOrder",async function () {
    let tx
    tx = swap.changeOrder(token18.address, token18.address, 0, 0, true, 0)
    await expectRevert(tx, "same")
    tx = swap.changeOrder(token18.address, token6.address, 0, 0, true, 0)
    await expectRevert(tx, 'invalid price')
    tx = await swap.changeOrder(token18.address, token6.address, 1000000000, 0, true, 0)
    expectEvent(tx, 'changeOrderEvent', {key:getKey(accounts[0],token18.address,token6.address, 1000000000)})
    
    tx = await swap.changeOrder(token18.address, token6.address, 1000000000, 100, true, 0)
    expectEvent(tx, 'changeOrderEvent', {key:getKey(accounts[0],token18.address,token6.address, 1000000000)})
  })
  it("check setDepedency",async function () {
    let tx
    tx = swap.setDepedency(feeTo, operator,{from: accounts[9]})
    await expectRevert(tx, "not admin")

    await swap.setDepedency(accounts[11], accounts[12],{from: admin})

    let newFeeTo = await swap.feeTo()
    let newOperator = await swap.operator()
    assert(newFeeTo, accounts[11])
    assert(newOperator, accounts[12])
    await swap.setDepedency(feeTo, operator,{from: admin})
  })

  it("check swap",async function () {
    let tx,key
    let vin = BigNumber('1e18');
    tx = await swap.changeOrder(token18.address, token6.address, 900000000, vin, true, 10,{from:tuser})
    key = getKey(tuser,token18.address,token6.address, 900000000)
    let vout = BigNumber(1000000); // 1e6
    tx = swap.swap(key, [], vin, vout,false,false,{from: accounts[9]})
    await expectRevert(tx, "invalid sender")

    tx = swap.swap(key, [], vin, vout,false,false,{from: operator})
    console.log("swap.operator:",await swap.operator(), operator)
    await expectRevert(tx, "invalid path")
    tx = swap.swap(key, [token18.address, token6.address], BigNumber(0), vout,false,false,{from: operator})
    await expectRevert(tx, "invalid amount")
    tx = swap.swap(key, [token18.address, token6.address], BigNumber('1.1e18'), vout,false,false,{from: operator})
    await expectRevert(tx, "invalid amount")
    tx = swap.swap(key, [token6.address, token6.address], BigNumber('1e18'), vout,false,false,{from: operator})
    await expectRevert(tx, 'invalid fromToken')
    tx = swap.swap(key, [token18.address, token18.address], BigNumber('1e18'), vout,false,false,{from: operator})
    await expectRevert(tx, 'invalid toToken')

    tx = swap.swap(key, [token18.address, token6.address], BigNumber('1e18'), BigNumber(8e5-1),false,false,{from: operator})
    await expectRevert(tx, 'invalid price')

    tx = await swap.swap(key, [token18.address, token6.address], BigNumber('1e18'), BigNumber(1e6),false,false,{from: operator})
    expectEvent(tx, 'ignore')
    tx = await swap.swap(key, [token18.address, token6.address], BigNumber('1e18'), BigNumber(1e6+1),false,false,{from: operator})
    expectEvent(tx, 'ignore')

    await token18.mint(tuser, BigNumber('9e18'))
    tx = await swap.swap(key, [token18.address, token6.address], BigNumber('1e18'), BigNumber(1e6),false,false,{from: operator})
    expectEvent(tx, 'ignore')
    tx = await swap.swap(key, [token18.address, token6.address], BigNumber('1e18'), BigNumber(1e6+1),false,false,{from: operator})
    //console.log("swap.swap tx:", tx)
    expectEvent(tx, 'ignore')

    await token18.approve(swap.address, BigNumber('1e24'),{from:tuser})
    let balance = await token18.balanceOf(tuser)
    console.log("balance:", balance.toString(10))
    let allowance = await token18.allowance(tuser, swap.address)
    console.log("allowance:", allowance.toString(10))
    let record

    await swap.changeOrder(token18.address, token6.address, 900000001, vin, true, 10,{from:tuser})
    key = getKey(tuser,token18.address,token6.address, 900000001)
    let balance1 = await token6.balanceOf(tuser)
    tx = await swap.swap(key, [token18.address, token6.address], vin, BigNumber(1e6).times(997).div(1000),false,false,{from: operator})
    //console.log("tx:", tx)
    let balance2 = await token6.balanceOf(tuser)
    assert.equal(balance2.sub(balance1).toString(10), "997000")
    record = await swap.records(key)
    assert.equal(record.amount.toString(10), vin.toString(10))
  })
  it("check swap",async function () {
    let tx,key
    let vin = BigNumber('1e18');
    let balance1 = await token6.balanceOf(tuser)
    await swap.changeOrder(token18.address, token6.address, 900000002, vin, false, 10,{from:tuser})
    key = getKey(tuser,token18.address,token6.address, 900000002)
    tx = await swap.swap(key, [token18.address, token6.address], vin, BigNumber(1e6).times(997).div(1000),false,false,{from: operator})
    //console.log("tx:", tx)
    let balance2 = await token6.balanceOf(tuser)
    assert.equal(balance2.sub(balance1).toString(10), "997000")
    record = await swap.records(key)
    assert.equal(record.amount.toString(10), "0")


  })

  it.skip("check swap",async function () {
    let tx,key
    let vin = BigNumber('1e18');
    let balance1 = await token6.balanceOf(tuser)
    await swap.changeOrder(token18.address, token6.address, 900000003, vin, false, 10,{from:tuser})
    key = getKey(tuser,token18.address,token6.address, 900000003)
    tx = await swap.swap(key, [token18.address, token6.address], vin, BigNumber(1e6).times(997).div(1000),false,false,{from: operator})
    let balance2 = await token6.balanceOf(tuser)
    assert.equal(balance2.sub(balance1).toString(10), BigNumber(1e5).toString(10))
    record = await swap.records(key)
    assert.equal(record.amount.toString(10), "0")
  })
});

