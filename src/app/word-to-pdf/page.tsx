"use client";

import PDFToolBase from "@/components/tools/PDFToolBase";
import { processPDFJob } from "@/lib/tool-utils";

export default function ToolPage() {
    return (
        <PDFToolBase
            title="WORD TO PDF"
            description="Convert Word documents to PDF files quickly and securely."
            accept={{
                "application/msword": [".doc"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
            }}
            onProcess={(files) => processPDFJob("WORD_TO_PDF", files)}
            maxFiles={1}
        />
    );
}
