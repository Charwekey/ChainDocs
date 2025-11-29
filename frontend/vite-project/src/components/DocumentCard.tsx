import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image as ImageIcon, Download } from "lucide-react";

export const DocumentCard = ({ doc }: { doc: any }) => {
    const isImage = doc.mimeType.startsWith("image/");

    return (
        <Card className="overflow-hidden group hover:shadow-md transition-shadow">
            <div className="aspect-[3/4] bg-muted/30 relative flex items-center justify-center border-b">
                {isImage ? (
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                ) : (
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                )}
            </div>
            <CardContent className="p-3">
                <h3 className="font-medium text-sm truncate" title={doc.name}>{doc.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    {(doc.size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
            </CardContent>
            <CardFooter className="p-3 pt-0 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                    <Download className="mr-2 h-3 w-3" />
                    Download
                </Button>
            </CardFooter>
        </Card>
    );
};
