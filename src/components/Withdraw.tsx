import { DataState } from "@/context/dataProvider";
import React, { useState } from "react";
import { Address, erc20Abi } from "viem";
import { useWriteContract } from "wagmi";
import BigNumber from "bignumber.js";
BigNumber.config({ DECIMAL_PLACES: 10 });

const Withdraw = () => {
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
    return <div>Withdraw</div>;
};

export default Withdraw;
