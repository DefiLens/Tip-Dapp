import { Abi, Account, Address, createWalletClient, getContract, http, publicActions, WalletClient } from 'viem';
import { Chain, arbitrum, base, mainnet, optimism, polygon, sepolia } from 'viem/chains';

/**
 * Get the chain configuration based on the chain ID.
 * @param {number} chainId - The ID of the chain.
 * @returns {Chain} The chain configuration.
 */
const getChainConfig = (chainId: number): Chain => {
  switch (chainId) {
    case arbitrum.id:
      return arbitrum;
    case base.id:
      return base;
    case mainnet.id:
      return mainnet;
    case optimism.id:
      return optimism;
    case polygon.id:
      return polygon;
    case sepolia.id:
      return sepolia;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

/**
 * Create a wallet client for the specified chain ID.
 * @param {Account} account - The account information.
 * @param {number} chainId - The ID of the chain.
 * @returns {WalletClient} The wallet client.
 */
export const createClient = (account: Account, chainId: number): WalletClient => {
  const chain = getChainConfig(chainId);
  return createWalletClient({
    account,
    chain,
    transport: http(),
  }).extend(publicActions);
};

/**
 * Get a contract instance for the specified chain ID and address.
 * @param {number} chainId - The ID of the chain.
 * @param {string} contractAddress - The address of the contract.
 * @param {Abi} abi - The ABI of the contract.
 * @param {Account} account - The account information.
 * @returns {Promise<any>} The contract instance.
 */
export const getContractInstance = async (chainId: number, contractAddress: Address, abi: Abi, account: Account): Promise<any> => {
  const client = createClient(account, chainId);
  return getContract({
    address: contractAddress,
    abi,
    client,
  });
};
