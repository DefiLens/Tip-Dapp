"use client";

import { usePrivy } from "@privy-io/react-auth";
import CustomButton from "./custom/CustomButtons";
import { useRouter } from "next/navigation";
import { DataState } from "@/context/dataProvider";

const Header = () => {
    const router = useRouter();
    const { ready, user, authenticated, logout } = usePrivy();
    const { usdcBalance } = DataState();

    return (
        <header className="mx-auto flex justify-between items-center py-4 px-4 text-black bg-white bg-opacity-55 backdrop-blur-sm border-b border-blue-100">
            <div className="text-2xl font-bold">
                <span className="">${usdcBalance}</span>
            </div>
            {ready && authenticated && <CustomButton onClick={logout}>Logout</CustomButton>}
            {ready && !authenticated && <CustomButton onClick={() => router.push("/login")}>Login</CustomButton>}
        </header>
    );
};
export default Header;
