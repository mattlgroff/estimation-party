import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@deps/lib/supabase';

interface LeaveRoomResponse {
    success?: boolean;
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<LeaveRoomResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const { name, room_id } = req.body;

    try {
        // Get the room details
        const { data: room, error: roomError } = await supabase.from('rooms').select('lead_name').eq('id', room_id);
        if (roomError) {
            throw roomError;
        }

        // Check if user is lead
        const isLead = room?.[0]?.lead_name === name;

        // Remove user
        const { error: deleteUserError } = await supabase.from('users').delete().eq('room_id', room_id).eq('name', name);
        if (deleteUserError) {
            throw deleteUserError;
        }

        // If user is lead, assign new lead to the user who joined earliest
        if (isLead) {
            const { data: users, error: usersError } = await supabase
                .from('users')
                .select('name')
                .order('inserted_at', { ascending: true })
                .eq('room_id', room_id)
                .limit(1);
            if (usersError) {
                throw usersError;
            }

            const newLeadName = users?.[0]?.name;

            const { error: updateLeadError } = await supabase.from('rooms').update({ lead_name: newLeadName }).eq('id', room_id);
            if (updateLeadError) {
                throw updateLeadError;
            }
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        if (error instanceof Error) {
            // Handle error
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An error occurred when leaving the room.' });
    }
}
