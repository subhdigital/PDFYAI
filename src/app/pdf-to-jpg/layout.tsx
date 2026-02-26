import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert PDF to JPG Images Online | PDFY AI',
    description: 'Extract images from your PDF or convert each page to a high-quality JPG image for free online.',
    alternates: {
        canonical: 'https://pdfyai.com/pdf-to-jpg',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
