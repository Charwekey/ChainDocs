import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, File as FileIcon, Loader2, X } from "lucide-react";
import { useChainDocs } from "@/hooks/useChainDocs";

export const UploadModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const { uploadDocument, vaultId } = useChainDocs();

    // Simple drag and drop implementation if react-dropzone is not available
    // For now, we'll assume standard input type="file" as fallback or implement a simple div wrapper
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setName(selectedFile.name);
        }
    };

    const handleUpload = async () => {
        if (!file || !vaultId) return;

        setIsUploading(true);
        try {
            await uploadDocument(file, name, description);
            setIsOpen(false);
            setFile(null);
            setName("");
            setDescription("");
            // Show success toast
        } catch (error) {
            console.error("Upload failed:", error);
            // Show error toast
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Document
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload to Blockchain</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {!file ? (
                        <div
                            className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative"
                        >
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Upload className="h-8 w-8" />
                                <p className="text-sm font-medium">Drag & drop or click to select</p>
                                <p className="text-xs">PDF, JPG, PNG (Max 4MB)</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20 relative">
                            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                                <FileIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="name">Document Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Contract.pdf" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." />
                    </div>
                </div>

                <Button onClick={handleUpload} disabled={!file || isUploading || !vaultId} className="w-full">
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Encrypting & Uploading...
                        </>
                    ) : (
                        "Upload to Blockchain"
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    );
};
