"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Address, erc20Abi } from "viem";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import CustomButton from "@/components/custom/CustomButtons";
import BigNumber from "bignumber.js";
import { shorten } from "@/utils/constants";

BigNumber.config({ DECIMAL_PLACES: 10 });

const RECIPIENT_ADDRESS = "0xA44296D8af02fd49Fe448aC8ff2d11caEC9E076c";

const Deposit: React.FC = () => {
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
                args: [RECIPIENT_ADDRESS, BigInt(amountInWei)],
            });
            setTransactionHash(hash);
        } catch (err) {
            console.error("Error interacting with contract:", err);
            setError("Transaction failed. Please try again.");
        }
    };

    return (
        <NavigationLayout>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl border border-sky-100">
                <h1 className="text-2xl font-bold mb-4">Deposit USDC</h1>
                <div className="bg-sky-50 mb-4 rounded-xl px-3 py-2">
                    <label className="block text-gray-700">Your Address</label>
                    <div className="p-2 rounded">{shorten(userAddress)}</div>
                </div>
                <div className="bg-sky-50 mb-4 rounded-xl px-3 py-2">
                    <label className="block text-gray-700">Recipient Address</label>
                    <div className="p-2 rounded">{shorten(RECIPIENT_ADDRESS)}</div>
                </div>

                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <label className="block text-gray-700">Amount of (USDC)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border border-sky-200 rounded-xl outline-none"
                        />
                    </div>
                    <button
                        onClick={send}
                        disabled={isPending}
                        className="bg-sky-500 hover:bg-sky-700 text-white px-4 py-2 rounded-xl transition-all duration-300"
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
                {error && (
                    <div className="mt-4 flex items-center text-red-600">
                        {/* <XCircleIcon className="w-5 h-5 mr-2" /> */}
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </NavigationLayout>
    );
};

export default Deposit;
