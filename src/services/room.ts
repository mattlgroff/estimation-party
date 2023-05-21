import { supabase } from '@deps/lib/supabase';
import { Room } from '@deps/types';
import { getJoinCode } from '@deps/utils/join-code';

export const getRoomByJoinCode = async (join_code: string) => {
    // Get current time and time 24 hours ago
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const { data: rooms } = await supabase.from('rooms').select('*').eq('join_code', join_code).gte('created_at', oneDayAgo);

    return rooms ? rooms[0] : null;
};

export const getRoom = async (room_id: string) => {
    const { data: room, error } = await supabase.from('rooms').select('*').eq('id', room_id).single();

    if (error) {
        throw error;
    }

    return room;
};

export const createRoom = async (): Promise<Room> => {
    const join_code = await getJoinCode();
    const { data: rooms, error } = await supabase.from('rooms').insert([{ join_code }]).select();
    if (error) throw error;
    return rooms?.[0] as Room;
};

export const updateLeadName = async (room_id: string, name: string) => {
    const { error } = await supabase.from('rooms').update({ lead_name: name }).eq('id', room_id);

    if (error) {
        throw error;
    }
};

export const updateCurrentEstimation = async (room_id: string, estimation_id: number | null) => {
    const { error } = await supabase.from('rooms').update({ current_estimation_id: estimation_id }).eq('id', room_id);

    if (error) {
        throw error;
    }
};

export const checkIfUserIsLead = async (room_id: string, name: string): Promise<boolean> => {
    const { data: room, error } = await supabase.from('rooms').select('lead_name').eq('id', room_id);
    if (error) throw error;
    return room?.[0]?.lead_name === name;
};

export const assignNewLead = async (room_id: string): Promise<void> => {
    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('name')
        .order('inserted_at', { ascending: true })
        .eq('room_id', room_id)
        .limit(1);

    if (usersError) throw usersError;

    // Check if there are any other users in the room
    if (users && users.length > 0) {
        const newLeadName = users[0].name;
        const { error: updateLeadError } = await supabase.from('rooms').update({ lead_name: newLeadName }).eq('id', room_id);
        if (updateLeadError) throw updateLeadError;
    } else {
        // If no other users are in the room, set lead_name to null
        const { error: updateLeadError } = await supabase.from('rooms').update({ lead_name: null }).eq('id', room_id);
        if (updateLeadError) throw updateLeadError;
    }
};
