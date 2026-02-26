import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert Word to PDF Online | Free DOC/DOCX to PDF | PDFY AI',
    description: 'Quickly convert your Word documents (DOC or DOCX) to professional PDF files online for free while keeping the formatting.',
    alternates: {
        canonical: 'https://pdfyai.com/word-to-pdf',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
