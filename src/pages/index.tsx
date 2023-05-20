import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const [joinCode, setJoinCode] = useState('');

    const handleCreateRoom = async () => {
        const res = await fetch('/api/create-room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lead_name: 'Your Lead Name' }), // You may want to handle lead_name differently
        });

        const data = await res.json();

        console.log('data', data);

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
        <main className="flex min-h-screen flex-col items-center justify-center py-2">
            <h1 className="mb-8 text-4xl font-bold">Estimation Party</h1>

            <button onClick={handleCreateRoom} className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                Create a new room
            </button>

            <form onSubmit={handleJoinRoom} className="mt-8">
                <input
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
