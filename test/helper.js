const Swap = artifacts.require("Swap");
const Helper = artifacts.require("Helper");
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
contract("Helper check", function (accounts) {
  let router
  let admin = accounts[98];
  let feeTo = accounts[97];
  let operator = accounts[96];
  let tuser = accounts[21]
  let discount = 0

  let swap,helper, tokenm,  token18, token6,fakeUni
  before("init",async function () {
    fakeUni = await FakeUni.new();
    router = fakeUni.address;
    swap = await Swap.new(admin, router, feeTo, operator);
    
    token18 = await FakeErc20.new("T18", "T18", 18)
    token6 = await FakeErc20.new("T6", "T6", 6)
    tokenm = await FakeErc20.new("MMM", "MMM", 18)
    helper = await Helper.new(admin, tokenm.address, swap.address, feeTo, operator, discount)
    await swap.setDepedency(feeTo, helper.address, {from:admin})
    await token6.mint(router, BigNumber('1e24'))
    await token18.mint(tuser, BigNumber('1e24'))
    await token18.approve(swap.address, BigNumber('9e20'), {from:tuser})
    await tokenm.mint(admin, BigNumber('1e24'))
  })
  
  it("check setDepedency",async function () {
    let tx = helper.setDepedency(token6.address, feeTo, 1, {from:operator})
    await expectRevert(tx, "invalid sender")
    tx = helper.setDepedency(token6.address, feeTo, 9, {from:admin})
    await expectRevert(tx, "invalid discount")
    tx = await helper.setDepedency(tokenm.address, feeTo, 1, {from:admin})
    let nd = await helper.discount()
    assert.equal(1, nd, "discount error")

  })
  it("check calMtokenAmount discount==0",async function () {
    await helper.setDepedency(tokenm.address, feeTo, 0,{from:admin})
    let vin = new BigNumber("10000")
    let vout = await helper.calMtokenAmount(vin, [tokenm.address, tokenm.address])
    console.log("calMtokenAmount:", vin.toString(10), vout.toString(10))
    assert.equal("0",  vout.toString(10))
  })
  it("check calMtokenAmount discount!=0",async function () {
    await helper.setDepedency(tokenm.address, feeTo, 2,{from:admin})
    let vin = new BigNumber("10000")
    let vout = await helper.calMtokenAmount(vin, [tokenm.address, tokenm.address])  
    console.log("calMtokenAmount:", vin.toString(10), vout.toString(10))
    assert.equal(vout.toString(10), "6")

  })

  it("check calMtokenAmount discount!=0",async function () {
    await helper.setDepedency(tokenm.address, feeTo, 2,{from:admin})
    let vin = new BigNumber("10000")
    let vout = await helper.calMtokenAmount(vin, [token18.address, tokenm.address])  
    console.log("calMtokenAmount:", vin.toString(10), vout.toString(10))
    assert(vout.toString(10)=="6")

  })

  it("check setDepedency",async function () {
    let soperator = await swap.operator()
    let hoperator = await helper.operator()
    console.log("operator:", operator, hoperator, soperator, helper.address)
    assert(soperator==helper.address)
    assert(hoperator==operator)
    
  })

  it("check helpSwap",async function () {
    let path = [token18.address, token6.address]
    let pathm = [token18.address, tokenm.address]
    let patho = [token6.address, tokenm.address]
    let pathmo = [token18.address, token6.address]

    let tx,key
    let vin = BigNumber('1e18');
    let vout = BigNumber('1e6');
    tx = await swap.changeOrder(token18.address, token6.address, 800000000, vin, true, 10,{from:tuser})
    key = getKey(tuser,token18.address,token6.address, 800000000)
    tx =  helper.helpSwap(key, pathm, path, vin, vout, false, {from: tuser})
    await expectRevert(tx, "invalid sender")
    tx =  helper.helpSwap(key, pathmo, path, vin, vout, false, {from: operator})
    await expectRevert(tx, "invalid mtoken")
    tx =  helper.helpSwap(key, pathm, patho, vin, vout, false, {from: operator})
    await expectRevert(tx, "invalid path")



    await helper.setDepedency(tokenm.address, feeTo, 1,{from:admin})
    let balance1, balance2
    // has no tokenm
    tx = helper.helpSwap(key, pathm, path, vin, vout, false, {from: operator})
    await expectRevert(tx, 'invalid out')
    await tokenm.transfer(tuser, BigNumber('1e18'), {from:admin})
    tx = helper.helpSwap(key, pathm, path, vin, vout, false, {from: operator})
    await expectRevert(tx, 'invalid out')


    // approve enough
    await tokenm.approve(helper.address, BigNumber('1e18'), {from:tuser})
    balance1 = await token6.balanceOf(tuser)
    balance1m = await tokenm.balanceOf(tuser)
    tx = await helper.helpSwap(key, pathm, path, vin, vout, false, {from: operator})
    balance2 = await token6.balanceOf(tuser)
    balance2m = await tokenm.balanceOf(tuser)
    assert.equal(balance2-balance1, 1000000, "helpSwap error")
    assert.equal(balance1m-balance2m, 300000000000000, "helpSwap error")

    tx = helper.helpSwap(key, pathm, path, vin, vout, false, {from: operator})
    await expectRevert(tx, 'interval')

  })




});

contract("Helper check", function (accounts) {
  let router
  let admin = accounts[98];
  let feeTo = accounts[97];
  let operator = accounts[96];
  let tuser = accounts[21]
  let discount = 0

  let swap,helper, tokenm,  token18, token6,fakeUni
  before("init",async function () {
    fakeUni = await FakeUni.new();
    router = fakeUni.address;
    swap = await Swap.new(admin, router, feeTo, operator);
    
    token18 = await FakeErc20.new("T18", "T18", 18)
    token6 = await FakeErc20.new("T6", "T6", 6)
    tokenm = await FakeErc20.new("MMM", "MMM", 18)
    helper = await Helper.new(admin, tokenm.address, swap.address, feeTo, operator, discount)
    await swap.setDepedency(feeTo, helper.address, {from:admin})
    await token6.mint(router, BigNumber('1e24'))
    await token18.mint(tuser, BigNumber('1e24'))
    await token18.approve(swap.address, BigNumber('9e20'), {from:tuser})
    await tokenm.mint(admin, BigNumber('1e24'))
  })
  it("check helpSwap",async function () {
    let path = [token18.address, token6.address]
    let pathm = [token18.address, tokenm.address]

    let tx,key
    let vin = BigNumber('1e18');
    let vout = BigNumber('1e6');

    // approve enough discount ==0
    tx = await swap.changeOrder(token18.address, token6.address, 800000000, vin, false, 10,{from:tuser})
    key = getKey(tuser,token18.address,token6.address, 800000000)
    await helper.setDepedency(tokenm.address, feeTo, 0,{from:admin})
    await tokenm.approve(helper.address, BigNumber('1e18'), {from:tuser})
    balance1 = await token6.balanceOf(tuser)
    balance1m = await tokenm.balanceOf(tuser)
    tx = await helper.helpSwap(key, pathm, path, vin, vout, false, {from: operator})
    balance2 = await token6.balanceOf(tuser)
    balance2m = await tokenm.balanceOf(tuser)
    assert.equal(balance2-balance1, 1000000, "helpSwap error")
    assert.equal(balance1m-balance2m, 0, "helpSwap error")
    
    // not enough balance
    tx = await swap.changeOrder(token18.address, token6.address, 800000001, vin, false, 10,{from:tuser})
    key = getKey(tuser,token18.address,token6.address, 800000001)
    await helper.setDepedency(tokenm.address, feeTo, 1,{from:admin})
    await tokenm.approve(helper.address, BigNumber('1e18'), {from:tuser})
    balance1 = await token6.balanceOf(tuser)
    balance1m = await tokenm.balanceOf(tuser)
    tx = await helper.helpSwap(key, pathm, path, vin, vout.times(997).div(1000), false, {from: operator})
    balance2 = await token6.balanceOf(tuser)
    balance2m = await tokenm.balanceOf(tuser)
    assert.equal(balance2-balance1, 997000, "helpSwap error")
    assert.equal(balance1m-balance2m, 0, "helpSwap error")

    // not enough allowance
    tx = await swap.changeOrder(token18.address, token6.address, 800000002, vin, false, 10,{from:tuser})
    key = getKey(tuser,token18.address,token6.address, 800000002)
    await helper.setDepedency(tokenm.address, feeTo, 1,{from:admin})
    await tokenm.transfer(tuser, BigNumber('1e18'), {from: admin})
    await tokenm.approve(helper.address, BigNumber('3e14').minus(1), {from:tuser})
    balance1 = await token6.balanceOf(tuser)
    balance1m = await tokenm.balanceOf(tuser)
    tx = await helper.helpSwap(key, pathm, path, vin, vout.times(997).div(1000), false, {from: operator})
    balance2 = await token6.balanceOf(tuser)
    balance2m = await tokenm.balanceOf(tuser)
    //assert.equal(balance2-balance1, 997000, "helpSwap error")
    assert.equal(balance1m-balance2m, 0, "helpSwap error")

    tx = await swap.changeOrder(token18.address, token6.address, 800000003, vin, false, 10,{from:tuser})
    key = getKey(tuser,token18.address,token6.address, 800000003)
    await helper.setDepedency(tokenm.address, feeTo, 2,{from:admin})
    await tokenm.transfer(tuser, BigNumber('1e18'), {from: admin})
    await tokenm.approve(helper.address, BigNumber('6e14'), {from:tuser})
    balance1 = await token6.balanceOf(tuser)
    balance1m = await tokenm.balanceOf(tuser)
    tx = await helper.helpSwap(key, pathm, path, vin, vout, false, {from: operator})
    balance2 = await token6.balanceOf(tuser)
    balance2m = await tokenm.balanceOf(tuser)
    assert.equal(balance2-balance1, 1000000, "helpSwap error")
    assert.equal(balance1m-balance2m, 600000000000000, "helpSwap error")
  });
});