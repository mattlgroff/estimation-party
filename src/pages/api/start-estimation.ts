import type { NextApiRequest, NextApiResponse } from 'next';
import { getRoom, updateCurrentEstimation } from '@deps/services/room';
import { createEstimation } from '@deps/services/estimation';
import { Room } from '@deps/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { room_id, ticket_name, ticket_href } = req.body;

    try {
        const room = (await getRoom(room_id)) as Room;

        if (room.current_estimation_id) {
            return res.status(400).json({ error: 'An estimation is already in progress.' });
        }

        const newEstimation = await createEstimation(room_id, ticket_name, ticket_href);

        await updateCurrentEstimation(room_id, newEstimation.id);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An error occurred when starting the estimation.' });
    }
}
