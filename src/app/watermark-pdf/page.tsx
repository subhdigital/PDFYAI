"use client";
import PDFToolBase from "@/components/tools/PDFToolBase";
import { processPDFJob } from "@/lib/tool-utils";

export default function ToolPage() {
    return (
        <PDFToolBase
            title="Add Watermark"
            description="Stamp an image or text over your PDF."
            onProcess={(files) => processPDFJob("WATERMARK", files)}
            maxFiles={1}
        />
    );
}
