import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@deps/lib/supabase';
import { Room } from '@deps/types';

interface CreateRoomResponse {
    success?: boolean;
    room?: Room;
    error?: string;
}

// Function to generate a random 6-digit alphanumeric string
const generateJoinCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Recursive function to get a join code that has not been used in the last 24 hours
const getJoinCode = async (): Promise<string> => {
    const join_code = generateJoinCode();

    // Get current time and time 24 hours ago
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Check if the join code has been used in the last 24 hours
    const { data: existingRooms } = await supabase.from('rooms').select('*').eq('join_code', join_code).gte('created_at', oneDayAgo);

    if (existingRooms && existingRooms.length > 0) {
        // If join code has been used, generate a new one
        return getJoinCode();
    } else {
        // If join code has not been used, return it
        return join_code;
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<CreateRoomResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    try {
        const join_code = await getJoinCode();

        // Create a new room
        const { data: rooms, error: roomError } = await supabase.from('rooms').insert([{ join_code }]).select();

        if (roomError) {
            throw roomError;
        }

        return res.status(200).json({ success: true, room: rooms?.[0] as Room });
    } catch (error) {
        if (error instanceof Error) {
            // Handle error
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An error occurred when creating the room.' });
    }
}
