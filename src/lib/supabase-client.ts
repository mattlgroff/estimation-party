import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_APP_SUPABASE_URL;
const SUPABASE_READONLY_KEY = process.env.NEXT_APP_SUPABASE_READONLY_KEY;

if (!SUPABASE_URL || !SUPABASE_READONLY_KEY) {
    throw new Error('Missing Supabase URL or readonly key');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_READONLY_KEY);
