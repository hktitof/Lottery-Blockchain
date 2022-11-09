// Raffle
// Goals:
// Enter the lottery (paying some amount)
// Pick a random winner ( verfiably random)
// Winner to be selected every X minutes .> completly automated
// Chainlink Oracle -> Randomness, Automated Execution ( Chainlink Keeper Network)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

/*Errors*/

error Raffle__NotEnoughEtherEnetered();
error Raffle__TransferError();
error Raffle__RaffleNotOpen();
error Raffle__UpkeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayer,
    uint256 raffleState
);


/** @title A sample Raffle contract
*   @author Abdellatif Anaflous
*   @notice This contract is for creating an untaperable decentralized smart contract raffle
*   @dev This implements Chainlink VRF v2 & chainlink Keepers
*/
contract Raffle is VRFConsumerBaseV2, AutomationCompatible {
    /* Type decalrations */
    enum RaffleState {
        OPEN,
        CALCULATING_WINNER
    }

    /*State Variables*/
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    // i_gasLane : The gas lane key hash value, which is the maximum gas price you are willing to pay for a request in wei.
    // It functions as an ID of the off-chain VRF job that runs in response to requests.
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId; //The subscription ID that this contract uses for funding requests.
    uint16 private constant REQUEST_CONFIRMATIONS = 3; //How many confirmations the Chainlink node should wait before responding
    //The limit for how much gas to use for the callback request to your contract's fulfillRandomWords() function.
    // It must be less than the maxGasLimit limit on the coordinator contract.
    // If your callbackGasLimit is not sufficient, the callback will fail and your subscription
    //is still charged for the work done to generate your requested random values.
    uint32 private immutable i_callBackGasLimit;
    //How many random values to request. If you can use several random values in a single callback,
    // you can reduce the amount of gas that you spend per random value.
    uint32 private constant NUM_WORDS = 1;

    /*Lottery Variables*/
    address private s_recentWinnerAddress;
    RaffleState private s_raffleState; // track if the raffle is open or not, meaning if the raffle in a process of picking a winner or not
    uint256 private s_lastTimeStamp; // the last time the raffle was picked
    uint256 private immutable i_interval; // the time interval between each raffle

    /*Events*/
    event RaffleEnter(address indexed player); // track who entered the raffle
    event ReqeustedRaffleWinner(uint256 indexed requestId); // track Raffle winner requester
    event RaffleWinnerSelected(address indexed winner); // track Winner List

    /*Function*/// @title A title that should describe the contract/interface
    /// @author The name of the author
    /// @notice Explain to an end user what this does
    /// @dev Explain to a developer any extra details
    constructor(
        address vrfCoordinatorAddressV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callBackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorAddressV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorAddressV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callBackGasLimit = callBackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    /*Modifiers*/
    modifier amountVerification() {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughEtherEnetered();
        }
        _;
    }

    modifier raffleOpen() {
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__RaffleNotOpen();
        }
        _;
    }

    function enterRaffle() external payable amountVerification raffleOpen {
        s_players.push(payable(msg.sender));
        // tip : event name should be as function's name reversed example : raffleEnter
        emit RaffleEnter(msg.sender);
    }

    /**
     * @dev the function that the chainlink keeper nodes call
     * they look for the 'upkeepNeeded' to return true.
     * The following should be true in order to return true:
     * 1.. Our time interval shoul have passed .
     * 2.. We should have at least one player in the raffle and some ETH.
     * 3. Our Subscription is funded with LINK.
     * 4. The lottery should be in an "open" state.
     */

    function checkUpkeep(
        bytes memory /*checkData*/
    )
        public
        override
        returns (
            bool upkeepNeeded,
            bytes memory /*performData*/ /* performDataa : Contains the logic that should be executed on-chain when checkUpkeep returns true.*/
        )
    {
        bool isOpen = (RaffleState.OPEN == s_raffleState);
        bool isTime = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = (address(this).balance >= 0);
        upkeepNeeded = (isOpen && isTime && hasPlayers && hasBalance); //
    }

    function performUpkeep(
        bytes calldata /*performData*/
    ) external override {
        // Request a random number from Chainlink VRF
        // Chainlink VRF will return a random number
        // Pick a random player from the array
        // Once we get it, Transfer the prize to the winner
        // 2 transactions process, so we gonna make that nobody can manipulate our smart contract
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Raffle__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );
        }
        s_raffleState = RaffleState.CALCULATING_WINNER;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callBackGasLimit,
            NUM_WORDS
        );
        emit ReqeustedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256, /*requestId we're not using this parameter inside this function even if it's defined in the interface*/
        uint256[] memory randomWords
    ) internal override {
        // Chainlink VRF will call this function once it has a random number
        // Pick a random player from the array
        // Once we get it, Transfer the prize to the winner

        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinnerAddress = s_players[indexOfWinner];
        s_recentWinnerAddress = recentWinnerAddress;
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0); // reset the players array to empty
        s_lastTimeStamp = block.timestamp;// reset the last time stamp to the current time
        (bool success, ) = s_recentWinnerAddress.call{
            value: address(this).balance
        }(""); // transfer the prize "contract balance" to the winner
        if (!success) {
            revert Raffle__TransferError();
        }
        emit RaffleWinnerSelected(s_recentWinnerAddress);
    }

    /* View & Pure Functions*/

    function getEntranceFree() external view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) external view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinnerAddress;
    }

    function getRaffleSTate() public view returns(RaffleState) {
        return s_raffleState;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNumPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLatestTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }
}
