import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState, useEffect } from "react";

// TODO: Replace with actual deployed package ID
const PACKAGE_ID = "0x0";
const MODULE_NAME = "chaindocs";

export const useChainDocs = () => {
    const account = useCurrentAccount();
    const client = useSuiClient();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
    const [vaultId, setVaultId] = useState<string | null>(null);
    const [documents] = useState<any[]>([]);
    const [folders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user's vault
    useEffect(() => {
        if (!account) return;

        const fetchVault = async () => {
            setIsLoading(true);
            try {
                const { data } = await client.getOwnedObjects({
                    owner: account.address,
                    filter: {
                        StructType: `${PACKAGE_ID}::${MODULE_NAME}::ChainDocsVault`,
                    },
                    options: {
                        showContent: true,
                    }
                });

                if (data.length > 0) {
                    const vault = data[0].data;
                    setVaultId(vault?.objectId || null);
                }
            } catch (error) {
                console.error("Error fetching vault:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVault();
    }, [account, client]);

    const createVault = async (name: string) => {
        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::create_vault`,
            arguments: [tx.pure.string(name), tx.pure.string("My Vault")],
        });

        // Enoki automatically sponsors this transaction when using zkLogin wallet
        return signAndExecute({ transaction: tx });
    };

    const uploadDocument = async (file: File, name: string, description: string, folderId?: string) => {
        if (!vaultId) throw new Error("No vault found");

        const tx = new Transaction();

        // Convert file to bytes
        const bytes = new Uint8Array(await file.arrayBuffer());

        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::upload_document`,
            arguments: [
                tx.object(vaultId),
                tx.pure.string(name),
                tx.pure.string(description),
                tx.pure(bytes),
                tx.pure.string(file.type),
                folderId ? tx.pure.id(folderId) : tx.pure.option("address", null),
                tx.object("0x6"), // Clock
            ],
        });

        // Enoki automatically sponsors this transaction when using zkLogin wallet
        return signAndExecute({ transaction: tx });
    };

    return {
        vaultId,
        documents,
        folders,
        isLoading,
        createVault,
        uploadDocument,
    };
};
