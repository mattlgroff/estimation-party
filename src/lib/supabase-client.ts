import { Estimation } from '@deps/types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_APP_SUPABASE_URL;
const SUPABASE_READONLY_KEY = process.env.NEXT_APP_SUPABASE_READONLY_KEY;

if (!SUPABASE_URL || !SUPABASE_READONLY_KEY) {
    throw new Error('Missing Supabase URL or readonly key');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_READONLY_KEY);

// Special case for a client side call
export const getEstimationsByRoomId = async (room_id: number) => {
    const { data: estimations } = await supabase
        .from('estimations')
        .select('*')
        .eq('room_id', room_id)
        .order('inserted_at', { ascending: false });

    return estimations;
};

export const getUserEstimationsForRoomId = async (room_id: number) => {
    const estimations = (await getEstimationsByRoomId(room_id)) as Estimation[];
    const estimationIds = estimations.map(estimation => estimation.id);

    // Fetch all user estimations for the given estimation ids
    const { data: userEstimations } = await supabase.from('user_estimations').select('*').in('estimation_id', estimationIds);

    return userEstimations || [];
};
