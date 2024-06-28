"use client";

import React, { useState } from "react";
import { useWriteContract } from "wagmi";
import { Address, erc20Abi } from "viem";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import BigNumber from "bignumber.js";
import { DataState } from "@/context/dataProvider";
import CopyButton from "@/components/custom/CopyButton";

BigNumber.config({ DECIMAL_PLACES: 10 });

const Deposit: React.FC = () => {
    const { smartAccountAddress } = DataState();

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
        <NavigationLayout>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl border border-fuchsia-100">
                <h1 className="text-2xl font-bold mb-4">Deposit USDC</h1>
                <div className="bg-fuchsia-50 mb-4 rounded-xl px-3 py-2">
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
                            className="w-full p-2 border border-fuchsia-200 rounded-xl outline-none"
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
                <p className="text-sm text-gray-700 mt-1">Tip: Giving tip require funds in defi wallet.</p>
            </div>
        </NavigationLayout>
    );
};

export default Deposit;
