import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert PDF to Word Online | Secure & Free | PDFY AI',
    description: 'Easily convert your PDF documents into editable Word (DOCX) files online for free. Maintain formatting and layouts perfectly.',
    alternates: {
        canonical: 'https://pdfyai.com/pdf-to-word',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
