import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./db.types.ts";

export type { SupabaseClient }

export function initClient(supabaseUrl: string, supabaseKey: string) {
  return createClient<Database>(supabaseUrl, supabaseKey);
}
