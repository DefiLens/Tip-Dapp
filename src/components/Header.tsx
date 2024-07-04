"use client";

import { useLogout, usePrivy } from "@privy-io/react-auth";
import CustomButton from "./custom/CustomButtons";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { SessionLocalStorage } from "@biconomy/account";
import { DataState } from "@/context/dataProvider";
import axios from "axios";
import { BASE_URL } from "@/utils/keys";

const Header = () => {
    const router = useRouter();
    const { smartAccountAddress, checkSession } = DataState();
    const { ready, authenticated, getAccessToken } = usePrivy();

    const { logout } = useLogout({
        onSuccess: () => {
            logoutApi();
        },
    });

    const logoutApi = async () => {
        try {
            // await axiosInstance.post("/user/logout");
            
            const accessToken = await getAccessToken();
            await axios.post(`${BASE_URL}/user/logout`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            router.push("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const clearSession = async () => {
        const sessionLocalStorage = new SessionLocalStorage(smartAccountAddress);
        const data = await sessionLocalStorage.clearPendingSessions();
        checkSession()
    };

    return (
        <header className="mx-auto flex justify-end gap-3 items-center py-4 px-4 text-black bg-white border-b border-blue-100 h-16">
            <div className="text-2xl font-bold"></div>
            {/* <CustomButton onClick={clearSession}>Clear Session</CustomButton> */}
            <CustomButton onClick={() => router.push("/create-post")}>Create Post</CustomButton>
            {ready && authenticated && <CustomButton onClick={logout}>Logout</CustomButton>}
            {ready && !authenticated && <CustomButton onClick={() => router.push("/login")}>Login</CustomButton>}
        </header>
    );
};
export default Header;
