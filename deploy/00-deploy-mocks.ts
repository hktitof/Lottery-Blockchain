/**
 * @note : this mocks is used when we deploy to the hardhat network or local network
 * so mocks are used to simulate the chainlink oracle
 */
 import { HardhatRuntimeEnvironment } from "hardhat/types"
 import { DeployFunction } from "hardhat-deploy/types"
import {developmentChains} from "../helper-hardhat-config"

 const DECIMALS = "18"
const INITIAL_PRICE = "2000000000000000000000" // 2000
const deployMocks: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  // If we are on a local development network, we need to deploy mocks!
  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...")
    // deploy a mock vvrfcoordinator...
    await deploy("VRFCoordinatorV2Mock", {
        // TODO : continue here 
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    })
    log("Mocks Deployed!")
    log("----------------------------------")
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    )
    log(
      "Please run `yarn hardhat console` to interact with the deployed smart contracts!"
    )
    log("----------------------------------")
  }
}
export default deployMocks
deployMocks.tags = ["raffle", "mocks"]