import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";
import "@typechain/hardhat";
import {config as dotenvConfig} from "dotenv";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import {HardhatUserConfig} from "hardhat/config";
import {resolve} from "path";
import "solidity-coverage";
import "tsconfig-paths/register";

import "@tasks/index";

dotenvConfig({path: resolve(__dirname, "./.env")});

// Ensure that we have all the environment variables we need.

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {},
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MUMBAI_PROVIDER || "",
        blockNumber: 26256943,
      },
    },
    rinkeby: {
      url: process.env.RINKEBY_PROVIDER,
      accounts: [process.env.PRIVATE_KEY || ""],
      timeout: 100000,
    },
    mumbai: {
      url: process.env.MUMBAI_PROVIDER,
      accounts: [process.env.PRIVATE_KEY || ""],
      timeout: 100000,
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/nReBpq-5AlHd7Wl0MLmDtkzQj_cFpFBV",
      accounts: ["6c411f8a85391c0f8c9a0a1e26a843da44127b0aecb29b83be1d7060025ffedb" || ""],
      timeout: 100000,
      //gasPrice: 65000000000,
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.13",
      },
      {
        version: "0.4.24",
      },
    ],
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: false,
  },
};

export default config;