"use client";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Deposit from "@/app/deposit/page";

import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Address, erc20Abi } from "viem";
import CustomButton from "@/components/custom/CustomButtons";
import BigNumber from "bignumber.js";
import { shorten } from "@/utils/constants";
import { DataState } from "@/context/dataProvider";

BigNumber.config({ DECIMAL_PLACES: 10 });

const NavigationLayout = ({ children }: any) => {
    const { smartAccountAddress, usdcBalance } = DataState();
    const { address: userAddress } = useAccount();
    const { data: hash, isPending, writeContract } = useWriteContract();
    const [amount, setAmount] = useState<string>("");
    const [transactionHash, setTransactionHash] = useState<Address | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    const send = async () => {
        setTransactionHash(undefined);
        setError(null);
        try {
            const amountInWei = new BigNumber(amount).multipliedBy(1e6).toFixed(); // USDC has 6 decimal places
            writeContract({
                address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                abi: erc20Abi,
                functionName: "transfer",
                args: [smartAccountAddress, BigInt(amountInWei)],
            });
            setTransactionHash(hash);
        } catch (err) {
            console.error("Error interacting with contract:", err);
            setError("Transaction failed. Please try again.");
        }
    };

    return (
        <main className="h-screen">
            <div className="relative max-w-6xl w-full mx-auto flex">
                <Sidebar />
                <div className="relative flex-1 h-full">
                    <div className="sticky top-0 z-40">
                        <Header />
                    </div>
                    {children}
                </div>
                <div className="sticky top-0 h-screen hidden md:flex flex-col w-60 border-purple-100 border-l border-r ">
                    <div className="max-w-md mx-auto h-fit mt-10 bg-white px-2 border-purple-100 border-t border-b py-2">
                        <h1 className="text-2xl font-bold mb-4 text-purple-600">Deposit USDC</h1>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <label className="block text-gray-700">Amount of (USDC)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full p-2 border border-purple-200 rounded-xl outline-none"
                                />
                            </div>
                            <button
                                onClick={send}
                                disabled={isPending}
                                className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-all duration-300"
                            >
                                {isPending ? "waiting" : "Send"}
                            </button>
                        </div>
                        {transactionHash && (
                            <div className="mt-4 flex items-center text-green-600">
                                {/* <CheckCircleIcon className="w-5 h-5 mr-2" /> */}
                                <span>Transaction hash: {transactionHash}</span>
                            </div>
                        )}
                        {hash && (
                            <div className="mt-4 flex items-center text-green-600">
                                {/* <CheckCircleIcon className="w-5 h-5 mr-2" /> */}
                                <span>Transaction hash: {hash}</span>
                            </div>
                        )}
                        {error && (
                            <div className="mt-4 flex items-center text-red-600">
                                {/* <XCircleIcon className="w-5 h-5 mr-2" /> */}
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 items-center p-4">
                        <p>Your Balance</p>
                        <span className="">{usdcBalance} USDC</span>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NavigationLayout;
