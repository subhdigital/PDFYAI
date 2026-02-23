"use client";
import PDFToolBase from "@/components/tools/PDFToolBase";
import { processPDFJob } from "@/lib/tool-utils";

export default function ToolPage() {
    return (
        <PDFToolBase 
            title="Merge PDF" 
            description="Combine multiple PDFs into one document easily." 
            onProcess={(files) => processPDFJob("MERGE", files)} 
            maxFiles={20}
        />
    );
}
