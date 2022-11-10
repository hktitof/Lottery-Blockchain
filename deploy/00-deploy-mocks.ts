/**
 * @note : this mocks is used when we deploy to the hardhat network or local network
 * so mocks are used to simulate the chainlink oracle
 */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains } from "../helper-hardhat-config";
import { ethers } from "hardhat";



//* @note : this mock has a constructor that takes two parameters uint96 _baseFee, uint96 _gasPriceLink
const BASE_FEE = ethers.utils.parseEther("0.25"); // 0.25 is the premium. It cost 0.25 LINK per request
const GAS_PRICE_LINK = 1e9; //1000000000 // LINK per gas, it's a calculated value based on the gas price of the chain.

const deployMocks: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const args = [BASE_FEE, GAS_PRICE_LINK];
  // If we are on a local development network, we need to deploy mocks!
  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...");
    // deploy a mock vvrfcoordinator...
    await deploy("VRFCoordinatorV2Mock", {
      // TODO : continue here 15:05:44
      from: deployer,
      log: true,
      args: args,
    });
    log("Mocks Deployed!");
    log("----------------------------------");
    log("You are deploying to a local network, you'll need a local network running to interact");
    log("Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!");
    log("----------------------------------");
  }
};
export default deployMocks;
deployMocks.tags = ["all","raffle", "mocks"];
