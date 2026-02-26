import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'OCR PDF to Text - Extract Text from Scanned PDFs | PDFY AI',
    description: 'Easily extract selectable and searchable text from scanned PDFs or images using our advanced OCR engine online.',
    alternates: {
        canonical: 'https://pdfyai.com/ocr',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
