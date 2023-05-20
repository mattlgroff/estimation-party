import { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { supabase } from '@deps/lib/supabase';
import { Room, User } from '@deps/types';
import Link from 'next/link';

interface JoinCodePageProps {
    room?: Room;
    initialUsers?: User[];
    error?: string;
}

const JoinCodePage = ({ room, initialUsers, error }: JoinCodePageProps) => {
    const [users] = useState(initialUsers || []);
    const [lead] = useState(room?.lead_name);
    const [name] = useState('');
    // const [estimationInProgress, setEstimationInProgress] = useState<Estimation | null>(null); // Mock state for now
    const [formValid, setFormValid] = useState(false); // State for form validation

    useEffect(() => {
        // Validation logic here. Update the formValid state accordingly.
        // For simplicity, we're just checking the name isn't empty.
        if (name.trim()) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    }, [name]);

    // useEffect(() => {
    //     if(!room) {
    //         return;
    //     }

    //     const subscription = supabase
    //         .from(`rooms:id=eq.${room.id}`)
    //         .on('*', payload => {
    //             setIsLead(payload.new.lead_name === name);
    //         })
    //         .subscribe();

    //     return () => {
    //         supabase.removeSubscription(subscription);
    //     };
    // }, [room, name]);

    // useEffect(() => {
    //     const subscription = supabase
    //         .from(`users:room_id=eq.${room.id}`)
    //         .on('*', () => fetchUsers())
    //         .subscribe();

    //     return () => {
    //         supabase.removeSubscription(subscription);
    //     };
    // }, [room]);

    if (error || !room) {
        return (
            <div className="text-center">
                <p className="text-2xl">{error}</p>
                <Link className="text-blue-600" href="/">
                    Go to Homepage
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!formValid) {
            return;
        }

        // Create API endpoint in Next.js, such as /api/join-room
        // Send a POST request to this endpoint with the name and room id as the payload.
        // The backend will handle joining the room and return the appropriate response.
        const res = await fetch('/api/join-room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                roomId: room.id,
            }),
        });

        const { success } = await res.json();

        if (success) {
            // handle success...
        } else {
            // handle error...
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome to the Estimation Party Room! Join Code: {room.join_code}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">Please enter your name</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Name"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                            Join Room
                        </button>
                    </div>
                </form>
            </div>

            {lead === name && <h2>You are the lead!</h2>}

            {/* Mocked estimation controls for lead */}
            {/* {lead === name && !estimationInProgress && <button onClick={() => setEstimationInProgress(true)}>Start New Estimation</button>}
            {lead === name && !!estimationInProgress && <button onClick={() => setEstimationInProgress(null)}>Reveal Estimations</button>} */}

            {/* Mocked list of users */}
            <div>
                {users.map(user => (
                    <div key={user.id}>
                        {user.name}
                        {/* {user.name} {user.hasEstimated && <span>Has estimated</span>} */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export async function getServerSideProps({ params }: GetServerSidePropsContext) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const join_code = (params?.id as string) || '';

    if (!join_code || typeof join_code !== 'string' || join_code.length !== 6) {
        return {
            props: {
                error: 'Sorry this join code is invalid',
            },
        };
    }

    // Get current time and time 24 hours ago
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const { data: rooms } = await supabase.from('rooms').select('*').eq('join_code', join_code).gte('created_at', oneDayAgo);

    if (!rooms || rooms.length === 0) {
        return {
            props: {
                error: "Sorry we couldn't find a room with that join code",
            },
        };
    }

    const room = rooms[0];

    const { data: users } = await supabase.from('users').select('*').eq('room_id', room.id);

    return {
        props: { room, initialUsers: users },
    };
}

export default JoinCodePage;
