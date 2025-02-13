import {getSupabase} from "../../../src/shared/get-supabase.ts";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = getSupabase(supabaseUrl, supabaseKey);
