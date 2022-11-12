import { deployments, ethers, getNamedAccounts, network } from "hardhat";

import { BigNumber } from "ethers";

// @dev-chains : import
import { developmentChains, networkConfig } from "./../../helper-hardhat-config";
import { Raffle } from "./../../typechain-types";
import { VRFCoordinatorV2Mock } from "./../../typechain-types/contracts/testMocks/VRFCoordinatorV2Mock";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai"; // chai is an assertion library

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Staging Tests", () => {
      let raffle: Raffle;
      let raffleEntranceFee;
      BigNumber;
      let deployer: SignerWithAddress;
      let interval: BigNumber;
      let accounts: SignerWithAddress[];

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0]; // get deployer address
        raffle = await ethers.getContract("Raffle", deployer); // get most recent recently deployed contract "Raffle"
        raffleEntranceFee = await raffle.getEntranceFee();
        // console.log("Interval i s: ",interval)
      });

      describe("fulfillRandomWords", () => {
        it("check if it works with live Chainlink Keepers and chainlink, VRF we get a random winner", async () => {
          const startingTimeStamp = await raffle.getLatestTimeStamp();
          // setup listener before we enter the raffle, just in case the hblockchain is fast and we miss the event
          await new Promise<void>(async (resolve, reject) => {
            raffle.once("RaffleWinnerSelected", async () => {
              console.log("RaffleWinnerSelected event fired");
              try {
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerEndingBalance = await accounts[0].getBalance();
                const endingTimeStamp = await raffle.getLatestTimeStamp();
                await expect(raffle.getPlayer(0)).to.be.reverted;
                assert.equal(recentWinner.toString(), accounts[0].address);
                assert.equal(raffleState, 0);
                assert.equal(winnerEndingBalance.toString(), winnerStartingBalance.add(raffleEntranceFee).toString());
                assert(endingTimeStamp > startingTimeStamp);
                resolve();
              } catch (error) {
                console.log(error);
                reject(error);
              }
            });
            // enter the raffle
            console.log("Entering Raffle...");
            const tx = await raffle.enterRaffle({
              value: raffleEntranceFee,
            });
            await tx.wait(1);
            console.log("Ok, time to wait...");
            const winnerStartingBalance = await accounts[0].getBalance();
            // this code won't complete until our listener has finished listening to the event!
          });
        }).timeout(400000);
      });
    });
