import type { NextApiRequest, NextApiResponse } from 'next';
import { getRoom, updateCurrentEstimation } from '@deps/services/room';
import { Room } from '@deps/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { room_id } = req.body;

    try {
        const room = (await getRoom(room_id)) as Room;

        if (!room.current_estimation_id) {
            return res.status(400).json({ error: 'No estimation in progress.' });
        }

        // Set current_estimation_id to null to indicate no estimation in progress
        await updateCurrentEstimation(room_id, null);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An error occurred when trying to stop the estimation.' });
    }
}
