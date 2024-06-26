import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/context/providers";
import { init } from "@airstack/airstack-react";
import DataStore from "@/context/dataStore";
import { Toaster } from "react-hot-toast";

init(process.env.NEXT_PUBLIC_VITE_AIRSTACK_API_KEY as string);

export const metadata: Metadata = {
    title: "Defilens",
    description: "",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: "#fff",
                            color: "black",
                            padding: "6px 20px",
                            borderRadius: "4px",
                            maxWidth: "350px",
                            height: "45px",
                            textAlign: "center",
                            fontSize: "13px"
                        },
                    }}
                />
                <Providers>
                    <DataStore>{children}</DataStore>
                </Providers>
            </body>
        </html>
    );
}
