import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../../shared/db.types.ts";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase configuration:", {
  supabaseUrl: supabaseUrl ? "URL is set" : "URL is missing",
  supabaseKey: supabaseKey ? "Key is set" : "Key is missing",
});

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase URL or key is missing. Check your environment variables.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
export type { Database };
