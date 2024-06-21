"use client";

import {
    DEFAULT_MULTICHAIN_MODULE,
    createMultiChainValidationModule,
    createSmartAccountClient,
} from "@biconomy/account";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useWalletClient } from "wagmi";
import CustomButton from "./custom/CustomButtons";
import { shorten } from "@/utils/constants";
import { BICONOMY_MAINNET_BUNDLAR_KEY, MAINNET_INFURA, POLYGON_BICONOMY_AA_KEY } from "@/utils/keys";
import { useRouter } from "next/navigation";
require("dotenv").config();
import { useLogin } from "@privy-io/react-auth";

interface IFarcaster {
    fid: number;
    ownerAddress: string;
    displayName: string;
    username: string;
    bio: string;
    pfp: string;
}

const Header = () => {
    const router = useRouter();
    const { ready, user, authenticated, logout, linkFarcaster } = usePrivy();
    const { data: walletClient } = useWalletClient();

    const { login } = useLogin({
        onComplete: (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
            console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount);
            // alert("loggedin");
            // Any logic you'd like to execute if the user is/becomes authenticated while this
            // component is mounted
        },
        onError: (error) => {
            console.log(error);
            // Any logic you'd like to execute after a user exits the login flow or there is an error
        },
    });

    const [smartAccountAddress, setSmartAccountAddress] = useState<Address>();

    const createSmartAccount = async () => {
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
    };

    // useEffect(() => {
    //     async function check() {
    //         if (walletClient?.account) {
    //             createSmartAccount();
    //         }
    //     }
    //     check();
    // }, [walletClient]);

    const acc: any = authenticated && user?.linkedAccounts.find((account) => account.type === "farcaster");

    return (
        <header className="mx-auto flex justify-between items-center py-4 px-6 text-black bg-white bg-opacity-55 backdrop-blur-sm border-b border-sky-100">
            <div className="text-2xl font-bold">
                {/* Logo */}
                <span className="ml-3">{acc?.username}</span>
            </div>
            {/* <nav className="space-x-6">
                <a href="#what-we-do" className="hover:text-gray-400">
                    What We Do
                </a>
                <a href="#portfolio" className="hover:text-gray-400">
                    Portfolio
                </a>
                <a href="#contact-us" className="hover:text-gray-400">
                    Contact Us
                </a>
                <a href="#blog" className="hover:text-gray-400">
                    Blog
                </a>
                <a href="#about-us" className="hover:text-gray-400">
                    About Us
                </a>
            </nav> */}
            {ready && authenticated && <CustomButton onClick={logout}>Logout</CustomButton>}

            {/* <div className="flex gap-2 items-center">
                {ready && !authenticated && (
                    <CustomButton
                        onClick={login}
                    >
                        Login
                    </CustomButton>
                )}
                {ready && authenticated && (
                    <span className="flex items-center rounded-xl bg-slate-200 text-gray-900 px-2 py-1 font-mono">
                        {shorten(smartAccountAddress)}
                    </span>
                )}
                {ready && authenticated && <CustomButton onClick={logout}>Logout</CustomButton>}
                {ready &&
                    authenticated &&
                    authenticated &&
                    user?.linkedAccounts.find((account) => account.type === "farcaster")?.type !== "farcaster" && (
                        <CustomButton onClick={linkFarcaster}>Link with Farcaster</CustomButton>
                    )}
            </div> */}
            {ready && !authenticated && <CustomButton onClick={() => router.push("/login")}>Login</CustomButton>}
        </header>
    );
};
export default Header;
