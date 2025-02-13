import { createClient } from "@supabase/supabase-js";
import { Database } from "./db.types.ts";

export function initClient(supabaseUrl: string, supabaseKey: string) {
  return createClient<Database>(supabaseUrl, supabaseKey);
}
