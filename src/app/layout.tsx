import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/context/providers";
import {init} from "@airstack/airstack-react"

init(process.env.NEXT_PUBLIC_VITE_AIRSTACK_API_KEY as string)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Defilens",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
