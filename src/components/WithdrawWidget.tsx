import React, { useState } from "react";
import { BigNumber as bg } from "bignumber.js";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { DataState } from "@/context/dataProvider";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import {
    PaymasterMode,
    createSessionKeyEOA,
    createSessionSmartAccountClient,
    getSingleSessionTxParams,
} from "@biconomy/account";
import { base } from "viem/chains";
import { BASE_BICONOMY_AA_KEY, BICONOMY_MAINNET_BUNDLAR_KEY } from "@/utils/keys";
import { encodeFunctionData, parseAbi } from "viem";
import Loading from "./Loading";
import CopyButton from "./custom/CopyButton";
bg.config({ DECIMAL_PLACES: 10 });

const WithdrawWidget = () => {
    const { smartAccount, biconomySession, getUscdBalance } = DataState();

    const { address } = useAccount();
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState<{
        address?: string;
        message?: string;
        amount?: string;
    }>({});

    const [loading, setLoading] = useState(false);
    const [txHash, setTxhash] = useState("");

    const handleSubmit = async () => {
        try {
            if (!address) {
                toast.error("Connect Wallet first");
                return;
            }
            const newErrors: { address?: string; message?: string; amount?: string } = {};
            if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
                newErrors.amount = "Amount must be a number greater than zero.";
            setErrors(newErrors);

            if (Object.keys(newErrors).length === 0) {
                setTxhash("");
                setLoading(true);
                const largeNumber = 1e6; // 1 million

                const usersSmartAccount = smartAccount;
                const { sessionStorageClient } = await createSessionKeyEOA(usersSmartAccount, base);

                const withSponsorship = {
                    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
                };
                const usersSmartAccountAddress = sessionStorageClient.smartAccountAddress;

                const emulatedUsersSmartAccount = await createSessionSmartAccountClient(
                    {
                        accountAddress: usersSmartAccountAddress, // Dapp can set the account address on behalf of the user
                        bundlerUrl: BICONOMY_MAINNET_BUNDLAR_KEY as string,
                        paymasterUrl: `https://paymaster.biconomy.io/api/v1/8453/${BASE_BICONOMY_AA_KEY}`,
                        chainId: 8453,
                    },
                    usersSmartAccountAddress // Storage client, full Session or simply the smartAccount address if using default storage for your environment
                );

                let transferTx: any;

                if (address) {
                    transferTx = {
                        to: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                        data: encodeFunctionData({
                            abi: parseAbi(["function transfer(address,uint256)"]),
                            functionName: "transfer",
                            args: [address, BigInt(bg(amount).multipliedBy(largeNumber).toString())], // BigInt(amount) * BigInt(largeNumber)
                        }),
                    };
                }

                const index = biconomySession.length - 1;
                const params = await getSingleSessionTxParams(
                    usersSmartAccountAddress,
                    base,
                    index // index of the relevant policy leaf to the tx
                );

                const { wait } = await emulatedUsersSmartAccount.sendTransaction(transferTx, {
                    ...params,
                    ...withSponsorship,
                });

                const success = await wait();

                if (success.receipt.transactionHash) {
                    setTxhash(`https://basescan.org/tx/${success.receipt.transactionHash}`);
                    getUscdBalance();
                }
                setLoading(false);
            }
        } catch (error) {
            setErrors({ message: "Error: Something went wrong." });
            setLoading(false);
        }
    };

    console.log("errors", errors);
    return (
        <div className="max-w-md mx-auto h-fit p-2 border rounded-lg border-B800">
            {loading && <Loading />}
            <h1 className="text-lg font-bold mb-1 text-primary-text">Withdraw</h1>
            <div className="flex items-end gap-2">
                <div className="flex-1">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border border-B800 rounded-xl outline-none"
                        placeholder="Amount of (USDC)"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-B0 hover:bg-B30 text-white px-4 py-2 rounded-xl transition-all duration-300"
                >
                    {loading ? "waiting" : "Send"}
                </button>
            </div>
            {txHash && (
                <div className="flex items-center gap-2 text-sm text-B10">
                    <span className="font-semibold">Success:</span>
                    <p className="overflow-hidden text-ellipsis flex-1">
                        <a href={txHash} target="_blank" rel="noopener noreferrer">
                            {txHash}
                        </a>
                    </p>
                    <Link
                        href={txHash}
                        target="_blank"
                        className=" hover:bg-B900 p-1.5 rounded-md cursor-pointer text-xs text-B10"
                    >
                        <FiExternalLink />
                    </Link>
                    <CopyButton copy={txHash} />
                </div>
            )}
            {errors && (
                <div className="mt-4 flex items-center text-xs text-red-500">
                    <span>{errors.message}</span>
                </div>
            )}
        </div>
    );
};

export default WithdrawWidget;
