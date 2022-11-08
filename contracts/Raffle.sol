// Raffle
// Goals:
// Enter the lottery (paying some amount)
// Pick a random winner ( verfiably random)
// Winner to be selected every X minutes .> completly automated
// Chainlink Oracle -> Randomness, Automated Execution ( Chainlink Keeper Network)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
error NotEnoughEther();
contract Raffle{

    uint256 private immutable i_entranceFee;

    constructor(uint256 entranceFee){
        i_entranceFee = entranceFee;
    }
    modifier amountVerification(){
        if(msg.value < i_entranceFee){
            revert NotEnoughEther();
        }
        _;
    }
    function enterRaffle() public payable amountVerification{
        
    }


    function getEntranceFree () public view returns(uint256){
        return i_entranceFee;
    }


    // function pickRandomWinner(){}
}