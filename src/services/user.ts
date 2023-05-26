import { supabase } from '@deps/lib/supabase';
import { User } from '@deps/types';

export const getUsersByRoomId = async (room_id: number) => {
    const { data: users } = await supabase.from('users').select('*').eq('room_id', room_id);

    return users;
};

export const checkIfUserExists = async (room_id: string, name: string): Promise<User | null> => {
    const { data: existingUsers, error } = await supabase
        .from('users')
        .select('*') // select all fields required for a User
        .eq('room_id', room_id)
        .eq('name', name);

    if (error) {
        throw error;
    }

    // If users array is not empty, return the first user
    if (existingUsers && existingUsers.length > 0) {
        return existingUsers[0] as User;
    }

    // Else, return null
    return null;
};

export const insertNewUser = async (room_id: string, name: string) => {
    const { error } = await supabase.from('users').insert([{ name, room_id }]);

    if (error) {
        throw error;
    }
};
