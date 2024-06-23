import axiosInstance from "@/utils/axiosInstance";
import { postDateFormat, shorten } from "@/utils/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { PiCoinLight } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";

import { useAccount, useWalletClient, useWriteContract } from "wagmi";
import erc20 from "../../abi/erc20.json";
import {
    createMultiChainValidationModule,
    createSessionKeyEOA,
    createSessionSmartAccountClient,
    createSmartAccountClient,
    DEFAULT_MULTICHAIN_MODULE,
    getSingleSessionTxParams,
    PaymasterMode,
    SessionLocalStorage,
} from "@biconomy/account";
import { encodeFunctionData, parseAbi, parseUnits } from "viem";
import { polygon } from "viem/chains";
import { useWallets } from "@privy-io/react-auth";
import { BICONOMY_MAINNET_BUNDLAR_KEY, MAINNET_INFURA, POLYGON_BICONOMY_AA_KEY } from "@/utils/keys";
import { BigNumber as bg } from "bignumber.js";
bg.config({ DECIMAL_PLACES: 10 });

interface ModalProps {
    onClose: () => void;
    data: any;
}

const PostCard2 = ({ post, data }: any) => {
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");
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

    useEffect(() => {
        if (txHash) {
            alert("tx success: " + txHash);
        }
        if (data) {
            setAddress(data.Wallet.addresses[0]);
        }
    }, [data, txHash]);

    const handleSubmit = async () => {
        const newErrors: { address?: string; message?: string; amount?: string } = {};
        if (!address) newErrors.address = "Address is required.";
        if (!message) newErrors.message = "Message is required.";
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
            newErrors.amount = "Amount must be a number greater than zero.";
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setTxhash("");
            setLoading(true);
            console.log("Form submitted successfully!");
            // Handle form submission
            const largeNumber = 1e6; // 1 million
            // alert(bg(amount).multipliedBy(largeNumber))

            // await writeContract({
            //     address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            //     abi: erc20,
            //     functionName: "transfer",
            //     args: [data.Wallet.addresses[0], bg(amount).multipliedBy(largeNumber)],//BigInt(amount) * BigInt(largeNumber)
            // });
            // console.log("account-: ", wallets[0], walletClient);

            const multiChainModule = await createMultiChainValidationModule({
                signer: walletClient as any,
                moduleAddress: DEFAULT_MULTICHAIN_MODULE,
            });
            const bundelUrl: string = BICONOMY_MAINNET_BUNDLAR_KEY || "";
            const paymasterApiKey: string = POLYGON_BICONOMY_AA_KEY || "";
            const rpcUrl: string = MAINNET_INFURA || "";

            const usersSmartAccount = await createSmartAccountClient({
                signer: walletClient,
                bundlerUrl: bundelUrl,
                biconomyPaymasterApiKey: paymasterApiKey,
                rpcUrl: rpcUrl,
                defaultValidationModule: multiChainModule,
                activeValidationModule: multiChainModule,
            });
            console.log("usersSmartAccount", usersSmartAccount);
            const { sessionKeyAddress, sessionStorageClient }: any = await createSessionKeyEOA(
                usersSmartAccount,
                polygon
            );

            const withSponsorship = {
                paymasterServiceData: { mode: PaymasterMode.SPONSORED },
            };
            const usersSmartAccountAddress = sessionStorageClient.smartAccountAddress;
            console.log("usersSmartAccountAddress1-: ", usersSmartAccountAddress);
            // const usersSmartAccountAddress = await usersSmartAccount.getAccountAddress()
            // console.log("usersSmartAccountAddress: ", usersSmartAccountAddress)

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
                    args: [data.Wallet.addresses[0], BigInt(bg(amount).multipliedBy(largeNumber).toString())], // BigInt(amount) * BigInt(largeNumber)
                }),
            };
            console.log("transferTx: ", transferTx);

            // const sessionLocalStorage = new SessionLocalStorage(usersSmartAccountAddress);
            // const data3 = await sessionLocalStorage.clearPendingSessions()
            // const data2 = await sessionLocalStorage.getAllSessionData();
            // console.log("data-: ", data2);

            const params = await getSingleSessionTxParams(
                usersSmartAccountAddress,
                polygon,
                0 // index of the relevant policy leaf to the tx
            );
            console.log("Params: ", params);

            const { wait } = await emulatedUsersSmartAccount.sendTransaction(transferTx, {
                ...params,
                ...withSponsorship,
            });

            const success = await wait();
            console.log("success: ", success.receipt.transactionHash);
            setTxhash(`https://polygonscan.com/tx/${success.receipt.transactionHash}`);
            setLoading(false);
        }
    };

    const handleTip = async (postId: string, amount: number) => {
        try {
            const response = await axiosInstance.post("/user/post/tip", { postId, amount }, { withCredentials: true });
            console.log("Tip added successfully:", response.data);
            // Refresh posts after tipping
            const updatedPosts = await axiosInstance.get("/user/post");
            // setPosts(updatedPosts.data);
        } catch (error) {
            console.error("Error adding tip:", error);
        }
    };

    const [like, setLike] = useState<boolean>(false);
    const [showTipModal, setShowTipModal] = useState<boolean>(false);
    return (
        <div className="bg-white p-4 min-w-full max-w-md flex flex-col gap-4 border-t border-purple-100">
            <div className="flex gap-2 w-full">
                <img src={post?.createdBy?.farcaster?.pfp} className="h-10 w-10 rounded-full" />
                <div className="flex flex-col h-10 justify-center text-sm text-gray-500">
                    <p className="text-sm text-gray-600">
                        {post.isSelfCreated
                            ? post.userId.farcaster.displayName
                            : `Created by ${post.createdBy.farcaster.displayName}`}
                    </p>
                    <p>
                        @{post.userId.farcaster.username}{" "}
                        <span className="text-xs">{postDateFormat(post.createdAt)}</span>
                    </p>
                </div>
            </div>
            <p className="text-sm text-gray-500">{post.content}</p>
            <div className="flex gap-4 items-center h-8">
                <div className="text-sm">Tips:</div>
                <div className="px-2 bg-gray-200 rounded-lg text-sm">1 usdc</div>
                <div className="px-2 bg-gray-200 rounded-lg text-sm">2 usdc</div>
                <div className="px-2 bg-gray-200 rounded-lg text-sm">3 usdc</div>
            </div>
            <div className="flex gap-4 justify-between items-center">
                <div className="flex gap-4">
                    <button
                        onClick={() => setLike(!like)}
                        className="flex gap-2 items-center rounded-lg bg-gray-200 hover:bg-gray-300 px-2 py-1 cursor-pointer"
                    >
                        {like ? (
                            <>
                                <AiFillLike />
                                <span className="text-xs">Like</span>
                            </>
                        ) : (
                            <>
                                <AiOutlineLike />
                                <span className="text-xs">Like</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => setShowTipModal(!showTipModal)}
                        className="flex gap-2 items-center rounded-lg bg-gray-200 hover:bg-gray-300 px-2 py-1 cursor-pointer"
                    >
                        <PiCoinLight />
                        <span className="text-xs">Tip</span>
                    </button>
                </div>
                <div className="flex gap-4 broder w-full">
                    <span className="text-xs">12 Likes</span>
                    <span className="text-xs">$100 of tips</span>
                </div>
            </div>
            {showTipModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                    <div className="bg-white rounded-lg w-[50%] h-[50%] relative">
                        <button
                            onClick={() => setShowTipModal(!showTipModal)}
                            className="absolute top-4 right-4 text-xl text-black"
                        >
                            <RxCross2 />
                        </button>

                        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4">
                            <h2 className="text-xl font-semibold">Enter Details</h2>
                            <input
                                type="text"
                                value={data.Wallet.addresses[0]}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter address"
                                disabled
                            />
                            {errors.address && <p className="text-red-500">{errors.address}</p>}
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter message"
                            />
                            {errors.message && <p className="text-red-500">{errors.message}</p>}
                            <div className="flex items-center space-x-2">
                                <select
                                    value={token}
                                    onChange={(e) => setToken(e.target.value as "usdc" | "eth" | "dai")}
                                    className="px-4 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174">USDC</option>
                                    <option value="eth" disabled>
                                        ETH
                                    </option>
                                    <option value="dai" disabled>
                                        DAI
                                    </option>
                                </select>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Amount"
                                />
                            </div>
                            {errors.amount && <p className="text-red-500">{errors.amount}</p>}

                            <button
                                onClick={handleSubmit}
                                className={`mt-4 w-full px-4 py-2 text-white bg-purple-500 rounded-md transition-colors duration-300 hover:bg-purple-600 ${
                                    loading ? "bg-gray-500" : "bg-purple-500 hover:bg-purple-600"
                                }`}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Tip"}
                            </button>
                            {txHash && <p className="mt-4 text-green-500">Transaction hash: {txHash}</p>}
                            <button
                                onClick={onClose}
                                className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded-md transition-colors duration-300 hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PostCard = ({ post }: any) => {
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
        const newErrors: { address?: string; message?: string; amount?: string } = {};
        if (!address) newErrors.address = "Address is required.";
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
            newErrors.amount = "Amount must be a number greater than zero.";
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setTxhash("");
            setLoading(true);
            console.log("Form submitted successfully!");
            // Handle form submission
            const largeNumber = 1e6; // 1 million
            // alert(bg(amount).multipliedBy(largeNumber))

            // await writeContract({
            //     address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            //     abi: erc20,
            //     functionName: "transfer",
            //     args: [data.Wallet.addresses[0], bg(amount).multipliedBy(largeNumber)],//BigInt(amount) * BigInt(largeNumber)
            // });
            // console.log("account-: ", wallets[0], walletClient);

            const multiChainModule = await createMultiChainValidationModule({
                signer: walletClient as any,
                moduleAddress: DEFAULT_MULTICHAIN_MODULE,
            });
            const bundelUrl: string = BICONOMY_MAINNET_BUNDLAR_KEY || "";
            const paymasterApiKey: string = POLYGON_BICONOMY_AA_KEY || "";
            const rpcUrl: string = MAINNET_INFURA || "";

            const usersSmartAccount = await createSmartAccountClient({
                signer: walletClient,
                bundlerUrl: bundelUrl,
                biconomyPaymasterApiKey: paymasterApiKey,
                rpcUrl: rpcUrl,
                defaultValidationModule: multiChainModule,
                activeValidationModule: multiChainModule,
            });
            console.log("usersSmartAccount", usersSmartAccount);
            const { sessionKeyAddress, sessionStorageClient }: any = await createSessionKeyEOA(
                usersSmartAccount,
                polygon
            );

            const withSponsorship = {
                paymasterServiceData: { mode: PaymasterMode.SPONSORED },
            };
            const usersSmartAccountAddress = sessionStorageClient.smartAccountAddress;
            console.log("usersSmartAccountAddress1-: ", usersSmartAccountAddress);
            // const usersSmartAccountAddress = await usersSmartAccount.getAccountAddress()
            // console.log("usersSmartAccountAddress: ", usersSmartAccountAddress)

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
            console.log("transferTx: ", transferTx);

            // const sessionLocalStorage = new SessionLocalStorage(usersSmartAccountAddress);
            // const data3 = await sessionLocalStorage.clearPendingSessions()
            // const data2 = await sessionLocalStorage.getAllSessionData();
            // console.log("data-: ", data2);

            const params = await getSingleSessionTxParams(
                usersSmartAccountAddress,
                polygon,
                0 // index of the relevant policy leaf to the tx
            );
            console.log("Params: ", params);

            const { wait } = await emulatedUsersSmartAccount.sendTransaction(transferTx, {
                ...params,
                ...withSponsorship,
            });

            const success = await wait();
            console.log("success: ", success.receipt.transactionHash);
            if (success.receipt.transactionHash) {
                sendTip(post._id, amount, token);
            }
            setTxhash(`https://polygonscan.com/tx/${success.receipt.transactionHash}`);

            setLoading(false);
        }
    };

    const [like, setLike] = useState<boolean>(false);
    const [showTipModal, setShowTipModal] = useState<boolean>(false);

    const sendTip = async (postId: string, amount: string, token: string) => {
        try {
            const response = await axiosInstance.post(`/user/post/tip/${postId}`, {
                amount,
                token,
            });
            console.log("Tip sent successfully:", response.data);
            // Handle success, e.g., show confirmation message
        } catch (error) {
            console.error("Error sending tip");
            // Handle error, e.g., show error message to user
        }
    };

    const [liked, setLiked] = useState(post.likes.includes(post._id)); // Check if current user has already liked the post

    const handleLike = async () => {
        setLoading(true); // Set loading state to true

        try {
            if (liked) {
                // Dislike post
                await axios.post("/api/dislikePost", { postId: post._id });
                setLiked(false); // Update local state
            } else {
                // Like post
                await axios.post("/api/likePost", { postId: post._id });
                setLiked(true); // Update local state
            }
        } catch (error) {
            console.error("Error liking/disliking post:", error);
            // Handle error: revert state if necessary, show error message, etc.
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="bg-white p-4 min-w-full max-w-md flex flex-col gap-4 border-b border-purple-100">
            <div className="flex gap-2 w-full">
                <img
                    src={
                        post.forOther
                            ? post.otherUserProfile.profileImage
                            : post?.createdBy?.farcaster?.pfp || "https://via.placeholder.com/40"
                    }
                    className="h-10 w-10 rounded-full"
                    alt="Profile"
                />
                <div className="flex flex-col h-10 justify-center text-sm text-gray-500">
                    <p className="text-sm text-gray-600">
                        {post.forOther
                            ? post.otherUserProfile.profileName
                            : shorten(post.smartWalletAddress) || "Anonymous"}
                    </p>
                    <span className="text-xs">{postDateFormat(post.createdAt)}</span>
                </div>
            </div>
            <p className="text-sm text-gray-500">{post.content}</p>
            {/* <img src="https://pbs.twimg.com/media/GQprNFVakAAQs1R?format=jpg&name=small" className="wfull md:w-3/4 mx-auto rounded-lg"/> */}
            {post.links && post.links.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {post.links.map((link: string, index: number) => (
                        <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-500 underline"
                        >
                            {link}
                        </a>
                    ))}
                </div>
            )}
            {/* <div className="flex gap-4 items-center h-8">
                <div className="text-sm">Tips:</div>
                <div className="px-2 bg-gray-200 rounded-lg text-sm">1 usdc</div>
                <div className="px-2 bg-gray-200 rounded-lg text-sm">2 usdc</div>
                <div className="px-2 bg-gray-200 rounded-lg text-sm">3 usdc</div>
            </div> */}
            <div className="flex gap-4 justify-between items-center">
                <div className="flex gap-4">
                    {/* <button
                        onClick={() => setLike(!like)}
                        className="flex gap-2 items-center rounded-lg bg-gray-200 hover:bg-gray-300 px-2 py-1 cursor-pointer"
                    >
                        {like ? (
                            <>
                                <AiFillLike />
                                <span className="text-xs">Like</span>
                            </>
                        ) : (
                            <>
                                <AiOutlineLike />
                                <span className="text-xs">Like</span>
                            </>
                        )}
                    </button> */}
                    <button
                        onClick={() => setShowTipModal(!showTipModal)}
                        className="flex gap-2 items-center rounded-lg bg-gray-200 hover:bg-gray-300 px-2 py-1 cursor-pointer"
                    >
                        <PiCoinLight />
                        <span className="text-xs">Tip</span>
                    </button>
                </div>
                <div className="flex gap-4 broder w-full">
                    {/* <span className="text-xs">{post.likes.length} Likes</span> */}
                    <span className="text-xs">${post.totalTips} of tips</span>
                </div>
            </div>
            {showTipModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                    <div className="rounded-lg relative">
                        <button
                            onClick={() => setShowTipModal(!showTipModal)}
                            className="absolute top-4 right-4 text-xl text-black"
                        >
                            <RxCross2 />
                        </button>

                        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4">
                            <h2 className="text-xl font-semibold">Enter Details</h2>
                            
                            
                            <input
                                type="text"
                                value={post.smartWalletAddress}
                                onChange={() => {}}
                                className="w-full px-4 py-2 border border-purple-100 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                                placeholder="Enter address"
                                disabled
                            />

                            <div className="flex items-center space-x-2">
                                <select
                                    value={token}
                                    onChange={(e) => setToken(e.target.value as "usdc" | "eth" | "dai")}
                                    className="px-4 py-2 border border-purple-100 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                                >
                                    <option value="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" className="h-8">
                                        USDC
                                    </option>
                                    {/* <option value="eth" disabled>
                                        ETH
                                    </option>
                                    <option value="dai" disabled>
                                        DAI
                                    </option> */}
                                </select>

                                <input
                                    type="number"
                                    value={amount}
                                    // onChange={(e) => setAmount(e.target.value)}
                                    onChange={handleAmountChange}
                                    className="px-4 py-2 border border-purple-100 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                                    placeholder="Amount"
                                />
                            </div>

                            {errors.address && <p className="text-red-500">{errors.address}</p>}
                            {errors.message && <p className="text-red-500">{errors.message}</p>}
                            {errors.amount && <p className="text-red-500">{errors.amount}</p>}

                            {txHash && <p className="mt-4 text-green-500">Transaction hash: {txHash}</p>}
                            <button
                                onClick={handleSubmit}
                                className={`mt-4 w-full px-4 py-2 text-white bg-purple-500 rounded-md transition-colors duration-300 hover:bg-purple-600 ${
                                    loading ? "bg-purple-600" : "bg-purple-500 hover:bg-purple-600"
                                }`}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Tip"}
                            </button>
                            {/* <button
                                onClick={handleSubmit}
                                className={`mt-4 w-full px-4 py-2 text-white bg-purple-500 rounded-md transition-colors duration-300 hover:bg-purple-600 ${
                                    loading ? "bg-gray-500" : "bg-purple-500 hover:bg-purple-600"
                                }`}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Tip"}
                            </button> */}

                            <button
                                onClick={() => setShowTipModal(!showTipModal)}
                                className="mt-4 w-full px-4 py-2 bg-purple-500 text-white rounded-md transition-colors duration-300 hover:bg-purple-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
