import { supabase } from '@deps/lib/supabase';

// Function to generate a random 6-digit alphanumeric string
export const generateJoinCode = (): string => Math.random().toString(36).substring(2, 8).toUpperCase();

// Recursive function to get a join code that has not been used in the last 24 hours
export const getJoinCode = async (): Promise<string> => {
    const join_code = generateJoinCode();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const { data: existingRooms } = await supabase.from('rooms').select('*').eq('join_code', join_code).gte('created_at', oneDayAgo);
    return existingRooms && existingRooms.length > 0 ? getJoinCode() : join_code;
};
