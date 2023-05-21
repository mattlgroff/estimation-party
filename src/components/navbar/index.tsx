// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => (
    <nav className="bg-blue-500 p-6">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
            <Link className="mr-6 flex flex-shrink-0 items-center text-white" href="/">
                <span className="text-xl font-semibold tracking-tight">Estimation Party 🎉</span>
            </Link>
        </div>
    </nav>
);

export default Navbar;
