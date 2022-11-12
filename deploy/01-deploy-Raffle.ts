// import { TransactionRequest } from "@ethersproject/providers";
import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Address, DeployFunction } from "hardhat-deploy/types";
// import verify from "../utils/verify"
import { networkConfig, developmentChains } from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployRaffle: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  let vrfCoordinatorV2Mock;

  const chainId: number = network.config.chainId!;
  const VRF_SUB_FUND_AMOUNT = "1000000000000000000000";

  let vrfCoordinatorV2Address: string | undefined, subscriptionId: string | undefined;

  if (developmentChains.includes(network.name)) {
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock"); // get the most recently deployed "VRFCoordinatorV2Mock" contract
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address; // get the address of the most recently deployed "VRFCoordinatorV2Mock" contract
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription(); // create a subscription by calling the createSubscription function of the "VRFCoordinatorV2Mock" contract
    const transactionReceipt = await transactionResponse.wait(); // wait for the transaction to be mined
    subscriptionId = transactionReceipt.events![0].args.subId; // get the subscription id from the event
    // fund the subscription
    // usually, we don't need the link token on a real network
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[network.name]["vrfCoordinatorV2"];
    subscriptionId = networkConfig[network.name]["subscriptionId"];
  }

  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[network.name]["gasLane"],
    networkConfig[network.name]["keepersUpdateInterval"],
    networkConfig[network.name]["raffleEntranceFee"],
    networkConfig[network.name]["callbackGasLimit"],
  ];

  log("----------------------------------------------------");
  log("Deploying Raffle and waiting for confirmations...");
  const raffle = await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
    // we need to wait if on a live network so we can verify properly, on test networks we set up 6 blocks
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });

  if (developmentChains.includes(network.name)) {
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, raffle.address);
  }

  log(`Successfully deployed "Raffle" contract at ${raffle.address}`);
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(raffle.address, args);
  }
  log("----------------------------------------------------");
};
export default deployRaffle;
deployRaffle.tags = ["all", "Raffle"];
