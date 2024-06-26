"use client";
import Sidebar from "../Sidebar";
import Header from "../Header";

import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Address, erc20Abi } from "viem";
import BigNumber from "bignumber.js";
import { DataState } from "@/context/dataProvider";
import { IoIosSearch } from "react-icons/io";
import SuggestedFollows from "../SuggestedFollows";
import CreateSessionButton from "../CreateSession";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
BigNumber.config({ DECIMAL_PLACES: 10 });

const NavigationLayout = ({ children }: any) => {
    const { smartAccountAddress, usdcBalance, isBiconomySession } = DataState();
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
            <div className="relative max-w-7xl w-full mx-auto flex">
                <Sidebar />
                <div className="relative flex-1 h-full">
                    <div className="sticky top-0 z-30">
                        <Header />
                    </div>
                    {children}
                </div>
                <div className="sticky top-0 h-screen hidden md:flex flex-col w-80 border-fuchsia-100 justify-between border-l border-r ">
                    <div className="p-2 w-full flex flex-col gap-3">
                        <div className="relative flex items-center">
                            <input
                                className="w-full px-3 py-2 border rounded-lg  border-fuchsia-200 focus:outline-none focus:ring focus:ring-fuchsia-300 resize-none"
                                placeholder="Search for users..."
                            />
                            <button className="absolute right-4 text-2xl text-fuchsia-400">
                                <IoIosSearch />
                            </button>
                        </div>
                        <SuggestedFollows />
                    </div>
                    <div className="p-2">
                        <div className="max-w-md mx-auto h-fit bg-white p-2 border rounded-lg border-fuchsia-200">
                            <h1 className="text-xl font-bold mb-2 text-primary-text">Deposit USDC</h1>
                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    {/* <label className="block text-gray-700"></label> */}
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full p-2 border border-fuchsia-200 rounded-xl outline-none"
                                        placeholder="Amount of (USDC)"
                                    />
                                </div>
                                <button
                                    onClick={send}
                                    disabled={isPending}
                                    className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-xl transition-all duration-300"
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
                        <div className="flex flex-col gap-1 justify-center p-4">
                            <p className="text-primary-text font-bold text-lg">Your Balance</p>
                            <span className="text-secondary-text text-sm">{usdcBalance} • USDC</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NavigationLayout;
