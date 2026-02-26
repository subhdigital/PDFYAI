import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Password Protect PDF Files Online | PDFY AI',
    description: 'Add a password and encrypt your PDF files securely online. Prevent unauthorized access to your important documents.',
    alternates: {
        canonical: 'https://pdfyai.com/protect-pdf',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
