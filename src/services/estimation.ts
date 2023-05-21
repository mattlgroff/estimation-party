import { supabase } from '@deps/lib/supabase';

export const createEstimation = async (room_id: number, ticket_name: string, ticket_href: string | null) => {
    const { data: estimation, error } = await supabase
        .from('estimations')
        .insert([{ ticket_name, ticket_href, room_id }])
        .select()
        .single();

    if (error) {
        throw error;
    }

    return estimation;
};

export const makeUserEstimate = async (user_id: string, estimation_id: string, estimate: string) => {
    const { data, error } = await supabase.from('user_estimations').upsert([{ user_id, estimation_id, estimate }]);

    if (error) {
        throw error;
    }

    return data;
};

export const getUserEstimationsByEstimationIds = async (estimationIds: number[]) => {
    // Fetch all user estimations for the given estimation ids
    const { data: userEstimations } = await supabase.from('user_estimations').select('*').in('estimation_id', estimationIds);

    return userEstimations || [];
};

export const getEstimationsByRoomId = async (room_id: string) => {
    const { data: estimations } = await supabase
        .from('estimations')
        .select('*')
        .eq('room_id', room_id)
        .order('inserted_at', { ascending: false });

    return estimations;
};
