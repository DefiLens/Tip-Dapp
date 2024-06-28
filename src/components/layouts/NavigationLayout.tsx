"use client";
import Sidebar from "../Sidebar";
import Header from "../Header";

import React, { useEffect, useRef, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Address, erc20Abi } from "viem";
import BigNumber from "bignumber.js";
import { DataState } from "@/context/dataProvider";
import { IoIosSearch } from "react-icons/io";
import SuggestedFollows from "../SuggestedFollows";
import toast from "react-hot-toast";
import AvatarIcon from "../Avatar";
import { shorten } from "@/utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import UserList from "../UserList";
import { RxCross2 } from "react-icons/rx";
BigNumber.config({ DECIMAL_PLACES: 10 });

const NavigationLayout = ({ children }: any) => {
    const { user } = DataState();
    const { smartAccountAddress, usdcBalance, isBiconomySession } = DataState();
    const { address: userAddress } = useAccount();
    const { data: hash, isPending, writeContract } = useWriteContract();
    const [amount, setAmount] = useState<string>("");
    const [transactionHash, setTransactionHash] = useState<Address | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    const send = async () => {
        if (!user) {
            toast.error("Login First");
            return;
        }
        setTransactionHash(undefined);
        setError(null);
        try {
            const amountInWei = new BigNumber(amount).multipliedBy(1e6).toFixed(); // USDC has 6 decimal places
            writeContract({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
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

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = async () => {
        try {
            const response = await axiosInstance.get(`/user/search`, {
                params: { query: searchQuery },
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    };

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            if (searchQuery) {
                handleSearch();
            }
        }, 500);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchQuery]);

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
                                className="w-full px-3 py-2 border rounded-lg border-fuchsia-200 focus:outline-none focus:ring focus:ring-fuchsia-300 resize-none"
                                placeholder="Search for users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="absolute right-4 text-2xl text-fuchsia-400">
                                <IoIosSearch />
                            </button>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="p-2 w-full border rounded-lg border-fuchsia-200 flex flex-col gap-3 relative">
                                <h1 className="text-xl font-bold text-primary-text">Users</h1>

                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSearchResults([]);
                                    }}
                                    className="absolute top-2 right-2 text-lg text-secondary-text"
                                >
                                    <RxCross2 />
                                </button>
                                {searchResults.map((result) => (
                                    <div key={result._id} className="flex items-center gap-3">
                                        {result.image ? (
                                            <img src={result.image} className="h-10 w-10 rounded-full" alt="Profile" />
                                        ) : (
                                            <div className="h-10 w-10">
                                                <AvatarIcon address={result.smartAccountAddress} />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-base font-bold">
                                                {result.name ? result.name : shorten(result.smartAccountAddress)}
                                            </p>
                                            <p className="text-sm text-gray-500">{result.bio.slice(0, 30)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {user && searchResults.length <= 0 && <SuggestedFollows />}
                    </div>
                    <div className="p-2">
                        <div className="max-w-md mx-auto h-fit bg-white p-2 border rounded-lg border-fuchsia-200">
                            <h1 className="text-xl font-bold mb-2 text-primary-text">Deposit USDC</h1>
                            <div className="flex items-end gap-2">
                                <div className="flex-1">
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
                                    <span>Transaction hash: {transactionHash}</span>
                                </div>
                            )}
                            {hash && (
                                <div className="mt-4 flex items-center text-green-600">
                                    <span>Transaction hash: {hash}</span>
                                </div>
                            )}
                            {error && (
                                <div className="mt-4 flex items-center text-red-600">
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
