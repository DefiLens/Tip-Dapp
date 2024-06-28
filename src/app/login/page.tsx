"use client";
import CreateSessionButton from "@/components/CreateSession";
import CustomButton from "@/components/custom/CustomButtons";
import { DataState } from "@/context/dataProvider";
import axiosInstance from "@/utils/axiosInstance";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Login = () => {
    const { createSmartAccount, isBiconomySession } = DataState();
    const { ready, authenticated } = usePrivy();
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [isSession, setIsSession] = useState(false);

    const router = useRouter();

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
        } catch (error) {
            console.error("Error sending user data:", error);
        }
    };

    const handleRedirectToDeposit = () => {
        router.push("/deposit");
    };

    useEffect(() => {
        if (authenticated) {
            setIsSession(isBiconomySession);
        }
    }, [authenticated]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left side */}
            <div className="w-1/2 bg-fuchsia-200 p-8 flex flex-col justify-center items-center">
                <div className="p-5 rounded-3xl bg-white bg-opacity-30 bg-blur-lg text-gray-700 flex flex-col items-center justify-center h-[90%] w-[90%] shadow-xl">
                    <h2 className="text-6xl text-center font-bold mb-10 text-fuchsia-800">
                        Welcome to Base Chain DApp
                    </h2>
                    <p className="text-center text-lg mb-4 w-3/4 text-fuchsia-700">
                        Join our decentralized social platform where you can share posts, give tips, and earn USDC tips
                        on your own content.
                    </p>
                    <p className="text-center text-lg w-3/4 text-fuchsia-700">
                        Experience the power of blockchain with secure and transparent transactions.
                    </p>
                </div>
            </div>

            {/* Right side */}
            <div className="w-1/2 bg-fuchsia-100 p-8 flex flex-col justify-center items-center">
                {!isWalletConnected ? (
                    <div className="text-center flex flex-col items-center">
                        <h2 className="text-3xl font-semibold mb-4 text-fuchsia-800">
                            Please connect your wallet
                            <br /> to get started.
                        </h2>
                        <CustomButton onClick={login}>Connect Wallet</CustomButton>
                        <div className="mt-8 text-sm text-fuchsia-700">
                            <p>
                                By connecting your wallet,
                                <br /> you agree to our Terms and Conditions.
                            </p>
                            <p>Protected by Privy.</p>
                        </div>
                    </div>
                ) : !isSession ? (
                    <div className="text-center flex flex-col items-center">
                        <h2 className="text-3xl font-semibold mb-4 text-fuchsia-800">
                            Create a session for a seamless
                            <br /> payment experience
                        </h2>
                        <CreateSessionButton />
                        <div className="mt-8 text-sm text-fuchsia-700">
                            <p>
                                After creating a session, your wallet will not need to be opened for sending
                                transactions.
                                <br /> We cover gas fees for you, making tipping in USDC effortless.
                            </p>
                            <p>Protected by Biconomy.</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center flex flex-col items-center justify-center">
                        <p className="mb-8 font-semibold text-2xl w-3/4 text-fuchsia-800">
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
