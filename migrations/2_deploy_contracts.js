var MindPay = artifacts.require("./MindPay.sol");

module.exports = function(deployer) {
  deployer.deploy(MindPay);
};
