// components/Navbar.tsx
import React from 'react';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
    const router = useRouter();

    function confirmBeforeLeavingRoom(e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) {
        if (router.pathname.includes('/room/')) {
            if (!window.confirm('Are you sure you want to leave the current estimation room?')) {
                e.preventDefault();
            }
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        confirmBeforeLeavingRoom(e);
    };

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        confirmBeforeLeavingRoom(e);
    };

    return (
        <nav className="bg-blue-500 p-6">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
                <a className="mr-6 flex flex-shrink-0 items-center text-white" href="/" onClick={handleClick} onKeyDown={handleOnKeyDown}>
                    <span className="text-xl font-semibold tracking-tight">Estimation Party 🎉</span>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
