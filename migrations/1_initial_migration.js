const Swap = artifacts.require("Swap");
const cfg=require('../script/config.js')
module.exports = async function (deployer) {
  let admin = cfg[cfg.network].admin
  let feeTo = cfg[cfg.network].feeTo
  let operator = cfg[cfg.network].operator
  let router = cfg[cfg.network].router
  await deployer.deploy(Swap,admin,router,feeTo,operator);
  let sw = await Swap.deployed()
  console.log("sw address:", sw.address)
};
