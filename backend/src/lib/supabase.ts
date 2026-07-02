import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseSecretRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if(!supabaseUrl || !supabaseSecretRoleKey) {
  throw new Error('Supabase URL or Secret Key is not defined in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseSecretRoleKey);