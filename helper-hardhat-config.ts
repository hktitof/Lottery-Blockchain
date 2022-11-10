// in this file we're telling
// if chainId is X use address Y
// if chainId is Z use address W
// so this will be used in the deploy script= and help hardhat what to do with the addresses
import { ethers } from "hardhat";
import { BigNumber } from 'ethers';
export interface networkConfigItem  {
    ethUsdPriceFeed?: string;
    blockConfirmations?: number;
    raffleEntranceFee?:string;
    gasLane?: string;
    subscriptionId?: string;
    callbackGasLimit?:String;
    keepersUpdateInterval?:String;
    vrfCoordinatorV2?:string
  }
  
  export interface networkConfigInfo {
    [key: string]: networkConfigItem;
  }
  
  export const networkConfig: networkConfigInfo = {
    localhost: {},
    hardhat: {
      raffleEntranceFee: "100000000",
      // gasLane : hardhat doesn't care about what gasLane we're working on, because we're going to be mocking the gasLane anyways
      gasLane:"0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
      callbackGasLimit:"100000",
      keepersUpdateInterval:"30"// 30 seconds
    },
    // if it's rinkeby Network use this address "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
    rinkeby: {
      ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
      blockConfirmations: 6,
    },
    // if it's polygon Network use this address "0xF9680D99D6C9589e2a93a78A04A279e509205945"
    polygon: {
      ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
      blockConfirmations: 6,
    },
    // if it's goerli Network use this address "0xF9680D99D6C9589e2a93a78A04A279e509205945"
    goerli: {
      blockConfirmations: 6,
      vrfCoordinatorV2:"0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
      raffleEntranceFee:"100000000",
      gasLane:"0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
      subscriptionId:"0",
      callbackGasLimit:"100000",
      keepersUpdateInterval:"30"// 30 seconds
    },
    
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one is ETH/USD contract on Kovan
    kovan: {
      ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
      blockConfirmations: 6,
    },
  };
  
  export const developmentChains = ["hardhat", "localhost"];