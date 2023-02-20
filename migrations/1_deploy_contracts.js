
const BTT = artifacts.require("BytradeToken");

module.exports = async function(deployer) {
  deployer.deploy(BTT, "0x7747987d6C91Cf4fDc2D7e9534fDEAb9F7718687");
};
