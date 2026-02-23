"use client";

import { useState } from "react";
import PDFToolBase from "@/components/tools/PDFToolBase";
import { processPDFJob } from "@/lib/tool-utils";

export default function ToolPage() {
    const [password, setPassword] = useState("");

    const handleProcess = async (files: File[]) => {
        if (!password) {
            throw new Error("Please enter the password to unlock the document.");
        }
        return processPDFJob("UNLOCK", files, { password });
    };

    return (
        <PDFToolBase
            title="UNLOCK PDF"
            description="Remove PDF password security, granting you the freedom to use your PDFs as you want."
            onProcess={handleProcess}
            maxFiles={1}
        >
            <div className="flex flex-col items-center gap-4 py-4 w-full max-w-sm mx-auto">
                <div className="w-full">
                    <label className="block text-sm font-medium text-black dark:text-black mb-1 text-left">
                        Document Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow"
                        placeholder="Enter the document password"
                        required
                    />
                </div>
            </div>
        </PDFToolBase>
    );
}
