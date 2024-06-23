import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/context/providers";
import { init } from "@airstack/airstack-react";
import DataStore from "@/context/dataStore";

init(process.env.NEXT_PUBLIC_VITE_AIRSTACK_API_KEY as string);

export const metadata: Metadata = {
    title: "Defilens",
    description: "",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <DataStore>{children}</DataStore>
                </Providers>
            </body>
        </html>
    );
}
