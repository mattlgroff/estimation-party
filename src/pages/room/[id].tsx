import { useEffect, useRef, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { Estimation, Room, User, UserEstimation } from '@deps/types';
import Link from 'next/link';
import UserList from '@deps/components/user-list';
import LeadControls from '@deps/components/lead-controls';
import { getRoomByJoinCode } from '@deps/services/room';
import { getUsersByRoomId } from '@deps/services/user';
import { getEstimationsByRoomId, getUserEstimationsByEstimationIds } from '@deps/services/estimation';
import { getCookie } from 'cookies-next';
import { RoomState, useSupabaseSubscriptions } from '@deps/hooks/useSupabaseSubscriptions';
import Estimations from '@deps/components/estimations';

interface JoinCodePageProps {
    error?: string;
    initialName?: string;
    initialEstimations?: Estimation[];
    initialUserEstimations?: UserEstimation[];
    initialUsers?: User[];
    room?: Room;
}

const JoinCodePage = ({ room, initialName, initialUsers, initialEstimations, initialUserEstimations, error }: JoinCodePageProps) => {
    // Refs
    const nameInputRef = useRef<HTMLInputElement | null>(null);

    // State
    const [roomState, setRoomState] = useState<RoomState>({
        users: initialUsers || [],
        leadName: room?.lead_name || '',
        name: initialName || '',
        estimationInProgress: room?.current_estimation_id ? true : false,
        joinedRoom: initialName ? true : false,
        current_estimation_id: room?.current_estimation_id || null,
    });
    const [userEstimations, setUserEstimations] = useState<UserEstimation[]>(initialUserEstimations ? initialUserEstimations : []);
    const [estimations, setEstimations] = useState<Estimation[]>(initialEstimations ? initialEstimations : []);

    // Effects
    // Focus the name input field once it's rendered, if its rendered.
    useEffect(() => {
        if (nameInputRef.current && !roomState.joinedRoom) {
            nameInputRef.current.focus();
        }
    }, [roomState.joinedRoom]);

    // Subscribe to live updates from Supabase
    useSupabaseSubscriptions(room, roomState, setRoomState, setEstimations, setUserEstimations);

    // Handlers
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const name = new FormData(e.target).get('name');

        if (name?.length) {
            const res = await fetch('/api/join-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    room_id: room?.id,
                }),
            });

            const { success, user } = await res.json();

            if (success) {
                setRoomState(prevState => ({
                    ...prevState,
                    joinedRoom: true,
                    name: user.name,
                }));
            } else {
                alert('Sorry, there was an error joining the room. Please try again.');
            }
        } else {
            alert('Please enter your name.');
        }
    };

    if (error || !room) {
        return (
            <div className="flex flex-grow items-center justify-center text-center">
                <p className="text-2xl">{error}</p>
                <Link className="text-blue-600" href="/">
                    Go to Homepage
                </Link>
            </div>
        );
    }

    if (!roomState.joinedRoom) {
        return (
            <div className="flex flex-grow items-center justify-center py-2">
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
                                    ref={nameInputRef}
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
            </div>
        );
    }

    return (
        <div className="mx-2 my-4">
            <div className="my-4">
                {roomState.leadName === roomState.name && (
                    <LeadControls room={room} estimationInProgress={roomState.estimationInProgress} />
                )}
            </div>

            <div className="my-4 gap-4 lg:grid lg:grid-cols-3">
                <Estimations
                    estimationInProgress={roomState.estimationInProgress}
                    estimations={estimations}
                    user={roomState.users.find(user => user.name === roomState.name) as User}
                    userEstimations={userEstimations}
                    users={roomState.users}
                />

                <div className="lg:col-span-1">
                    <UserList
                        estimationInProgress={roomState.estimationInProgress}
                        estimations={estimations}
                        leadName={roomState.leadName}
                        name={roomState.name}
                        userEstimations={userEstimations}
                        users={roomState.users}
                    />
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps({ params, req, res }: GetServerSidePropsContext) {
    const join_code = (params?.id as string) || '';

    if (!join_code || typeof join_code !== 'string' || join_code.length !== 6) {
        return {
            props: {
                error: 'Sorry this join code is invalid',
            },
        };
    }

    const room = await getRoomByJoinCode(join_code);

    if (!room) {
        return {
            props: {
                error: "Sorry we couldn't find a room with that join code",
            },
        };
    }

    const initialUsers = await getUsersByRoomId(room.id);

    const initialEstimations = (await getEstimationsByRoomId(room.id)) || [];
    const estimationIds = initialEstimations.map(estimation => estimation.id);

    const initialUserEstimations = await getUserEstimationsByEstimationIds(estimationIds);

    // Get the cookie associating this user's name with this room, if it exists.
    const initialName = getCookie(`${room.id}-name`, { req, res }) || '';

    return {
        props: { room, initialUsers, initialEstimations, initialUserEstimations, initialName },
    };
}

export default JoinCodePage;
