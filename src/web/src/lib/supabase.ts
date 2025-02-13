import { createClient } from '@supabase/supabase-js'
import type { Database } from "../../../shared/db.types.ts";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
export type { Database };