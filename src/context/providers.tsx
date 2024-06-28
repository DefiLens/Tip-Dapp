"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { arbitrum, base, mainnet, optimism, sepolia } from "viem/chains";

import type { PrivyClientConfig } from "@privy-io/react-auth";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
    // chains: [mainnet, base, arbitrum, optimism, base],
    chains: [base],
    transports: {
        // [mainnet.id]: http(),
        [base.id]: http(),
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
    defaultChain: base
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