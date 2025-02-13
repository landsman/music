import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../src/shared/db.ts";

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
