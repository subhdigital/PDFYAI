"use client";
import PDFToolBase from "@/components/tools/PDFToolBase";
import { processPDFJob } from "@/lib/tool-utils";

export default function ToolPage() {
    return (
        <PDFToolBase
            title="PDF to Word"
            description="Convert PDF to editable Word documents with high accuracy."
            onProcess={(files) => processPDFJob("PDF_TO_WORD", files)}
            maxFiles={1}
        />
    );
}
