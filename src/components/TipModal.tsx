import { DataState } from "@/context/dataProvider";
import axiosInstance from "@/utils/axiosInstance";
import { BICONOMY_MAINNET_BUNDLAR_KEY, BASE_BICONOMY_AA_KEY, BASE_URL } from "@/utils/keys";
import {
    PaymasterMode,
    createSessionKeyEOA,
    createSessionSmartAccountClient,
    getSingleSessionTxParams,
} from "@biconomy/account";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { encodeFunctionData, parseAbi } from "viem";
import { base } from "viem/chains";
import { useWalletClient, useWriteContract } from "wagmi";
import { BigNumber as bg } from "bignumber.js";
import CopyButton from "./custom/CopyButton";
import { shorten } from "@/utils/constants";
bg.config({ DECIMAL_PLACES: 10 });
import { FiExternalLink } from "react-icons/fi";
import Lottie from "lottie-react";
import animationData from "../../public/assets/party.json";
import Link from "next/link";
import Loading from "./Loading";
import axios from "axios";

const TipModal = ({ post, showTipModal, setShowTipModal }: any) => {
    const { getAccessToken } = usePrivy();

    const { smartAccountAddress, smartAccount, biconomySession } = DataState();
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
    const [showAnimation, setShowAnimation] = useState(false);
    const receiptSmartWalletAddress = post.smartWalletAddress;

    const handleAmountChange = (e: any) => {
        const inputAmount = e.target.value;

        if (/^\d*\.?\d*$/.test(inputAmount)) {
            setAmount(inputAmount);
        }
    };

    const handleSubmit = async () => {
        try {
            const newErrors: { address?: string; message?: string; amount?: string } = {};
            if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
                newErrors.amount = "Amount must be a number greater than zero.";
            setErrors(newErrors);

            if (Object.keys(newErrors).length === 0) {
                setTxhash("");
                setLoading(true);
                const largeNumber = 1e6; // 1 million

                const usersSmartAccount = smartAccount;
                const { sessionKeyAddress, sessionStorageClient }: any = await createSessionKeyEOA(
                    usersSmartAccount,
                    base
                );

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
                const transferTx = {
                    to: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    data: encodeFunctionData({
                        abi: parseAbi(["function transfer(address,uint256)"]),
                        functionName: "transfer",
                        args: [receiptSmartWalletAddress, BigInt(bg(amount).multipliedBy(largeNumber).toString())], // BigInt(amount) * BigInt(largeNumber)
                    }),
                };

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

                console.log("---------Sending");

                const success = await wait();

                if (success.receipt.transactionHash) {
                    setTxhash(`https://basescan.org/tx/${success.receipt.transactionHash}`);
                    sendTip(post?._id, post?.userId?._id, amount, token);
                    setShowAnimation(true);
                    setTimeout(() => {
                        setShowAnimation(false);
                    }, 3000);
                }
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
            // const response = await axiosInstance.post(`/post/tip/${postId}`, {
            // amount,
            // token,
            // userId,
            // });

            const accessToken = await getAccessToken();
            const response = await axios.post(
                `${BASE_URL}/post/tip/${postId}`,
                { amount, token, userId },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log("Tip sent successfully:", response.data);
            // Handle success, e.g., show confirmation message
        } catch (error) {
            console.error("Error sending tip");
            // Handle error, e.g., show error message to user
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
            {loading && <Loading />}
            <div className="rounded-2xl relative bg-white max-w-[90%] md:max-w-[40%] w-full">
                <button
                    onClick={() => setShowTipModal(!showTipModal)}
                    className="absolute top-4 right-4 text-xl text-black"
                >
                    <RxCross2 />
                </button>

                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Enter Details</h2>
                    <div className="bg-B900 mb-4 rounded-xl px-3 py-2">
                        <div className="p-2 rounded flex items-center justify-between gap-2">
                            <span className="overflow-hidden text-ellipsis">{shorten(post.smartWalletAddress)}</span>{" "}
                            <CopyButton copy={post.smartWalletAddress} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <select
                            value={token}
                            onChange={(e) => setToken(e.target.value as "usdc" | "eth" | "dai")}
                            className="px-4 py-2 border border-B900 rounded-md focus:outline-none focus:ring focus:ring-B900"
                        >
                            <option value="0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA" className="h-8">
                                USDC
                            </option>
                        </select>

                        <input
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            className="px-4 py-2 border border-B900 rounded-md focus:outline-none focus:ring focus:ring-B900 w-full"
                            placeholder="Amount"
                        />
                    </div>
                    {errors.address && <p className="text-red-500">{errors.address}</p>}
                    {errors.amount && <p className="text-red-500">{errors.amount}</p>}
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
                    <button
                        onClick={handleSubmit}
                        className={`mt-4 w-full px-4 py-2 text-white bg-B0 rounded-md transition-colors duration-300 hover:bg-B30 ${
                            loading ? "bg-B30" : "bg-B0 hover:bg-30"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Tip"}
                    </button>
                </div>
            </div>
            {showAnimation && (
                <div className="fixed inset-0 flex items-center justify-center  p-4 z-50">
                    <div className="rounded-2xl relative w-full h-full">
                        <Lottie
                            animationData={animationData}
                            loop={true}
                            autoplay={true}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TipModal;
