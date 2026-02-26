import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Rotate PDF Pages Online | Free & Fast | PDFY AI',
    description: 'Rotate your PDF pages horizontally or vertically online for free. Adjust page orientation in seconds.',
    alternates: {
        canonical: 'https://pdfyai.com/rotate-pdf',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
