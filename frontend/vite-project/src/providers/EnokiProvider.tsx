import React, { type ReactNode } from "react";
import { EnokiFlowProvider } from "@mysten/enoki/react";
import { SuiClientProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface EnokiProviderProps {
    children: ReactNode;
}

export const EnokiProvider: React.FC<EnokiProviderProps> = ({ children }) => {
    // Enoki Private API Key - enables sponsored transactions and zkLogin
    const ENOKI_API_KEY = "enoki_private_dc867d79a3693b67942a22d5b0d65e9b";

    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={{ testnet: { url: getFullnodeUrl("testnet") } }} defaultNetwork="testnet">
                <EnokiFlowProvider apiKey={ENOKI_API_KEY}>
                    {children}
                </EnokiFlowProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
};
