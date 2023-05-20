import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@deps/lib/supabase';

interface JoinRoomResponse {
    success?: boolean;
    error?: string;
    is_lead?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<JoinRoomResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const { name, room_id } = req.body;

    try {
        // Check if user already exists
        const { data: existingUser, error: existingUserError } = await supabase
            .from('users')
            .select('name')
            .eq('room_id', room_id)
            .eq('name', name);

        if (existingUserError) {
            throw existingUserError;
        }

        // If user does not exist, create a new one
        if (!existingUser?.length) {
            const { error: insertError } = await supabase.from('users').insert([{ name, room_id }]);

            if (insertError) {
                throw insertError;
            }
        }

        const { data: room, error: roomError } = await supabase.from('rooms').select('lead_name').eq('id', room_id);

        if (roomError) {
            throw roomError;
        }

        const is_lead = room?.[0]?.lead_name === name;

        return res.status(200).json({ success: true, is_lead });
    } catch (error) {
        if (error instanceof Error) {
            // Handle error
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An error occurred when joining the room.' });
    }
}
