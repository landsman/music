import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "./db.types.ts";

export function initClient(supabaseUrl: string, supabaseKey: string) {
  return createClient<Database>(supabaseUrl, supabaseKey);
}
