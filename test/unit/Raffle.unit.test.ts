import { deployments, ethers, getNamedAccounts, network } from "hardhat";

import { BigNumber } from "ethers";

// @dev-chains : import
import { developmentChains, networkConfig } from "../../helper-hardhat-config";
import { Raffle } from "../../typechain-types";
import { VRFCoordinatorV2Mock } from "../../typechain-types/contracts/testMocks/VRFCoordinatorV2Mock";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai"; // chai is an assertion library

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", () => {
      let raffle: Raffle;
      let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;
      let raffleEntranceFee;
      BigNumber;
      let deployer: SignerWithAddress;
      let interval: BigNumber;
      let accounts: SignerWithAddress[];

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0]; // get deployer address
        await deployments.fixture("all"); // deploy all "deploy/.." that has prefix "all"
        raffle = await ethers.getContract("Raffle", deployer); // get most recent recently deployed contract "Raffle"
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer); // get most recent recently deployed contract "vrfCoordinatorV2Mock"
        const subscriptionId = raffle.getSubscriptionId();
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, raffle.address);
        raffleEntranceFee = await raffle.getEntranceFee();
        interval = await raffle.getInterval();
        // console.log("Interval i s: ",interval)
      });

      describe("constructor", () => {
        // @note Ideally we make our tests have just 1 assert per "it"

        it("Initializes the raffle correctly", async () => {
          const raffleState = await raffle.getRaffleState();
          const entranceFee = await raffle.getEntranceFee();
          assert.equal(entranceFee.toString(), networkConfig[network.name]["raffleEntranceFee"]);
          assert.equal(interval.toString(), networkConfig[network.name]["keepersUpdateInterval"].toString());
          assert.equal(raffleState, 0);
        });
      });

      describe("enterRaffle", () => {
        it("it should return Custom Error if the amount is less than enterFree", async () => {
          await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(raffle, "Raffle__NotEnoughEtherEnetered");
        });

        it("it should record players when they enter", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          const playerFromContract = await raffle.getPlayer(0);
          assert.equal(deployer.address, playerFromContract);
        });

        it("it should emit an event when player entrance a Free", async () => {
          await expect(raffle.enterRaffle({ value: raffleEntranceFee }))
            .to.emit(raffle, "RaffleEnter")
            .withArgs(deployer.address);
        });

        // testing the case when raffle is calculating...
        it("it should revert Error when Lottery is not Open", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]); // increase hardhat block time by "interval + 1"
          await network.provider.send("evm_mine", []); // tell hardhat to mine block
          // by increasing the time and mining a block,  we just need to call performUpKee
          //to simulate the case when raffle is calculating... according to our contract
          await raffle.performUpkeep([]);
          await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWithCustomError(
            raffle,
            "Raffle__RaffleNotOpen"
          );
        });
      });

      describe("performUpkeep", () => {
        it("return false if players haven't sent any ETH", async () => {
          await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]); // increase hardhat block time by "interval + 1"
          await network.provider.send("evm_mine", []); // tell hardhat to mine block
          const [upkeepNeeded] = await raffle.callStatic.checkUpkeep([]); // simulate the call to checkUpkeep using callStatic and get upkeepNeeded from the return array
          assert.equal(upkeepNeeded, false);
        });

        it("return false if raffle isn't open", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]); // increase hardhat block time by "interval + 1"
          await network.provider.send("evm_mine", []); // tell hardhat to mine block
          await raffle.performUpkeep("0x"); // 0x is same as passing [] to performUpkeep
          const raffleState = await raffle.getRaffleState();
          const [upkeepNeeded] = await raffle.callStatic.checkUpkeep([]); // simulate the call to checkUpkeep using callStatic and get upkeepNeeded from the return array
          assert.equal(raffleState, 1);
          assert.equal(upkeepNeeded, false);
        });

        it("return false if enough time hasn't passed", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [interval.toNumber() - (interval.toNumber() - 1)]); // increase hardhat block time by "30 - (30-1) = 29 < 30"
          await network.provider.request({ method: "evm_mine", params: [] }); // tell hardhat to mine block
          const [upkeepNeeded] = await raffle.callStatic.checkUpkeep("0x"); // simulate the call to checkUpkeep using callStatic and get upkeepNeeded from the return array
          assert.equal(upkeepNeeded, false);
        });

        it("return true if enough time has passed, has players, eth, and is open", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]); // increase hardhat block time by "interval + 1"
          await network.provider.send("evm_mine", []); // tell hardhat to mine block
          const [upkeepNeeded] = await raffle.callStatic.checkUpkeep("0x"); // simulate the call to checkUpkeep using callStatic and get upkeepNeeded from the return array
          assert.equal(upkeepNeeded, true);
        });
      });

      describe("performUpkeep", () => {
        it("it should revert with error when checkUpkeep returns false", async () => {
          const contractBalance = await ethers.provider.getBalance(raffle.address);
          const numPlayers = await raffle.getNumPlayers();
          const raffleState = await raffle.getRaffleState();
          await expect(raffle.performUpkeep("0x"))
            .to.be.revertedWithCustomError(raffle, "Raffle__UpkeepNotNeeded")
            .withArgs(contractBalance, numPlayers, raffleState);
        });

        it("it should run if checkUpkeep returns is true", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]); // increase hardhat block time by "interval + 1"
          await network.provider.send("evm_mine", []); // tell hardhat to mine block
          const tx = await raffle.performUpkeep("0x"); // if reverted or failed, it will throw an error & test will fail, and will never reach the next line
          assert(true); // it will fail if tx is undefined
        });

        it("it should change raffle State to Calculating", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]); // increase hardhat block time by "interval + 1"
          await network.provider.send("evm_mine", []); // tell hardhat to mine block
          await raffle.performUpkeep("0x");
          const raffleState = await raffle.getRaffleState();
          assert.equal(raffleState, 1);
        });

        it("it should emit > RequestedRaffleWinner event", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]); // increase hardhat block time by "interval + 1"
          await network.provider.send("evm_mine", []); // tell hardhat to mine block
          await expect(raffle.performUpkeep("0x")).to.emit(raffle, "RequestedRaffleWinner");
        });
      });

      describe("fulfillRandomWords", () => {
        beforeEach(async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]); // increase hardhat block time by "interval + 1"
          await network.provider.send("evm_mine", []); // tell hardhat to mine block
        });

        it("can only be called after performUpkeep", async () => {
          await expect(vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)).to.be.revertedWith(
            "nonexistent request"
          );
          await expect(vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)).to.be.revertedWith(
            "nonexistent request"
          );
        });

        it("picks the winner, resets the lottery and send ETH", async () => {
          // add additional players
          //* @note : deployer = 0, so we start from 1
          const additionalEntrants = 3;
          const startingAccounts = 1;
          // after next for loop we'll have 4 players in the raffle
          for (let i = startingAccounts; i < additionalEntrants + startingAccounts; i++) {
            const signer = accounts[i];
            await raffle.connect(signer).enterRaffle({ value: raffleEntranceFee });
          }
          // let's get our starting timeStamp
          const startingTimeStamp = await raffle.getLatestTimeStamp();
          /**
           * @explnation: what we want to do next ?
           * we want to performUpkeep(mock being chainlink keepers), which will kick calling fulfillRandomWords (mock being chainlink vrf)
           * then on the testnet we will have to wait fo the fulfillRandomWords to be called, since we work with hardhat local chain,
           * we don't need to wait, so we gonna to simulate we do need to wait for that even tto be called,
           * so in order for us to be simulating waiting for that event, we once need to set up a listener, and then we don't want this test
           * to finish before the listener is done
           */
          await new Promise<void>(async (resolve, reject) => {
            raffle.once("RaffleWinnerSelected", async () => {
              // we're listening for the RaffleWinnerSelected event, once it happen
              console.log("found the event");
              try {
                const recentWinnerAddress = await raffle.getRecentWinner();
                console.log("Recent Winner", recentWinnerAddress);
                console.log("accounts : ");
                console.log("accounts[0]", accounts[0].address);
                console.log("accounts[1]", accounts[1].address);
                console.log("accounts[2]", accounts[2].address);
                console.log("accounts[3]", accounts[3].address);
                const raffleState = await raffle.getRaffleState();
                const endingTimeStamp = await raffle.getLatestTimeStamp();
                const numPlayers = await raffle.getNumPlayers();
                const contractBalance = await ethers.provider.getBalance(raffle.address);
                const winnerEndingBalance = await ethers.provider.getBalance(recentWinnerAddress);
                assert.equal(
                  winnerEndingBalance.toString(),
                  winnerStartingBalance.add(raffleEntranceFee.mul(additionalEntrants).add(raffleEntranceFee)).toString()
                );
                assert.equal(numPlayers.toString(), "0");
                assert.equal(contractBalance.toString(), "0");
                assert.equal(raffleState, 0);
                assert(endingTimeStamp > startingTimeStamp);
                resolve();
              } catch (e) {
                reject(e);
              }
            });
            // we'll need to call performUpkeep, here so we can make sure that listener is set up before we call fulfillRandomWords
            // Setting up the listener
            // below, we will fire the event, and teh listener will pcik it up, and resolve
            const tx = await raffle.performUpkeep("0x");
            const txReceipt = await tx.wait(1);
            // since after testing we know that winner is account 1, we will call fulfillRandomWords with 1, let's make sure he gets the prize
            const winnerStartingBalance = await ethers.provider.getBalance(accounts[1].address);
            await vrfCoordinatorV2Mock.fulfillRandomWords(txReceipt.events[1].args.requestId, raffle.address);
          });

          await raffle.enterRaffle({ value: raffleEntranceFee });
        });
      });
    });
