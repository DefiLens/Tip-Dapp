"use client";

import React, { useState } from "react";
import { BaseError, useWriteContract } from "wagmi";
import { Address, erc20Abi } from "viem";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import BigNumber from "bignumber.js";
import { DataState } from "@/context/dataProvider";
import CopyButton from "@/components/custom/CopyButton";
import { shorten } from "@/utils/constants";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import CustomButton from "@/components/custom/CustomButtons";

BigNumber.config({ DECIMAL_PLACES: 10 });

const Deposit: React.FC = () => {
    const { smartAccountAddress, getUscdBalance } = DataState();

    const { data: hash, isPending, error, writeContract } = useWriteContract();
    const [amount, setAmount] = useState<string>("");
    const [transactionHash, setTransactionHash] = useState<Address | undefined>(undefined);

    const send = async () => {
        setTransactionHash(undefined);
        try {
            const amountInWei = new BigNumber(amount).multipliedBy(1e6).toFixed(); // USDC has 6 decimal places
            writeContract({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                abi: erc20Abi,
                functionName: "transfer",
                args: [smartAccountAddress, BigInt(amountInWei)],
            });
            setTransactionHash(hash);
            getUscdBalance();
        } catch (err) {
            console.error("Error interacting with contract:", err);
        }
    };

    return (
        <NavigationLayout>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl border border-B800">
                <h1 className="text-2xl font-bold mb-4">Deposit USDC</h1>
                <div className="bg-B800 mb-4 rounded-xl px-3 py-2">
                    <label className="block text-gray-700">To your defi wallet</label>
                    <div className="p-2 rounded flex items-center gap-2">
                        <span className="overflow-hidden text-ellipsis">{smartAccountAddress}</span>{" "}
                        <CopyButton copy={smartAccountAddress} />
                    </div>
                </div>

                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <label className="block text-gray-700">Amount of (USDC)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-1.5 border border-B800 rounded-xl outline-none"
                        />
                    </div>
                    <CustomButton onClick={send} disabled={isPending} isLoading={isPending} className="px-4">
                        {isPending ? "waiting" : "Deposit"}
                    </CustomButton>
                </div>
                {hash && (
                    <div className="mt-4">
                        <p className="flex gap-2 items-center text-B20">
                            Success:{" "}
                            <u>
                                <a className="" href={hash} target="_blank" rel="noopener noreferrer">
                                    {shorten(hash)}
                                </a>
                            </u>
                            <Link
                                href={`https://basescan.org/tx/${hash}`}
                                target="_blank"
                                className=" hover:bg-B900 p-1.5 rounded-md cursor-pointer text-xs text-B10"
                            >
                                <FiExternalLink />
                            </Link>
                        </p>
                    </div>
                )}
                <p className="text-sm text-gray-700 mt-1">Tip: Giving tip require funds in defi wallet.</p>
                {error && (
                    <div className="text-xs mt-2 text-red-500">
                        Error: {(error as BaseError).shortMessage || error.message}
                    </div>
                )}
            </div>
        </NavigationLayout>
    );
};

export default Deposit;
