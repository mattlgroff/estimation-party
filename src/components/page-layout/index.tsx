import React from 'react';
import Navbar from '@deps/components/navbar';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => (
    <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container mx-auto flex-grow px-4 pb-16 pt-8 sm:px-6 lg:px-8">{children}</div>
    </div>
);

export default PageLayout;
