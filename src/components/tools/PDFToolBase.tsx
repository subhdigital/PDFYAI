"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PDFToolBaseProps {
    title: string;
    description: string;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    onProcess: (files: File[]) => Promise<string>; // Returns download URL
    children?: React.ReactNode | ((files: File[]) => React.ReactNode);
}

export default function PDFToolBase({
    title,
    description,
    accept = { "application/pdf": [".pdf"] },
    maxFiles = 1,
    onProcess,
    children
}: PDFToolBaseProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles].slice(0, maxFiles));
        setStatus("idle");
        setDownloadUrl(null);
        setError(null);
    }, [maxFiles]);

    const onDropRejected = useCallback(() => {
        setError("Invalid file type uploaded. Please upload a valid document.");
        setStatus("error");
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        accept,
        maxFiles
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        if (files.length <= 1) {
            setStatus("idle");
        }
    };

    const handleProcess = async () => {
        if (files.length === 0) return;

        try {
            setStatus("processing");
            const url = await onProcess(files);
            setDownloadUrl(url);
            setStatus("completed");
        } catch (err: any) {
            setError(err.message || "Something went wrong during processing.");
            setStatus("error");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">{description}</p>
            </div>

            <div className="glass rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                {status === "completed" && downloadUrl ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center py-12"
                    >
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6">
                            <CheckCircle className="text-green-600 w-16 h-16" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Process Completed!</h2>
                        <p className="text-slate-500 mb-8">Your file is ready for download.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={downloadUrl}
                                download
                                className="btn-primary"
                            >
                                Download Compiled File
                            </a>
                            <button
                                onClick={() => {
                                    setFiles([]);
                                    setStatus("idle");
                                    setDownloadUrl(null);
                                }}
                                className="px-6 py-3 rounded-xl border border-rose-200 dark:border-rose-900/20 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
                            >
                                Process Another
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <div
                            {...getRootProps()}
                            className={`
                relative border-3 border-dashed rounded-[1.5rem] p-12 transition-all duration-300
                flex flex-col items-center justify-center text-center cursor-pointer
                ${isDragActive ? "border-rose-600 bg-rose-50 dark:bg-rose-900/10" : "border-slate-200 dark:border-slate-800 hover:border-rose-400"}
              `}
                        >
                            <input {...getInputProps()} />
                            <div className="bg-rose-600/10 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="text-rose-600 w-8 h-8" />
                            </div>
                            <p className="text-lg font-bold mb-2">
                                {isDragActive ? "Drop the files here" : "Drag & drop files here"}
                            </p>
                            <p className="text-slate-500">or click to browse from your computer</p>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-8 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <AnimatePresence>
                                        {files.map((file, idx) => (
                                            <motion.div
                                                key={`${file.name}-${idx}`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="relative group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-3"
                                            >
                                                <File className="text-rose-600 w-8 h-8 flex-shrink-0" />
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold truncate">{file.name}</p>
                                                    <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(idx);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-slate-900 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {typeof children === 'function' ? children(files) : children}

                                <div className="flex justify-center pt-8 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={handleProcess}
                                        disabled={status === "processing"}
                                        className="btn-primary w-full sm:w-auto min-w-[200px] justify-center"
                                    >
                                        {status === "processing" ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>Process Document</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {status === "error" && error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
