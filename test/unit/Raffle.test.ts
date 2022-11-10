

import { deployments, ethers, getNamedAccounts, network } from "hardhat";

import { BigNumber } from "ethers";
import { id } from "ethers/lib/utils";

// @dev-chains : import
import { developmentChains, networkConfig } from './../../helper-hardhat-config';
import { Raffle } from "./../../typechain-types";
import {VRFCoordinatorV2Mock} from "./../../typechain-types/contracts/testMocks/VRFCoordinatorV2Mock";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";// chai is an assertion library


!developmentChains.includes(network.name) ? describe.skip:describe(
"Raffle", async ()=>{
  let raffle: Raffle;
  let vrfCoordinatorV2Mock:VRFCoordinatorV2Mock;
  

  beforeEach(async()=>{
    const {deployer} = await getNamedAccounts();// get deployer address
    await deployments.fixture("all");// deploy all "deploy/.." that has prefix "all"
    raffle = await ethers.getContract("Raffle",deployer);// get most recent recently deployed contract "Raffle"
    vrfCoordinatorV2Mock=await ethers.getContract("VRFCoordinatorV2Mock",deployer);// get most recent recently deployed contract "vrfCoordinatorV2Mock"
  })


  describe("constructor",async()=>{
    // @note Ideally we make our tests have just 1 assert per "it"

    it("Initializes the raffle correctly",async()=>{
      const raffleState=await raffle.getRaffleState();     
      const interval = await raffle.getInterval();

      assert.equal(interval.toString(),networkConfig[network.name]["keepersUpdateInterval"].toString());
      assert.equal(raffleState,0);

    })
  })





}

);


// describe("Raffle", async () => {
//   let Raffle: Raffle;
//   let deployer: SignerWithAddress;
//   let user1: SignerWithAddress;
//   const entranceFee = ethers.utils.parseEther("1");

//   beforeEach(async () => {
//     // deploy our Raffle contract
//     // using Hardhat-deploy
//     // ? we'll grab also accounts if we need them
//     /**
//      * const accounts = await ethers.getSigners();
//      * const accountZero = accounts[0];
//      */
//     const accounts = await ethers.getSigners();
//     deployer = accounts[0]; // we will abstract deployer from the return value of getNamedAccounts
//     await deployments.fixture(["Raffle"]); // deploy all contracts that export the tag "Raffle"
//     Raffle = await ethers.getContract("Raffle"); // getContract will get the most recently deployed "Raffle" contract
//   });

//   describe("constructor", function () {
//     it("set the entranceFee", async () => {
//       const response = await Raffle.getEntranceFree();
//       console.log("the type of response is : ", response.toBigInt);
//       assert.equal(response.toBigInt, entranceFee.toBigInt);
//     });
//   });

//   describe("enterRaffle", async () => {
//     it("should revert when user enterRaffle les than current entranceFee", async () => {
//       await expect(Raffle.enterRaffle({ value: ethers.utils.parseEther("0.1") })).to.be.revertedWithCustomError(
//         Raffle,
//         "Raffle__NotEnoughEtherEnetered"
//       );
//     });
//     // it("it should store the sender of enterRaffle", async () => {
//     //     await Raffle.enterRaffle({ value: entranceFee });
//     //     const players = await Raffle.getPlayer(deployer.address);
//     //   })
//   });

//   describe("getEntranceFree", async () => {
//     it("should return the current entranceFee", async () => {
//       assert.equal((await Raffle.getEntranceFree()).toBigInt, entranceFee.toBigInt);
//     });
//   });

// });
