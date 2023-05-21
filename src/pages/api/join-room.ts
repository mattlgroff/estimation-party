import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@deps/types';
import { checkIfUserExists, insertNewUser } from '@deps/services/user';
import { getRoom, updateLeadName } from '@deps/services/room';
import { setCookie } from 'cookies-next';

interface JoinRoomResponse {
    success?: boolean;
    user?: User;
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
        let existingUser = await checkIfUserExists(room_id, name);

        // If user does not exist, create a new one
        if (!existingUser) {
            await insertNewUser(room_id, name);
            existingUser = await checkIfUserExists(room_id, name);
        }

        // Get room for purposes of checking if user is lead
        const room = await getRoom(room_id);

        const is_lead = room?.lead_name === name;

        // If there is no lead, make this user the lead as they are the first to join.
        if (!is_lead && !room?.lead_name) {
            await updateLeadName(room_id, name);
        }

        if (!existingUser) {
            throw new Error('User does not exist and was not created.');
        }

        // Set the cookie associating this user's name with this room
        setCookie(`${room_id}-name`, existingUser.name, { req, res, maxAge: 60 * 60 * 24 });

        return res.status(200).json({ success: true, is_lead, user: existingUser });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An error occurred when joining the room.' });
    }
}
