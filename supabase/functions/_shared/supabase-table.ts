import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

interface SupabaseTableInterface {
    readonly supabase: SupabaseClient | undefined;
    getSupabase(): SupabaseClient | undefined;
}

export class DbSupabaseTable implements SupabaseTableInterface {
    readonly supabase: SupabaseClient | undefined;

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    getSupabase(): SupabaseClient {
        if (!this.supabase) {
            throw new Error("supabase is not initialized");
        }
        return this.supabase;
    }
}
