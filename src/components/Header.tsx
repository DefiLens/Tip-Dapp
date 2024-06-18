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
        if (!walletClient) return;

        const multiChainModule = await createMultiChainValidationModule({
            signer: walletClient,
            moduleAddress: DEFAULT_MULTICHAIN_MODULE,
        });

        const bundelUrl: string = process.env.BICONOMY_BUNDLER_URL || "";
        const paymasterApiKey: string = process.env.BICONOMY_PAYMASTER_API_KEY || "";
        const rpcUrl: string = process.env.RPC_URL || "";

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
        createSmartAccount();
    }, [walletClient]);

    const acc: any = authenticated && user?.linkedAccounts.find((account) => account.type === "farcaster");

    return (
        <header className="mx-auto flex justify-between items-center py-4 px-6 bg-dark-10 text-white">
            <div className="text-2xl font-bold">
                Logo
                <span className="ml-3">{acc?.username}</span>
            </div>
            <nav className="space-x-6">
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
            </nav>

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
