"use client";

import Link from "next/link";
import { FileText, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tools = [
    { name: "Merge PDF", href: "/merge-pdf" },
    { name: "Split PDF", href: "/split-pdf" },
    { name: "Compress PDF", href: "/compress-pdf" },
    { name: "Word to PDF", href: "/word-to-pdf" },
    { name: "PDF to JPG", href: "/pdf-to-jpg" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 glass border-b border-rose-100 dark:border-rose-900/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="bg-rose-600 p-2 rounded-lg">
                                <FileText className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold italic tracking-tighter">
                                PDFY<span className="text-rose-600">AI</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <div className="relative group">
                            <button
                                onMouseEnter={() => setIsToolsOpen(true)}
                                className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors font-medium"
                            >
                                <span>PDF Tools</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                                {isToolsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        onMouseLeave={() => setIsToolsOpen(false)}
                                        className="absolute top-full left-0 mt-2 w-56 glass rounded-2xl shadow-2xl p-4 grid grid-cols-1 gap-2"
                                    >
                                        {tools.map((tool) => (
                                            <Link
                                                key={tool.name}
                                                href={tool.href}
                                                className="px-4 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-all font-medium"
                                            >
                                                {tool.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors font-medium">Login</Link>
                        <Link href="/signup" className="btn-primary py-2 px-5">Sign Up</Link>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden glass overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {tools.map((tool) => (
                                <Link
                                    key={tool.name}
                                    href={tool.href}
                                    className="block px-4 py-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-600 transition-all"
                                >
                                    {tool.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-rose-100 dark:border-rose-900/20 flex flex-col space-y-4">
                                <Link href="/login" className="text-center py-3 font-medium">Login</Link>
                                <Link href="/signup" className="btn-primary justify-center">Sign Up</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
