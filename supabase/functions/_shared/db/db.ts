import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface BaseTableInterface {
  tableName: string | undefined;
  getTableName(): string;
  setTableName(name: string): void;
  readonly supabase: SupabaseClient | undefined;
  getSupabase(): SupabaseClient | undefined;
}

/**
 * Make some order in the database table workflow.
 */
export abstract class BaseTable implements BaseTableInterface {
  tableName: string | undefined;
  readonly supabase: SupabaseClient | undefined;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  getSupabase(): SupabaseClient {
    if (!this.supabase) {
      throw new Error("supabase client is not initialized");
    }
    return this.supabase;
  }

  setTableName(name: string) {
    this.tableName = name;
  }

  getTableName(): string {
    if (!this.tableName) {
      throw new Error("tableName is not defined!");
    }
    return this.tableName;
  }
}
