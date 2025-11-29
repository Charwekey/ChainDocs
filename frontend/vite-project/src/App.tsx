import { EnokiProvider } from "./providers/EnokiProvider";
import { Layout } from "./components/Layout";
import { UploadModal } from "./components/UploadModal";
import { Button } from "./components/ui/button";
import { useCurrentAccount } from "@mysten/dapp-kit";

function Dashboard() {
  const account = useCurrentAccount();

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-shield-check"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome to ChainDocs</h2>
        <p className="text-muted-foreground max-w-md">
          Connect your wallet to access your permanent, decentralized document vault.
          Powered by Sui and Enoki for a seamless experience.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Documents</h2>
          <p className="text-muted-foreground">
            Manage your permanently stored files.
          </p>
        </div>
        <UploadModal />
      </div>

      {/* Document Grid Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* We will map documents here */}
        <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground h-48">
          <p>No documents found</p>
          <Button variant="link" className="mt-2">Upload your first file</Button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <EnokiProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </EnokiProvider>
  );
}

export default App;
