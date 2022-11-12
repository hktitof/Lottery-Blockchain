
import { HardhatUserConfig } from "hardhat/config";

import "@nomiclabs/hardhat-etherscan";
import "hardhat-deploy";
import "solidity-coverage";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import dotenv from "dotenv";
dotenv.config();
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";




// Variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const ETHER_SCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;






/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
    // ? if you don't specify defaultNetwork it's by the default "hardhat" => defaultNetwork: "hardhat"

  solidity: {
    compilers: [
      { version: "0.8.8", settings: {} },
      { version: "0.6.6", settings: {} },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
    goerli: {
      chainId: 5,
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    rinkeby: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      //acctounts : they are automatically provided by hardhat, 19 fake accounts
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHER_SCAN_API_KEY,
  },
  gasReporter: {
    // change it to true to enable gas reporter
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    // specify the gas price "token" convert to USD, by the default it's ETH
    // token:"ETH"
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
    mocha:{
      timeout:300000// 300 seconds max
    }
  },
};

export default config;