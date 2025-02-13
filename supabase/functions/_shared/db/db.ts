import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

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
