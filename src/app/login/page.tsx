"use client";
import CustomButton from "@/components/custom/CustomButtons";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const router = useRouter();

    const { ready, authenticated } = usePrivy();
    const { login } = useLogin({
        onComplete: (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
            console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount);
            setIsWalletConnected(true);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const handleRedirectToDeposit = () => {
        router.push("/deposit");
    };

    return (
        <div className="flex h-screen">
            {/* Left side */}
            <div className="w-1/2 bg-white p-8 flex flex-col justify-center items-center">
                <div className="bg-sky-200 p-5 rounded-3xl text-gray-700 flex flex-col items-center justify-center">
                    <img src={"https://www.base.org/_next/static/media/ocs_banner.686b35dd.svg"} className="mb-4"/>
                    <h2 className="text-6xl text-center font-bold mb-10">Welcome to Base Chain DApp</h2>
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
            <div className="w-1/2 bg-gray-100 p-8 flex flex-col justify-center items-center">
                {!isWalletConnected ? (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4">Welcome to Our Platform</h2>
                        <p className="mb-8">Please connect your wallet to get started.</p>
                        {ready && !authenticated && <CustomButton onClick={login}>Connect Wallet</CustomButton>}
                        <div className="mt-8 text-sm text-gray-500">
                            <p>By connecting your wallet, you agree to our Terms and Conditions.</p>
                            <p className="mt-2">Protected by Privy.</p>
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
