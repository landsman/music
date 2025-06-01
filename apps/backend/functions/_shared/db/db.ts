import {
  createClient,
  SupabaseClient,
} from "jsr:@supabase/supabase-js@^2.48.1";
import { Database } from "../../../../../packages/shared/db.ts";

export function initClient(supabaseUrl: string, supabaseKey: string) {
  return createClient<Database>(supabaseUrl, supabaseKey);
}

export interface BaseTableInterface {
  readonly supabase: SupabaseClient | undefined;
  getSupabase(): SupabaseClient | undefined;
}

/**
 * Make some order in the database table workflow.
 */
export abstract class BaseTable implements BaseTableInterface {
  readonly supabase: SupabaseClient<Database> | undefined;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  getSupabase(): SupabaseClient<Database> {
    if (!this.supabase) {
      throw new Error("supabase client is not initialized");
    }
    return this.supabase;
  }
}
