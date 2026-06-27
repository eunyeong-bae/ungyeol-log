import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseSecretKey = process.env.SUPABASE_ANON_KEY as string;

if(!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Supabase URL or Secret Key is not defined in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseSecretKey);