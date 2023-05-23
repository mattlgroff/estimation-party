// components/PageLayout.tsx
import React from 'react';
import Navbar from '@deps/components/navbar';
import Link from 'next/link';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => (
    <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        <footer className="flex items-center justify-between bg-blue-500 px-4 py-2 text-white sm:px-6 lg:px-8">
            <p className="text-sm">
                &copy; {new Date().getFullYear()}
                <Link href="https://groff.dev/" className="ml-2 text-white hover:text-blue-200">
                    Matt Groff @ groff.dev
                </Link>
            </p>{' '}
            <p className="text-sm">
                <Link className="text-white hover:text-blue-200" href="https://github.com/mattlgroff/estimation-party">
                    MIT License - Github Repository
                </Link>
            </p>
        </footer>
    </div>
);

export default PageLayout;
