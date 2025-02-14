import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./db.types.ts";

export type { SupabaseClient }

export function initClient(supabaseUrl: string, supabaseKey: string) {
  return createClient<Database>(supabaseUrl, supabaseKey);
}
