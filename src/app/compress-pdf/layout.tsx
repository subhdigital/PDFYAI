import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Compress PDF Files Online for Free | PDFY AI',
    description: 'Reduce PDF file size without losing quality. Our free PDF compressor makes it easy to make PDFs smaller for easier sharing.',
    alternates: {
        canonical: 'https://pdfyai.com/compress-pdf',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
