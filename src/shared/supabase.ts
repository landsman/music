import { createClient } from '@supabase/supabase-js'
import type { Database } from "./db.types.ts";

export function initClient(supabaseUrl: string, supabaseKey: string) {
  return createClient<Database>(supabaseUrl, supabaseKey);
}
