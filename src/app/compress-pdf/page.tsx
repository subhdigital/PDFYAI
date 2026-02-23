"use client";
import PDFToolBase from "@/components/tools/PDFToolBase";
import { processPDFJob } from "@/lib/tool-utils";

export default function ToolPage() {
    return (
        <PDFToolBase
            title="Compress PDF"
            description="Reduce file size while optimizing for maximal PDF quality."
            onProcess={(files) => processPDFJob("COMPRESS", files)}
            maxFiles={1}
        />
    );
}
