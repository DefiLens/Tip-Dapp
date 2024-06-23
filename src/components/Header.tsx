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
import { BICONOMY_MAINNET_BUNDLAR_KEY, MAINNET_INFURA, BASE_BICONOMY_AA_KEY } from "@/utils/keys";
require("dotenv").config();

interface IFarcaster {
    fid: number;
    ownerAddress: string;
    displayName: string;
    username: string;
    bio: string;
    pfp: string;
}

const Header = () => {
    const { ready, user, authenticated, logout, linkFarcaster, login } = usePrivy();
    const { data: walletClient } = useWalletClient();

    const [smartAccountAddress, setSmartAccountAddress] = useState<Address>();

    const createSmartAccount = async () => {
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
        setSmartAccountAddress(saAddress);
    };

    useEffect(() => {
        async function check() {
            if (walletClient?.account) {
                createSmartAccount();
            }
        }
        check();
    }, [walletClient]);

    const acc: any = authenticated && user?.linkedAccounts.find((account) => account.type === "farcaster");

    return (
        <header className="mx-auto flex justify-between items-center py-4 px-6 bg-blue-500 text-white">
            <div className="text-2xl font-bold">
                Tipit
                <span className="ml-3">{acc?.username  && ` (Farcaster ${acc?.username})`}</span>
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

            <div className="flex gap-2 items-center">
                {ready && !authenticated && <CustomButton onClick={login}>Login</CustomButton>}
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
            </div>
        </header>
    );
};
export default Header;
