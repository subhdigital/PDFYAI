"use client";
import PDFToolBase from "@/components/tools/PDFToolBase";
import { processPDFJob } from "@/lib/tool-utils";

export default function ToolPage() {
    return (
        <PDFToolBase
            title="Split PDF"
            description="Separate one page or a whole set for easy conversion."
            onProcess={(files) => processPDFJob("SPLIT", files)}
            maxFiles={1}
        />
    );
}
