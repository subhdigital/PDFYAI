import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Merge PDF Files Online for Free | PDFY AI',
    description: 'Combine multiple PDFs into one document easily and securely. Our free PDF merger is fast, reliable, and requires no registration.',
    alternates: {
        canonical: 'https://pdfyai.com/merge-pdf',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
