import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    // Refs
    const joinCodeInputRef = useRef<HTMLInputElement | null>(null);

    // State
    const [joinCode, setJoinCode] = useState('');

    // Effects
    // Focus the name input field once it's rendered, if its rendered.
    useEffect(() => {
        if (joinCodeInputRef.current) {
            joinCodeInputRef.current.focus();
        }
    }, []);

    // Handlers
    const handleCreateRoom = async () => {
        const res = await fetch('/api/create-room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lead_name: 'Your Lead Name' }), // You may want to handle lead_name differently
        });

        const data = await res.json();

        if (data.success) {
            router.push(`/room/${data.room.join_code}`);
        } else {
            // Handle error
            console.error(data.error);
        }
    };

    const handleJoinRoom = (event: any) => {
        event.preventDefault();
        router.push(`/room/${joinCode.toUpperCase()}`);
    };

    return (
        <main className="flex flex-grow flex-col items-center justify-center py-2">
            <div className="mb-6 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">It's an Estimation Party.</h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    A simple solution to Planning Poker. Create a room, invite your team, and start estimating. Rooms last for 24 hours. No
                    accounts, just use unique names.
                </p>
            </div>

            <button onClick={handleCreateRoom} className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                Create a new room
            </button>

            <form onSubmit={handleJoinRoom} className="mt-8">
                <input
                    id="join-code"
                    ref={joinCodeInputRef}
                    type="text"
                    value={joinCode}
                    onChange={event => setJoinCode(event.target.value)}
                    maxLength={6}
                    placeholder="Enter join code"
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                />
                <button type="submit" className="mt-4 w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                    Join a room
                </button>
            </form>
        </main>
    );
}
