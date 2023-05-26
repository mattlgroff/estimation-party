import { useEffect, useState } from 'react';
import { getUserEstimationsForRoomId, supabase as supabaseClient } from '@deps/lib/supabase-client';
import type { Estimation, Room, User, UserEstimation } from '@deps/types';

export interface RoomState {
    users: User[];
    leadName: string;
    name: string;
    estimationInProgress: boolean;
    joinedRoom: boolean;
    current_estimation_id: number | null;
}

export const useSupabaseSubscriptions = (
    room: Room | undefined,
    roomState: RoomState,
    setRoomState: React.Dispatch<React.SetStateAction<RoomState>>,
    setEstimations: React.Dispatch<React.SetStateAction<Estimation[]>>,
    setUserEstimations: React.Dispatch<React.SetStateAction<UserEstimation[]>>
): void => {
    const [currentEstimationId, setCurrentEstimationId] = useState<number | null>(room?.current_estimation_id || null);
    const estimationsMap = new Map();

    useEffect(() => {
        if (!room) return;

        // User Added
        const userAddedChannel = supabaseClient
            .channel('realtime users add')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'users',
                    filter: `room_id=eq.${room.id}`,
                },
                payload => {
                    const newUser = payload.new as User;

                    setRoomState(prevState => ({
                        ...prevState,
                        users: [...prevState.users, newUser],
                    }));
                }
            )
            .subscribe();

        // Room Updated
        const roomUpdatedChannel = supabaseClient
            .channel('realtime rooms update')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'rooms',
                    filter: `id=eq.${room.id}`,
                },
                async payload => {
                    const newRoom = payload.new as Room;

                    setRoomState(prevState => ({
                        ...prevState,
                        estimationInProgress: !!newRoom.current_estimation_id,
                        leadName: newRoom.lead_name || '',
                    }));

                    setCurrentEstimationId(newRoom.current_estimation_id);

                    // This makes sure everyone in the room has all of the past estimations guaranteed.
                    const fetchedUserEstimations = await getUserEstimationsForRoomId(room.id);
                    setUserEstimations(fetchedUserEstimations as UserEstimation[]);
                }
            )
            .subscribe();

        // Estimation Insert
        const estimationInsertChannel = supabaseClient
            .channel('realtime estimations insert')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'estimations',
                    filter: `room_id=eq.${room.id}`,
                },
                payload => {
                    const newEstimation = payload.new as Estimation;

                    setEstimations(prevState => [newEstimation, ...prevState]);
                }
            )
            .subscribe();

        // Cleanup function to remove the subscriptions when the component unmounts
        return () => {
            supabaseClient.removeChannel(userAddedChannel);
            supabaseClient.removeChannel(roomUpdatedChannel);
            supabaseClient.removeChannel(estimationInsertChannel);
        };
    }, [room]);

    useEffect(() => {
        if (!currentEstimationId) return;

        // User Estimation Insert (Someone is making a brand new Estimate)
        const userEstimatesInsertChannel = supabaseClient
            .channel('realtime user_estimations insert')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'user_estimations',
                    filter: `estimation_id=eq.${currentEstimationId}`,
                },
                payload => {
                    const newUserEstimation = payload.new as UserEstimation;
                    estimationsMap.set(newUserEstimation.user_id + newUserEstimation.estimation_id, newUserEstimation);

                    setUserEstimations([...estimationsMap.values()]);
                }
            )
            .subscribe();

        // User Estimation Update (Someone is updating their existing Estimate)
        const userEstimatesUpdateChannel = supabaseClient
            .channel('realtime user_estimations update')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'user_estimations',
                    filter: `estimation_id=eq.${currentEstimationId}`,
                },
                payload => {
                    const updatedUserEstimation = payload.new as UserEstimation;
                    estimationsMap.set(updatedUserEstimation.user_id + updatedUserEstimation.estimation_id, updatedUserEstimation);

                    setUserEstimations([...estimationsMap.values()]);
                }
            )
            .subscribe();

        // Cleanup function to remove the subscriptions when the component unmounts
        return () => {
            supabaseClient.removeChannel(userEstimatesInsertChannel);
            supabaseClient.removeChannel(userEstimatesUpdateChannel);
        };
    }, [currentEstimationId]);
};
