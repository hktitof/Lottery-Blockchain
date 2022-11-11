

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
  let raffleEntranceFee;BigNumber;
  let deployer:SignerWithAddress;
  let interval:BigNumber;

  beforeEach(async()=>{
    const accounts = await ethers.getSigners();
    deployer = accounts[0];// get deployer address
    await deployments.fixture("all");// deploy all "deploy/.." that has prefix "all"
    raffle = await ethers.getContract("Raffle",deployer);// get most recent recently deployed contract "Raffle"
    vrfCoordinatorV2Mock=await ethers.getContract("VRFCoordinatorV2Mock",deployer);// get most recent recently deployed contract "vrfCoordinatorV2Mock"
    const subscriptionId=raffle.getSubscriptionId();
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId,raffle.address);
    raffleEntranceFee=await raffle.getEntranceFee();
    interval=await raffle.getInterval();
    // console.log("Interval i s: ",interval)
  })


  describe("constructor",async()=>{
    // @note Ideally we make our tests have just 1 assert per "it"

    it("Initializes the raffle correctly",async()=>{
      const raffleState=await raffle.getRaffleState();     
      const entranceFee = await raffle.getEntranceFee();
      assert.equal(entranceFee.toString(),networkConfig[network.name]["raffleEntranceFee"]);
      assert.equal(interval.toString(),networkConfig[network.name]["keepersUpdateInterval"].toString());
      assert.equal(raffleState,0);

    })
  })


  describe("enterRaffle",async()=>{

    it("it should return Custom Error if the amount is less than enterFree",async()=>{
      await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(raffle,"Raffle__NotEnoughEtherEnetered");
    });

    it("it should record players when they enter",async()=>{
      await raffle.enterRaffle({value:raffleEntranceFee});
      const playerFromContract=await raffle.getPlayer(0);
      assert.equal(deployer.address,playerFromContract);
    });

    it("it should emit an event when player entrance a Free",async()=>{
      await expect(raffle.enterRaffle({value:raffleEntranceFee})).to.emit(raffle,"RaffleEnter").withArgs(deployer.address);
    })

    // testing the case when raffle is calculating...
    it("it should revert Error when Lottery is not Open",async()=>{
      await raffle.enterRaffle({value:raffleEntranceFee});
      await network.provider.send("evm_increaseTime", [interval.toNumber()+1]);// increase hardhat block time by "interval + 1"
      await network.provider.send("evm_mine",[]);// tell hardhat to mine block
      // by increasing the time and mining a block,  we just need to call performUpKee 
      //to simulate the case when raffle is calculating... according to our contract
      await raffle.performUpkeep([]);
      await expect(raffle.enterRaffle({value:raffleEntranceFee})).to.be.revertedWithCustomError(raffle,"Raffle__RaffleNotOpen");
      
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
