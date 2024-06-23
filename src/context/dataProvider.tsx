import React, { createContext, useContext, useEffect, useState } from "react";
import { cookieStorage, useWalletClient } from "wagmi";
import {
    createMultiChainValidationModule,
    createSmartAccountClient,
    DEFAULT_MULTICHAIN_MODULE,
} from "@biconomy/account";
import { BICONOMY_MAINNET_BUNDLAR_KEY, MAINNET_INFURA, POLYGON_BICONOMY_AA_KEY } from "@/utils/keys";
import { Address } from "viem";
import axios from "axios";
import { decreasePowerByDecimals, usdcByChain } from "@/utils/constants";
import BigNumber from "bignumber.js";
BigNumber.config({ DECIMAL_PLACES: 10 });

export const DataContext = createContext<any | null>(null);

const DataProvider = ({ children }: any) => {
    const [privySession, setPrivySession] = useState<string | null>(null);
    const [smartAccountAddress, setSmartAccountAddress] = useState<Address | undefined>(undefined);
    const [usdcBalance, setUsdcBalance] = useState<number | string>();

    useEffect(() => {
        const token = cookieStorage.getItem("privy-token");
        if (token) {
            setPrivySession(token);
        }
    }, []);

    const { data: walletClient } = useWalletClient();

    const createSmartAccount = async () => {
        if (!walletClient) {
            console.error("Wallet client not initialized");
            return;
        }

        try {
            const multiChainModule = await createMultiChainValidationModule({
                signer: walletClient as any,
                moduleAddress: DEFAULT_MULTICHAIN_MODULE,
            });

            const bundelUrl: string = BICONOMY_MAINNET_BUNDLAR_KEY || "";
            const paymasterApiKey: string = POLYGON_BICONOMY_AA_KEY || "";
            const rpcUrl: string = MAINNET_INFURA || "";

            const biconomySmartAccount = await createSmartAccountClient({
                signer: walletClient,
                bundlerUrl: bundelUrl,
                biconomyPaymasterApiKey: paymasterApiKey,
                rpcUrl: rpcUrl,
                defaultValidationModule: multiChainModule,
                activeValidationModule: multiChainModule,
            });

            const saAddress: Address = await biconomySmartAccount.getAccountAddress();
            setSmartAccountAddress(saAddress);
            return saAddress;
        } catch (error) {
            console.error("Error creating smart account:", error);
        }
    };

    useEffect(() => {
        async function check() {
            if (walletClient?.account) {
                createSmartAccount();
                getUscdBalance();
            }
        }
        check();
    }, [walletClient]);

    const getUscdBalance = async () => {
        const chainId = "137";
        const tokenAddress = usdcByChain[chainId].usdc;
        const response = await axios.get(
            `https://server.defilens.tech/api/v1/token/getBalance?userAddress=${smartAccountAddress}&tokenAddress=${tokenAddress}&chainId=${chainId}`
        );

        const result = await response.data;
        if (result?.balance) {
            const totalDecimal = decreasePowerByDecimals(result.balance, result.decimals);
            setUsdcBalance(totalDecimal);
        }
    };
    useEffect(() => {
        if (smartAccountAddress !== undefined) {
            getUscdBalance();
        }
    }, [smartAccountAddress]);

    return (
        <DataContext.Provider value={{ createSmartAccount, privySession, smartAccountAddress, usdcBalance }}>
            {children}
        </DataContext.Provider>
    );
};

export const DataState = () => {
    return useContext(DataContext);
};

export default DataProvider;
