const Swap = artifacts.require("Swap");
module.exports = async function (deployer) {
  let admin = "0xEf73Eaa714dC9a58B0990c40a01F4C0573599959"
  let feeTo = "0xbED2Af202C908d4134bbDFe280A3423597C204FD"
  let router = "0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1"
  await deployer.deploy(Swap,admin,router,feeTo);
  let sw = await Swap.deployed()
  console.log("sw address:", sw.address)
};
