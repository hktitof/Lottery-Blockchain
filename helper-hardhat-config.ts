// in this file we're telling
// if chainId is X use address Y
// if chainId is Z use address W

export interface networkConfigItem {
    ethUsdPriceFeed?: string;
    blockConfirmations?: number;
  }
  
  export interface networkConfigInfo {
    [key: string]: networkConfigItem;
  }
  
  export const networkConfig: networkConfigInfo = {
    localhost: {},
    hardhat: {},
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
      ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
      blockConfirmations: 6,
    },
    
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one is ETH/USD contract on Kovan
    kovan: {
      ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
      blockConfirmations: 6,
    },
  };
  
  export const developmentChains = ["hardhat", "localhost"];