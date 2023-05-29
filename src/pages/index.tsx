import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
    const router = useRouter();

    // Refs
    const joinCodeInputRef = useRef<HTMLInputElement | null>(null);

    // State
    const [joinCode, setJoinCode] = useState('');
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);

    // Effects
    // Focus the name input field once it's rendered, if its rendered.
    useEffect(() => {
        if (joinCodeInputRef.current) {
            joinCodeInputRef.current.focus();
        }
    }, []);

    // Handlers
    const handleCreateRoom = async () => {
        setIsCreatingRoom(true);

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
        <>
            <Head>
                <title>Estimation Party</title>
            </Head>
            <main className="flex flex-grow flex-col items-center justify-center py-2 ">
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">It's an Estimation Party.</h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        A simple solution to Planning Poker. Create a room, invite your team, and start estimating. Rooms last for 24 hours.
                        No accounts, just use unique names.
                    </p>
                </div>

                <button
                    onClick={handleCreateRoom}
                    disabled={isCreatingRoom}
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                    {isCreatingRoom ? 'Creating...' : 'Create a new room'}
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
                    <button
                        type="submit"
                        disabled={!joinCode || joinCode.length !== 6}
                        className="mt-4 w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    >
                        Join a room
                    </button>
                </form>

                <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
                    <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
                    <div className="mx-auto max-w-2xl lg:max-w-4xl">
                        <h3 className="text-center text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                            Testimonials
                        </h3>
                        <hr className="mt-4 border-gray-200" />
                        <figure className="mt-10">
                            <blockquote className="text-center text-lg font-semibold leading-8 text-gray-900 sm:text-xl sm:leading-9">
                                <p>
                                    “My super talented friend and coworker, Matthew Groff, created this fun and practical tool for
                                    estimating development work! We used Estimation Party as a team today and will be incorporating it into
                                    our estimation meetings from now on.”
                                </p>
                            </blockquote>
                            <figcaption className="mt-10">
                                <img
                                    className="mx-auto h-10 w-10 rounded-full"
                                    src="https://media.licdn.com/dms/image/C5603AQHKFTl_yEb5hw/profile-displayphoto-shrink_100_100/0/1660155050233?e=1691020800&v=beta&t=KZNbc_iB1jPIcSS9lE2t7VUrikhHYgNKx4C4QSa7Vf4"
                                    alt=""
                                />
                                <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                                    <div className="font-semibold text-gray-900">Meagan Rowell</div>
                                    <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-gray-900">
                                        <circle cx={1} cy={1} r={1} />
                                    </svg>
                                    <div className="text-gray-600">Product Manager @ Umbrage</div>
                                </div>
                            </figcaption>
                        </figure>
                    </div>
                </section>

                <footer className="fixed bottom-0 flex w-full items-center justify-between bg-blue-500 px-4 py-2 text-white sm:px-6 lg:px-8">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()}
                        <Link href="https://groff.dev/" className="ml-2 text-white hover:text-blue-200">
                            Matt Groff @ groff.dev
                        </Link>
                    </p>{' '}
                    <p className="text-sm">
                        <Link href="https://github.com/mattlgroff/estimation-party" className="text-white hover:text-blue-200">
                            MIT License - Github Repository
                        </Link>
                    </p>
                </footer>
            </main>
        </>
    );
}
