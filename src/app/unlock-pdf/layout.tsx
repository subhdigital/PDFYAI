import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Remove Password from PDF Online | PDFY AI',
    description: 'Instantly unlock your PDF files by removing passwords and restrictions. Fast, free, and secure online PDF unlocker.',
    alternates: {
        canonical: 'https://pdfyai.com/unlock-pdf',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
