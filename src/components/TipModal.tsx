import { DataState } from "@/context/dataProvider";
import axiosInstance from "@/utils/axiosInstance";
import { BICONOMY_MAINNET_BUNDLAR_KEY, MAINNET_INFURA, POLYGON_BICONOMY_AA_KEY } from "@/utils/keys";
import {
    DEFAULT_MULTICHAIN_MODULE,
    PaymasterMode,
    createMultiChainValidationModule,
    createSessionKeyEOA,
    createSessionSmartAccountClient,
    createSmartAccountClient,
    getSingleSessionTxParams,
} from "@biconomy/account";
import { useWallets } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { encodeFunctionData, parseAbi } from "viem";
import { polygon } from "viem/chains";
import { useWalletClient, useWriteContract } from "wagmi";
import { BigNumber as bg } from "bignumber.js";
import CopyButton from "./custom/CopyButton";
import { shorten } from "@/utils/constants";
bg.config({ DECIMAL_PLACES: 10 });

const TipModal = ({ post, showTipModal, setShowTipModal }: any) => {
    const { smartAccountAddress, smartAccount, biconomySession } = DataState();
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("usdc");
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState<{
        address?: string;
        message?: string;
        amount?: string;
    }>({});
    const { data: hash, writeContract } = useWriteContract();
    const [loading, setLoading] = useState(false);
    const { data: walletClient } = useWalletClient();
    const { wallets } = useWallets();
    const [txHash, setTxhash] = useState("");

    const receiptSmartWalletAddress = post.smartWalletAddress;

    useEffect(() => {
        if (txHash) {
            alert("tx success: " + txHash);
        }
        if (post) {
            setAddress(receiptSmartWalletAddress);
        }
    }, [post, txHash]);

    const handleAmountChange = (e: any) => {
        const inputAmount = e.target.value;

        if (/^\d*\.?\d*$/.test(inputAmount)) {
            setAmount(inputAmount);
        }
    };

    const handleSubmit = async () => {
        try {
            const newErrors: { address?: string; message?: string; amount?: string } = {};
            if (!address) newErrors.address = "Address is required.";
            if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
                newErrors.amount = "Amount must be a number greater than zero.";
            setErrors(newErrors);

            if (Object.keys(newErrors).length === 0) {
                setTxhash("");
                setLoading(true);
                const largeNumber = 1e6; // 1 million

                console.log("smartAccount", smartAccount);
                const usersSmartAccount = smartAccount;
                const { sessionKeyAddress, sessionStorageClient }: any = await createSessionKeyEOA(
                    usersSmartAccount,
                    polygon
                );

                const withSponsorship = {
                    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
                };
                const usersSmartAccountAddress = sessionStorageClient.smartAccountAddress;

                console.log("usersSmartAccountAddress", usersSmartAccountAddress);

                const emulatedUsersSmartAccount = await createSessionSmartAccountClient(
                    {
                        accountAddress: usersSmartAccountAddress, // Dapp can set the account address on behalf of the user
                        bundlerUrl: BICONOMY_MAINNET_BUNDLAR_KEY as string,
                        paymasterUrl: `https://paymaster.biconomy.io/api/v1/137/${POLYGON_BICONOMY_AA_KEY}`,
                        chainId: 137,
                    },
                    usersSmartAccountAddress // Storage client, full Session or simply the smartAccount address if using default storage for your environment
                );
                const transferTx = {
                    to: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    data: encodeFunctionData({
                        abi: parseAbi(["function transfer(address,uint256)"]),
                        functionName: "transfer",
                        args: [receiptSmartWalletAddress, BigInt(bg(amount).multipliedBy(largeNumber).toString())], // BigInt(amount) * BigInt(largeNumber)
                    }),
                };

                console.log("biconomySession", biconomySession)

                const index = biconomySession.length - 1;
                console.log("index",index)
                const params = await getSingleSessionTxParams(
                    usersSmartAccountAddress,
                    polygon,
                    index // index of the relevant policy leaf to the tx
                );
                console.log(withSponsorship);
                console.log(params);

                const { wait } = await emulatedUsersSmartAccount.sendTransaction(transferTx, {
                    ...params,
                    ...withSponsorship,
                });

                console.log("---------Sending");

                const success = await wait();
                if (success.receipt.transactionHash) {
                    sendTip(post?._id, post?.userId?._id, amount, token);
                }
                setTxhash(`https://polygonscan.com/tx/${success.receipt.transactionHash}`);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while giving tip: ", error);
            setLoading(false);
        }
    };

    const [like, setLike] = useState<boolean>(false);

    const sendTip = async (postId: string, userId: string, amount: string, token: string) => {
        try {
            const response = await axiosInstance.post(`/post/tip/${postId}`, {
                amount,
                token,
                userId,
            });
            console.log("Tip sent successfully:", response.data);
            // Handle success, e.g., show confirmation message
        } catch (error) {
            console.error("Error sending tip");
            // Handle error, e.g., show error message to user
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
            <div className="rounded-2xl relative bg-white">
                <button
                    onClick={() => setShowTipModal(!showTipModal)}
                    className="absolute top-4 right-4 text-xl text-black"
                >
                    <RxCross2 />
                </button>

                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Enter Details</h2>
                    {/* 
                    <input
                        type="text"
                        value={post.smartWalletAddress}
                        onChange={() => {}}
                        className="w-full px-4 py-2 border border-fuchsia-100 rounded-md focus:outline-none focus:ring focus:ring-fuchsia-300"
                        placeholder="Enter address"
                        disabled
                    /> */}

                    <div className="bg-fuchsia-50 mb-4 rounded-xl px-3 py-2">
                        {/* <label className="block text-gray-700"> wallet</label> */}
                        <div className="p-2 rounded flex items-center justify-between gap-2">
                            <span className="overflow-hidden text-ellipsis">{shorten(post.smartWalletAddress)}</span>{" "}
                            <CopyButton copy={post.smartWalletAddress} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <select
                            value={token}
                            onChange={(e) => setToken(e.target.value as "usdc" | "eth" | "dai")}
                            className="px-4 py-2 border border-fuchsia-100 rounded-md focus:outline-none focus:ring focus:ring-fuchsia-300"
                        >
                            <option value="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" className="h-8">
                                USDC
                            </option>
                        </select>

                        <input
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            className="px-4 py-2 border border-fuchsia-100 rounded-md focus:outline-none focus:ring focus:ring-fuchsia-300"
                            placeholder="Amount"
                        />
                    </div>
                    {errors.address && <p className="text-red-500">{errors.address}</p>}
                    {errors.message && <p className="text-red-500">{errors.message}</p>}
                    {errors.amount && <p className="text-red-500">{errors.amount}</p>}
                    {txHash && <p className="mt-4 text-green-500">Transaction hash: {txHash}</p>}
                    <button
                        onClick={handleSubmit}
                        // onClick={() => sendTip(post?._id, post?.userId?._id, amount, token)}
                        className={`mt-4 w-full px-4 py-2 text-white bg-fuchsia-500 rounded-md transition-colors duration-300 hover:bg-fuchsia-600 ${
                            loading ? "bg-fuchsia-600" : "bg-fuchsia-500 hover:bg-fuchsia-600"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Tip"}
                    </button>
                    <button
                        onClick={() => setShowTipModal(!showTipModal)}
                        className="mt-4 w-full px-4 py-2 bg-fuchsia-500 text-white rounded-md transition-colors duration-300 hover:bg-fuchsia-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TipModal;
