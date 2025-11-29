import { type ReactNode } from "react";
import { ConnectWallet } from "./ConnectWallet";
import { Folder, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-muted/10 hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground p-1 rounded">CD</span>
                        ChainDocs
                    </h1>
                </div>

                <div className="p-4 flex-1">
                    <div className="space-y-1">
                        <Button variant="secondary" className="w-full justify-start">
                            <Folder className="mr-2 h-4 w-4" />
                            My Documents
                        </Button>
                        {/* Placeholder for dynamic folders */}
                        <div className="pt-4">
                            <h3 className="text-xs font-semibold text-muted-foreground px-4 mb-2 uppercase tracking-wider">
                                Folders
                            </h3>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                                <Folder className="mr-2 h-4 w-4" />
                                Work
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                                <Folder className="mr-2 h-4 w-4" />
                                Personal
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-primary hover:text-primary/80 mt-2">
                                <Plus className="mr-2 h-4 w-4" />
                                New Folder
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t">
                    <div className="bg-card p-3 rounded-lg border shadow-sm">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Storage Used</div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[15%]" />
                        </div>
                        <div className="flex justify-between text-[10px] mt-1 text-muted-foreground">
                            <span>15 MB</span>
                            <span>Unlimited</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 border-b flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="w-96">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search documents..."
                                className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ConnectWallet />
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
