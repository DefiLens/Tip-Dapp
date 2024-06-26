"use client";
import CustomButton from "@/components/custom/CustomButtons";
import { DataState } from "@/context/dataProvider";
import { iGlobal, useGlobalStore } from "@/context/globalStore";
import axiosInstance from "@/utils/axiosInstance";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [isFarcasterConnected, setIsFarcasterConnected] = useState(false);
    const router = useRouter();

    const { createSmartAccount } = DataState();

    // alert(privySession?.toString())
    const { ready, authenticated } = usePrivy();
    const { login } = useLogin({
        onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
            console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount);

            const address = await createSmartAccount();
            const userData = {
                id: user.id,
                createdAt: user.createdAt,
                linkedAccounts: user.linkedAccounts,
                wallet: user.wallet,
                smartAccountAddress: address,
            };

            sendUserDataToBackend(userData);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const sendUserDataToBackend = async (data: any) => {
        try {
            const response = await axiosInstance.post("/user", data);
            if (response.data.alreadyReg) {
                router.push("/");
            } else {
                setIsWalletConnected(true);
            }
            setIsWalletConnected(true);
        } catch (error) {
            console.error("Error sending user data:", error);
        }
    };

    const handleRedirectToDeposit = () => {
        router.push("/deposit");
    };

    return (
        <div className="flex h-screen">
            {/* Left side */}
            <div className="w-1/2 bg-fuchsia-200 p-8 flex flex-col justify-center items-center">
                <div className="p-5 rounded-3xl bg-white bg bg-opacity-30 bg-blur-lg text-gray-700 flex flex-col items-center justify-center h-[90%] w-[90%]">
                    {/* <img src={"https://www.base.org/_next/static/media/ocs_banner.686b35dd.svg"} className="mb-4" /> */}
                    <h2 className="text-6xl text-center font-bold mb-10 text-black">Welcome to Base Chain DApp</h2>
                    <p className="text-center text-lg mb-4 w-3/4 ">
                        Join our decentralized platform where you can create posts, give tips, and earn tips on your own
                        posts.
                    </p>
                    <p className="text-center text-lg w-3/4 ">
                        Experience the power of blockchain with secure and transparent transactions.
                    </p>
                </div>
            </div>

            {/* Right side */}
            <div className="w-1/2 bg-fuchsia-100 p-8 flex flex-col justify-center items-center">
                {!isWalletConnected ? (
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold mb-4">
                            Please connect your wallet
                            <br /> to get started.
                        </h2>
                        {ready && !authenticated && <CustomButton onClick={login}>Connect Wallet</CustomButton>}
                        <div className="mt-8 text-sm text-gray-500">
                            <p>
                                By connecting your wallet,
                                <br /> you agree to our Terms and Conditions.
                            </p>
                            <p className="">Protected by Privy.</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center flex flex-col items-center justify-center">
                        <p className="mb-8 font-semibold text-2xl w-3/4">
                            Deposit USDC to your account to start using the platform.
                        </p>
                        <CustomButton onClick={handleRedirectToDeposit}>Deposit USDC</CustomButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
