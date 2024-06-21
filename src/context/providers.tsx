"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "viem/chains";

import type { PrivyClientConfig } from "@privy-io/react-auth";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
    // chains: [mainnet, polygon, arbitrum, optimism, base],
    chains: [polygon],
    transports: {
        // [mainnet.id]: http(),
        [polygon.id]: http(),
        // [arbitrum.id]: http(),
        // [optimism.id]: http(),
        // [base.id]: http(),
    },
});

const privyConfig: PrivyClientConfig = {
    embeddedWallets: {
        // createOnLogin: "users-without-wallets",
        createOnLogin: "off",
        // requireUserPasswordOnCreate: true,
        // noPromptOnSignature: false,
    },
    // loginMethods: ["wallet", "email", "sms", "farcaster"],
    loginMethods: ["wallet"],
    appearance: {
        showWalletLoginFirst: true,
    },
    defaultChain: polygon 
};

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // apiUrl={process.env.NEXT_PUBLIC_PRIVY_AUTH_URL as string}
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
            config={privyConfig}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
                    {children}
                </WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
}

// appId="clw6b06dt01y7tijyl1gxs21d"
// config={{
//   appearance: {
//     accentColor: "#6d3a37",
//     theme: "#360c20",
//     showWalletLoginFirst: false,
//     logo: "https://pub-dc971f65d0aa41d18c1839f8ab426dcb.r2.dev/privy-dark.png",
//   },
//   loginMethods: ["wallet"],
//   embeddedWallets: {
//     createOnLogin: "users-without-wallets",
//     requireUserPasswordOnCreate: false,
//   },
//   mfa: { noPromptOnMfaRequired: false },
// }}
