const Swap = artifacts.require("Swap");
const cfg=require('../script/config.js')
module.exports = async function (deployer,network) {
  console.log("ntwork:", network, cfg[network])
  let admin = cfg[network].admin
  let feeTo = cfg[network].feeTo
  let operator = cfg[network].operator
  let router = cfg[network].router
  await deployer.deploy(Swap,admin,router,feeTo,operator);
  let sw = await Swap.deployed()
  console.log("sw address:", sw.address)
};
