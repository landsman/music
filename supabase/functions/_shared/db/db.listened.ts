import { BaseTable } from "./db.ts";

export interface ListenedRow {
  created_at: string;
  listened_at: string;
  artist_name: string;
  track_name: string;
  album_name: string | null;
  hooman_id: string | null;
  lastfm_id: string | null;
}

const columnName: ListenedRow = {
  created_at: "created_at",
  listened_at: "listened_at",
  artist_name: "artist_name",
  track_name: "track_name",
  album_name: "album_name",
  hooman_id: "hooman_id",
  lastfm_id: "lastfm_id",
};

export class ListenedTable extends BaseTable {
  /**
   * Get the latest timestamp from the scrobbles table.
   * @returns The latest timestamp in Unix seconds or null.
   */
  async getLastListenedDate(hoomanId: string): Promise<number | null> {
    const { data, error } = await this.getSupabase()
      .from("listened")
      .select(columnName.listened_at)
      .eq(columnName.hooman_id!, hoomanId)
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
  async save(
    tracks: ListenedRow[],
  ): Promise<{ message?: string; error?: unknown }> {
    if (tracks.length === 0) {
      console.log("No new scrobbles to save.");
      return { message: "No new scrobbles" };
    }

    const { error } = await this.getSupabase()
      .from("listened")
      .insert(tracks);

    if (error) {
      console.error("Error inserting data:", error);
      return { error };
    } else {
      return { message: `Saved ${tracks.length} new scrobbles` };
    }
  }
}
