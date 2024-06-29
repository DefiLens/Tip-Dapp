"use client";

import CustomButton from "@/components/custom/CustomButtons";
import AuthLayout from "@/components/layouts/AuthLayout";
import { DataState } from "@/context/dataProvider";
import axiosInstance from "@/utils/axiosInstance";
import { useLogin } from "@privy-io/react-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const page = () => {
    const router = useRouter();
    const { createSmartAccount } = DataState();

    const { login } = useLogin({
        onComplete: async (user) => {
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
            const response = await axiosInstance.post("/user/login", data);

            if (response.data.alreadyReg) {
                router.push("/sign-up");
                toast.error("Sign up first")
            } else {
            }
        } catch (error) {
            console.error("Error sending user data:", error);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center flex flex-col items-center justify-center relative h-full DM_Mono">
                <h2 className="text-3xl font-semibold mb-8 text-gray-800 ">Login with your wallet</h2>
                <button
                    onClick={login}
                    className="bg-B0 hover:bg-B10 text-white text-xl font-medium py-3 px-7 rounded-lg hover:scale-105 transition-all shadow-md hover:shadow-2xl"
                >
                    Login
                </button>
                <div>
                    <p className="text-sm mt-5 text-B20">
                        Don't have an account ?{" "}
                        <Link href="/sign-up" className="text-sm text-B30 font-semibold">
                            Sign up
                        </Link>
                    </p>
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 mt-8 text-sm text-gray-700 flex items-center gap-3 w-full justify-center">
                    <p>Protected by </p>
                    <img src="https://auth.privy.io/logos/privy-logo.png" className="h-5" />
                </div>
            </div>
        </AuthLayout>
    );
};

export default page;
