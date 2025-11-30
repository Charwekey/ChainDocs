import React, { type ReactNode } from "react";
import { EnokiFlowProvider } from "@mysten/enoki/react";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface EnokiProviderProps {
    children: ReactNode;
}

export const EnokiProvider: React.FC<EnokiProviderProps> = ({ children }) => {
    // Enoki Public API Key - enables zkLogin and frontend features
    const ENOKI_API_KEY = "enoki_public_e4d826ad4b84226f1fbd5045fe6cb45a";

    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={{ testnet: { url: getFullnodeUrl("testnet") } }} defaultNetwork="testnet">
                <WalletProvider>
                    <EnokiFlowProvider apiKey={ENOKI_API_KEY}>
                        {children}
                    </EnokiFlowProvider>
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
};
