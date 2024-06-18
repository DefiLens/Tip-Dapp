export const MAINNET_INFURA = process.env.NEXT_PUBLIC_MAINNET_INFURA_API_KEY;

export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
export const POLYGON_ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_POLYGON_ETHERSCAN_API_KEY;
export const AVAX_ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_AVAX_ETHERSCAN_API_KEY;
export const ARBITRUM_ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ARBITRUM_ETHERSCAN_API_KEY;
export const OPTIMISM_ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_OPTIMISM_ETHERSCAN_API_KEY;
export const BASE_ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_BASE_ETHERSCAN_API_KEY;

export const POLYGON_BICONOMY_AA_KEY = process.env.NEXT_PUBLIC_POLYGON_BICONOMY_AA_KEY;
export const ARBITRUM_ONE_BICONOMY_AA_KEY = process.env.NEXT_PUBLIC_ARBITRUM_ONE_BICONOMY_AA_KEY;
export const OPTIMISM_BICONOMY_AA_KEY = process.env.NEXT_PUBLIC_OPTIMISM_BICONOMY_AA_KEY;
export const ETHEREUM_BICONOMY_AA_KEY = process.env.NEXT_PUBLIC_ETHEREUM_BICONOMY_AA_KEY;
export const AVALANCHE_BICONOMY_AA_KEY = process.env.NEXT_PUBLIC_AVALANCHE_BICONOMY_AA_KEY;
export const BASE_BICONOMY_AA_KEY = process.env.NEXT_PUBLIC_BASE_BICONOMY_AA_KEY;

export const BICONOMY_MAINNET_BUNDLAR_KEY = process.env.NEXT_PUBLIC_BICONOMY_MAINNET_BUNDLAR_KEY;

export const TENDERLY_ACCESS_KEY = process.env.NEXT_PUBLIC_TENDELY_ACCESS_TOKEN;
export const TENDERLY_USER = process.env.NEXT_PUBLIC_TENDERLY_USER;
export const TENDERLY_PROJECT = process.env.NEXT_PUBLIC_TENDERLY_PROJECT;

export const PIMLICO_API_KEY = process.env.NEXT_PUBLUC_PIMLICO_API_KEY;

export const NETLIFY_NODE_URL = "https://apichainping.defilens.tech/.netlify/functions/server";
export const STACKUP_POLYGON_MAINNET_RPC_NODE_URL: any = process.env.NEXT_PUBLIC_STACKUP_POLYGON_MAINNET_RPC_NODE_URL;
export const BICONOMY_GAS_PRICE_URL = "https://sdk-relayer.prod.biconomy.io/api/v1/relay/feeOptions?chainId=";
export const IPFS_FIX_URL = "https://cloudflare-ipfs.com/ipfs/";
export const NODE_JWT_TOKEN = process.env.NEXT_PUBLIC_NODE_JWT_TOKEN
// export const NODE_ONEINCH_URL = "https://server.defilens.tech/api/v1/general/1Inch"


export const get1InchUrl = (NODE_ENV: string | undefined) => {
    switch (NODE_ENV) {
      case 'production':
        return 'https://server.defilens.tech/api/v1/public/1Inch';

      case 'staging':
        return 'https://server.defilens.tech/api/v1/public/1Inch';

      case 'dev':
        return 'http://localhost:8080/api/v1/public/1Inch';

      default: return 'http://localhost:8080/api/v1/public/1Inch';
    }
  };

const getBaseURL = (NODE_ENV: string | undefined) => {
    switch (NODE_ENV) {
      case 'production':
      return 'https://server.defilens.tech/api/v1';

      case 'staging':
        return 'https://backend-staging-cohr.onrender.com/api/v1';

      case 'dev':
        return 'http://localhost:8080/api/v1';

      default: return 'http://localhost:8080/api/v1';
    }
  };

export const NODE_ONEINCH_URL = get1InchUrl(process.env.NEXT_PUBLIC_NODE_ENV);
export const BASE_URL = getBaseURL(process.env.NEXT_PUBLIC_NODE_ENV);
