import {createClient} from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if(!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Supabase URL or Publishable Key is not defined in environment variables');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
        flowType: 'pkce'
    }
});