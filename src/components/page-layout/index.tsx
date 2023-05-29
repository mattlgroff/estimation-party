import React from 'react';
import Navbar from '@deps/components/navbar';
import Footer from '../footer';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => (
    <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container mx-auto flex-grow px-4 pb-32 pt-8 sm:px-6 lg:px-8">{children}</div>
        <Footer />
    </div>
);

export default PageLayout;
