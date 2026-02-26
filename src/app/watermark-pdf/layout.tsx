import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add Watermark to PDF | Stamp Documents Online | PDFY AI',
    description: 'Add text or image watermarks to your PDF files online. Secure, fast, and completely free.',
    alternates: {
        canonical: 'https://pdfyai.com/watermark-pdf',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
