import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert JPG to PDF Online for Free | PDFY AI',
    description: 'Easily convert your JPG and JPEG images into a single PDF document. Free, fast, and secure image to PDF converter.',
    alternates: {
        canonical: 'https://pdfyai.com/jpg-to-pdf',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
