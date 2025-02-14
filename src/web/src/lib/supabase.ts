import {initClient} from "../../../shared/supabase.ts";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = initClient(supabaseUrl, supabaseKey);
