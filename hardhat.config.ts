import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv')
  .config();

const INFURA_API_KEY = process.env.INFURA_API_KEY as string;
const WALLET_KEY = process.env.WALLET_KEY as string;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.17',
      },
      {
        version: '0.4.26',
      },
    ]
  },
  networks: {
    'sepolia': {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [WALLET_KEY]
    }
  }
};

export default config;
