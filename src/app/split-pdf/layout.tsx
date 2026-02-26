import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Split PDF Files Online | Extract Pages | PDFY AI',
    description: 'Separate one PDF into multiple files, or extract specific pages to a new PDF document. Fast, easy, and free.',
    alternates: {
        canonical: 'https://pdfyai.com/split-pdf',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
