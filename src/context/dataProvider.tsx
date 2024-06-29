import React, { createContext, useContext, useEffect, useState } from "react";
import { cookieStorage, useWalletClient } from "wagmi";
import {
    createMultiChainValidationModule,
    createSmartAccountClient,
    DEFAULT_MULTICHAIN_MODULE,
    SessionLocalStorage,
} from "@biconomy/account";
import { BICONOMY_MAINNET_BUNDLAR_KEY, MAINNET_INFURA, BASE_BICONOMY_AA_KEY } from "@/utils/keys";
import { Address } from "viem";
import axios from "axios";
import { decreasePowerByDecimals, usdcByChain } from "@/utils/constants";
import BigNumber from "bignumber.js";
import axiosInstance from "@/utils/axiosInstance";
import { usePrivy } from "@privy-io/react-auth";
BigNumber.config({ DECIMAL_PLACES: 10 });

export const DataContext = createContext<any | null>(null);

const DataProvider = ({ children }: any) => {
    const { data: walletClient } = useWalletClient();

    const [privySession, setPrivySession] = useState<string | null>(null);
    const [smartAccount, setSmartAccount] = useState<any>();
    const [smartAccountAddress, setSmartAccountAddress] = useState<Address | undefined>(undefined);
    const [usdcBalance, setUsdcBalance] = useState<number | string>();
    const [user, setUser] = useState(null);
    const [isGettingUserData, setIsGettingUserData] = useState<boolean>(false);
    const [isBiconomySession, setIsBiconomySession] = useState<boolean>(false);
    const [isLoadingBiconomySession, setIsLoadingBiconomySession] = useState<boolean>(true);

    const [biconomySession, setBiconomySession] = useState<any>(null);

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
            const paymasterApiKey: string = BASE_BICONOMY_AA_KEY || "";
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
            setSmartAccount(biconomySmartAccount);
            setSmartAccountAddress(saAddress);
            return saAddress;
        } catch (error) {
            console.error("Error creating smart account:", error);
        }
    };

    const getUscdBalance = async () => {
        const chainId = "8453";
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

    const checkSession = async () => {
        if (smartAccountAddress) {
            const sessionLocalStorage = new SessionLocalStorage(smartAccountAddress);
            const data = await sessionLocalStorage.getAllSessionData();
            setIsBiconomySession(data?.length > 0);
            setBiconomySession(data);
        } else {
            console.log("smartAccountAddress is undefined");
        }
    };

    //Setting privy token
    useEffect(() => {
        const token = cookieStorage.getItem("privy-token");
        if (token) {
            setPrivySession(token);
        }
    }, []);

    //Create smart account
    useEffect(() => {
        async function check() {
            if (walletClient?.account) {
                createSmartAccount();
            }
        }
        check();
    }, [walletClient]);

    //Get usdc balance + check user session.
    useEffect(() => {
        if (smartAccountAddress !== undefined) {
            getUscdBalance();
            checkSession();
            setIsLoadingBiconomySession(false)
        }
    }, [smartAccountAddress]);

    // fetch user info
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsGettingUserData(true);
                const response = await axiosInstance.get("/user");
                setUser(response.data);
                setIsGettingUserData(false);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setIsGettingUserData(false);
            }
        };

        fetchUserData();
    }, []);

    console.log("biconomySession:", biconomySession);
    const { ready, user: privyUser, linkFarcaster, authenticated } = usePrivy();
    const isPrivyConnected: any = authenticated && privyUser?.linkedAccounts.find((account) => account.type === "farcaster");

    return (
        <DataContext.Provider
            value={{
                createSmartAccount,
                privySession,
                smartAccountAddress,
                smartAccount,
                usdcBalance,
                user,
                isGettingUserData,
                biconomySession,
                isBiconomySession,
                setUser,
                isPrivyConnected,
                isLoadingBiconomySession, 
                setIsLoadingBiconomySession
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const DataState = () => {
    return useContext(DataContext);
};

export default DataProvider;
