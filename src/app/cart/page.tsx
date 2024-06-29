"use client";
import { useState, useEffect } from "react";
import { DataState } from "@/context/dataProvider";
import CustomButton from "@/components/custom/CustomButtons";
import { encodeFunctionData, parseAbi } from "viem";
import { BigNumber as bg } from "bignumber.js";
import axiosInstance from "@/utils/axiosInstance";
import {
    PaymasterMode,
    createSessionKeyEOA,
    createSessionSmartAccountClient,
    getSingleSessionTxParams,
} from "@biconomy/account";
import { BASE_BICONOMY_AA_KEY, BICONOMY_MAINNET_BUNDLAR_KEY } from "@/utils/keys";
import { base } from "viem/chains";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import AvatarIcon from "@/components/Avatar";
import { postDateFormat, shorten } from "@/utils/constants";
import CopyButton from "@/components/custom/CopyButton";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
bg.config({ DECIMAL_PLACES: 10 });

const toSmallestUnit = (amount: any, decimals = 6) => {
    return BigInt(amount * Math.pow(10, decimals));
};

const TipPosts = () => {
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sendTxnloading, setSendTxnloading] = useState<boolean>(false);

    useEffect(() => {
        const fetchBookmarkedPosts = async () => {
            try {
                const response = await axiosInstance.get("/post/bookmarked");

                setBookmarkedPosts(response.data.bookmarkedPosts);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bookmarked posts:", err);
                setError("Error fetching bookmarked posts");
                setLoading(false);
            }
        };
        fetchBookmarkedPosts();
    }, []);

    const { smartAccount, usdcBalance, biconomySession } = DataState();
    const [tipAmounts, setTipAmounts] = useState<any>({});
    const [txHash, setTxHash] = useState<string>("");
    const [errors, setErrors] = useState<any>({});
    const [showAnimation, setShowAnimation] = useState(false);

    const handleInputChange = (postId: any, amount: any) => {
        const decimalPlaces = amount.split(".")[1]?.length || 0;

        if (decimalPlaces > 4) {
            toast.error("Amount cannot be too small");
            return;
        }
        setTipAmounts({
            ...tipAmounts,
            [postId]: amount,
        });
    };

    const handleSubmit = async () => {
        try {
            const newErrors: any = {};
            const txArray: any = [];
            let totalAmount = 0;

            bookmarkedPosts.forEach((post: any) => {
                const amount = tipAmounts[post._id];
                if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                    newErrors[post._id] = "Amount must be a number greater than zero.";
                } else {
                    totalAmount += Number(amount);
                    txArray.push({
                        to: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                        data: encodeFunctionData({
                            abi: parseAbi(["function transfer(address,uint256)"]),
                            functionName: "transfer",
                            args: [post.smartWalletAddress, BigInt(bg(amount).multipliedBy(1e6).toString())],
                        }),
                    });
                }
            });

            console.log("txArray:", txArray);

            setErrors(newErrors);
            console.log("totalAmount", totalAmount);
            console.log("usdcBalance", usdcBalance);

            const totalAmountInSmallestUnit = toSmallestUnit(totalAmount);
            const balanceInSmallestUnit = toSmallestUnit(usdcBalance);

            console.log("small - totalAmount", totalAmountInSmallestUnit);
            console.log("small - usdcBalance", balanceInSmallestUnit);

            if (totalAmountInSmallestUnit > balanceInSmallestUnit) {
                toast.error("You have low balance.");
                return;
            }
            if (Object.keys(newErrors).length === 0) {
                setTxHash("");
                setSendTxnloading(true);

                const usersSmartAccount = smartAccount;
                const { sessionKeyAddress, sessionStorageClient }: any = await createSessionKeyEOA(
                    usersSmartAccount,
                    base
                );

                const withSponsorship = {
                    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
                };
                const usersSmartAccountAddress = sessionStorageClient.smartAccountAddress;
                console.log(usersSmartAccountAddress);

                const emulatedUsersSmartAccount = await createSessionSmartAccountClient(
                    {
                        accountAddress: usersSmartAccountAddress, // Dapp can set the account address on behalf of the user
                        bundlerUrl: BICONOMY_MAINNET_BUNDLAR_KEY as string,
                        paymasterUrl: `https://paymaster.biconomy.io/api/v1/8453/${BASE_BICONOMY_AA_KEY}`,
                        chainId: 8453,
                    },
                    usersSmartAccountAddress // Storage client, full Session or simply the smartAccount address if using default storage for your environment
                );

                console.log("----------step-1");
                const index = biconomySession.length - 1;
                const params = await getSingleSessionTxParams(
                    usersSmartAccountAddress,
                    base,
                    index // index of the relevant policy leaf to the tx
                );

                console.log("----------step-2");
                const { wait } = await emulatedUsersSmartAccount.sendTransaction(txArray, {
                    ...params,
                    ...withSponsorship,
                });

                console.log("---------Sending");

                const success = await wait();
                if (success.receipt.transactionHash) {
                    // Update tips in the backend
                    bookmarkedPosts.forEach((post: any) => {
                        sendTip(post?._id, post?.userId, tipAmounts[post?._id], "usdc");
                    });
                    setTxHash(`https://basescan.org/tx/${success.receipt.transactionHash}`);
                    setShowAnimation(true);
                    setTimeout(() => {
                        setShowAnimation(false);
                    }, 3000);
                }

                setTxHash(`https://basescan.org/tx/${success.receipt.transactionHash}`);
                setSendTxnloading(false);
            }
        } catch (error) {
            console.error("Error while giving tip: ", error);
            setSendTxnloading(false);
        }
    };

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
        <div className="container mx-auto p-4">
            {sendTxnloading && <Loading />}
            <h1 className="text-2xl font-bold mb-4">Tip Your Favorite Posts</h1>
            {bookmarkedPosts.map((post: any) => (
                <div key={post._id} className="flex flex-col border border-B900 p-4 rounded mb-4">
                    <div className="flex gap-3 w-full mb-4">
                        {post.userId?.image ? (
                            <img
                                src={post.userId?.image || "https://via.placeholder.com/40"}
                                className="h-12 w-12 rounded-full"
                                alt="Profile"
                            />
                        ) : (
                            <div className="h-12 w-12">
                                <AvatarIcon address={post?.smartWalletAddress} />
                            </div>
                        )}

                        <div className="flex flex-col h-12 justify-center text-sm">
                            <p className="text-lg text-primary-text font-semibold flex items-center gap-2">
                                <span>{post.forOther ? post.otherUserProfile.profileName : post.userId?.name}</span>
                                {post.forOther && <span className="text-xs">created by</span>}
                                {post.forOther && (
                                    <span className="text-base">
                                        (
                                        {post?.userId?.name
                                            ? post?.userId?.name
                                            : shorten(post?.userId?.smartAccountAddress)}
                                        )
                                    </span>
                                )}
                            </p>
                            <span className="text-xs text-secondary-text">{postDateFormat(post.createdAt)}</span>
                        </div>
                    </div>
                    <div className="flex p-4 items-center rounded mb-4">
                        {post?.imgUrl && <img src={post.imgUrl} alt="Post" className="w-16 h-16 rounded mr-4" />}
                        <div className="flex-1">
                            <h2 className="font-semibold text-lg">{post.content.slice(0, 100)}</h2>
                            <input
                                type="number"
                                placeholder="Enter tip amount"
                                value={tipAmounts[post._id] || ""}
                                onChange={(e) => handleInputChange(post._id, e.target.value)}
                                className="border p-2 rounded w-full mt-2"
                            />
                            {errors[post._id] && <p className="text-red-500">{errors[post._id]}</p>}
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-end">
                <CustomButton onClick={handleSubmit} disabled={loading}>
                    {loading ? "Processing..." : "Send Tips"}
                </CustomButton>
            </div>
            {txHash && (
                <div className="mt-4">
                    <p className="text-green-500">
                        Transaction Successful:{" "}
                        <a href={txHash} target="_blank" rel="noopener noreferrer">
                            {shorten(txHash)}
                        </a>
                        <CopyButton copy={txHash} />
                    </p>
                </div>
            )}
        </div>
    );
};

const page = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookmarkedPosts = async () => {
            try {
                const response = await axiosInstance.get("/post/bookmarked");

                setPosts(response.data.bookmarkedPosts);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bookmarked posts:", err);
                setError("Error fetching bookmarked posts");
                setLoading(false);
            }
        };

        fetchBookmarkedPosts();
    }, []);

    return (
        <NavigationLayout>
            <TipPosts />
        </NavigationLayout>
    );
};

export default page;
