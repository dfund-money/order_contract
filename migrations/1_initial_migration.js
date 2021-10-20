const Swap = artifacts.require("Swap");
const Helper = artifacts.require("Helper");
const cfg=require('../script/config.js')
module.exports = async function (deployer,network, accounts) {
  console.log("ntwork:", network, cfg[network])
  if(network == 'development' || network == 'coverage') return

  let deployerAddr = accounts[0].toLowerCase();

  let admin = cfg[network].admin.toLowerCase()
  let feeTo = cfg[network].feeTo.toLowerCase()
  let operator = cfg[network].operator.toLowerCase()
  let router = cfg[network].router.toLowerCase()
  let mToken = cfg[network].mToken.toLowerCase()
  let discount  = 0
  await deployer.deploy(Swap,deployerAddr,router,feeTo,operator);
  let sw = await Swap.deployed()
  console.log("sw address:", sw.address)

  await deployer.deploy(Helper,admin,mToken, sw.address,feeTo,operator, discount);
  let hp = await Helper.deployed()
  console.log("hp address:", hp.address)




  // set swap operator to the helper contractor.
  await sw.setDepedency(feeTo, hp.address)

  // set the real admin.
  if (deployerAddr !== admin) {
    console.log('renounceRole:', deployerAddr);
    await airDrop.grantRole('0x00', cfg[network].admin);
    await airDrop.renounceRole('0x00', deployerAddr);
  }

};
