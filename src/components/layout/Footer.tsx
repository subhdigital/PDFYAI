import Link from "next/link";
import { FileText, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-slate-950 border-t border-rose-100 dark:border-rose-900/20 pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="bg-rose-600 p-2 rounded-lg">
                                <FileText className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tighter">
                                PDFY<span className="text-rose-600">AI</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                            The ultimate all-in-one PDF tool powered by AI. Process your documents securely, fast, and with high precision.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:text-rose-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:text-rose-600 transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:text-rose-600 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Solutions</h4>
                        <ul className="space-y-3">
                            <li><Link href="/merge-pdf" className="text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors">Merge PDF</Link></li>
                            <li><Link href="/split-pdf" className="text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors">Split PDF</Link></li>
                            <li><Link href="/compress-pdf" className="text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors">Compress PDF</Link></li>
                            <li><Link href="/word-to-pdf" className="text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors">Word to PDF</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors">Blog</Link></li>
                            <li><Link href="/careers" className="text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link href="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookies" className="text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors">Cookies Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-rose-100 dark:border-rose-900/20 text-center text-slate-500 dark:text-slate-400 text-sm">
                    <p>© {new Date().getFullYear()} PDFY AI. All rights reserved. Made with ❤️ for document productivity.</p>
                </div>
            </div>
        </footer>
    );
}
