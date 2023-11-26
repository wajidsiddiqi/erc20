const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"];
  /*"0xF18DC19aCff2feA64202E6db906187CAa9803Fd0"*/
  const myToken = await deploy("MyToken", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying.....");
    await verify(myToken.address, args);
  }

  log("---------------------------------------");
};

module.exports.tags = ["all", "myToken", "main"];
