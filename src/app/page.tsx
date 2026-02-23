"use client";

import Link from "next/link";
import {
  Combine,
  Scissors,
  Minimize2,
  FileText,
  FileImage,
  RefreshCw,
  Type,
  Lock,
  Unlock,
  Eye,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs into one document easily.",
    icon: Combine,
    href: "/merge-pdf",
    color: "bg-blue-500"
  },
  {
    name: "Split PDF",
    description: "Separate one page or a whole set for easy conversion.",
    icon: Scissors,
    href: "/split-pdf",
    color: "bg-green-500"
  },
  {
    name: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: Minimize2,
    href: "/compress-pdf",
    color: "bg-red-500"
  },
  {
    name: "PDF to Word",
    description: "Convert PDF to editable Word documents with high accuracy.",
    icon: FileText,
    href: "/pdf-to-word",
    color: "bg-blue-600"
  },
  {
    name: "Word to PDF",
    description: "Make DOC and DOCX files easy to read with PDF conversion.",
    icon: FileText,
    href: "/word-to-pdf",
    color: "bg-indigo-600"
  },
  {
    name: "PDF to JPG",
    description: "Extract all images within a PDF or convert each page to JPG.",
    icon: FileImage,
    href: "/pdf-to-jpg",
    color: "bg-orange-500"
  },
  {
    name: "Rotate PDF",
    description: "Rotate your PDFs the way you need them. Even multiple PDFs!",
    icon: RefreshCw,
    href: "/rotate-pdf",
    color: "bg-purple-500"
  },
  {
    name: "Add Watermark",
    description: "Stamp an image or text over your PDF in seconds.",
    icon: Type,
    href: "/watermark-pdf",
    color: "bg-pink-500"
  },
  {
    name: "Protect PDF",
    description: "Encrypt your PDF with a password for secure access.",
    icon: Lock,
    href: "/protect-pdf",
    color: "bg-slate-700"
  },
  {
    name: "Unlock PDF",
    description: "Remove PDF password security to use your files freely.",
    icon: Unlock,
    href: "/unlock-pdf",
    color: "bg-amber-500"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-7xl h-full opacity-20 dark:opacity-10 blur-3xl pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-rose-400 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-400 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Powerful PDF Tools <br />
              <span className="text-rose-600">Simplified by AI</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
              The easiest way to merge, split, compress, and convert your PDF documents. 100% secure, fast, and free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#tools" className="btn-primary text-lg px-8 py-4">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Every tool you need to work with PDFs</h2>
            <p className="text-slate-500 dark:text-slate-400">Choose from our wide range of professional tools below</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link
                  href={tool.href}
                  className="group block p-6 h-full glass hover:scale-105 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 rounded-3xl"
                >
                  <div className={`${tool.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-inherit/20`}>
                    <tool.icon className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-rose-600 text-rose-600 transition-colors">{tool.name}</h3>
                  <p className="text-black dark:text-black text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why professionals choose PDFY AI?</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-xl h-fit">
                    <Eye className="text-rose-600 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Privacy First</h4>
                    <p className="text-slate-500 dark:text-slate-400">All your files are automatically deleted after 24 hours. We never look at your data.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-xl h-fit">
                    <FileText className="text-rose-600 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">High Precision</h4>
                    <p className="text-slate-500 dark:text-slate-400">Powered by advanced algorithms to maintain formatting and quality during conversion.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-rose-600/10 rounded-3xl flex items-center justify-center border-2 border-rose-200 dark:border-rose-900/20">
                {/* Mockup or Image */}
                <span className="text-rose-600 font-bold opacity-30 italic">PDFY AI EXPERIENCE</span>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 glass rounded-3xl shadow-2xl p-6 hidden sm:block">
                <div className="w-12 h-12 bg-green-500 rounded-xl mb-4" />
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-2" />
                <div className="w-2/3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
