import type { NextApiRequest, NextApiResponse } from 'next';
import { createRoom } from '@deps/services/room';
import { Room } from '@deps/types';

interface CreateRoomResponse {
    success?: boolean;
    room?: Room;
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CreateRoomResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    try {
        const room = await createRoom();
        return res.status(200).json({ success: true, room });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An error occurred when creating the room.' });
    }
}
