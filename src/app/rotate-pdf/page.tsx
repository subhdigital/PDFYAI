"use client";
import PDFToolBase from "@/components/tools/PDFToolBase";
import { processPDFJob } from "@/lib/tool-utils";

export default function ToolPage() {
    return (
        <PDFToolBase
            title="Rotate PDF"
            description="Rotate your PDFs the way you need them."
            onProcess={(files) => processPDFJob("ROTATE", files)}
            maxFiles={1}
        />
    );
}
