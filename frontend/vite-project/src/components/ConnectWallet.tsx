import { useEnokiFlow } from "@mysten/enoki/react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Wallet } from "lucide-react";
import { useState } from "react";

export const ConnectWallet = () => {
    const account = useCurrentAccount();
    const flow = useEnokiFlow();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            // Start the Google zkLogin flow
            // Get your Client ID from Google Cloud Console and configure it in Enoki Dashboard
            window.location.href = await flow.createAuthorizationURL({
                provider: "google",
                clientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Replace with your Google OAuth Client ID
                redirectUrl: window.location.origin,
                network: "testnet",
            });
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await flow.logout();
        window.location.reload();
    };

    if (account) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">
                        {account.address.slice(0, 6)}...{account.address.slice(-4)}
                    </span>
                    <span className="text-xs text-muted-foreground">Connected</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Wallet className="mr-2 h-4 w-4" />
            )}
            Connect Wallet
        </Button>
    );
};
