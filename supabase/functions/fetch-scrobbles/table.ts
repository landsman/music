import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const tableName = "listened";

export interface Row {
  created_at: string;
  listened_at: string;
  artist_name: string;
  track_name: string;
  album_name: string | null;
  lastfm_data: string | object;
}

const columnName: Row = {
  created_at: "created_at",
  listened_at: "listened_at",
  artist_name: "artist_name",
  track_name: "track_name",
  album_name: "album_name",
  lastfm_data: "lastfm_data",
};

export class TableListened {
  private readonly supabase: SupabaseClient | undefined;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Get the latest timestamp from the scrobbles table.
   * @returns The latest timestamp in Unix seconds or null.
   */
  async getLastListenedDate(): Promise<number | null> {
    if (!this.supabase) {
      throw new Error("supabase is not initialized");
    }

    const { data, error } = await this.supabase
      .from(tableName)
      .select(columnName.listened_at)
      .order(columnName.listened_at, { ascending: false })
      .limit(1)
      .maybeSingle<{ listened_at: string } | null>();

    if (error) {
      console.error("Error fetching latest timestamp:", error);
      return null;
    }

    return data
      ? Math.floor(new Date(data.listened_at).getTime() / 1000) + 5
      : null;
  }

  /**
   * Save new scrobbles to Supabase.
   * @param tracks - Array of new scrobbles to save.
   * @returns An object containing a message or error.
   */
  async save(tracks: Row[]): Promise<{ message?: string; error?: unknown }> {
    if (tracks.length === 0) {
      console.log("No new scrobbles to save.");
      return { message: "No new scrobbles" };
    }

    if (!this.supabase) {
      throw new Error("supabase is not initialized");
    }

    const { error } = await this.supabase.from(tableName).insert(tracks);

    if (error) {
      console.error("Error inserting data:", error);
      return { error };
    } else {
      return { message: `Saved ${tracks.length} new scrobbles` };
    }
  }
}
