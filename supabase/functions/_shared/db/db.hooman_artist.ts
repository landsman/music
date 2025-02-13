import { BaseTable } from "./db.ts";

export interface HoomanArtistRow {
  created_at: string;
  hooman_id: string;
  artist_id: string;
}

/**
 * pair table user <> artist
 */
export class HoomanArtistTable extends BaseTable {
  async pair(
    artists: HoomanArtistRow[],
  ): Promise<{ message?: string; error?: unknown }> {
    return await this.getSupabase()
      .from("hooman_artist")
      .upsert(artists, {
        onConflict: `"hooman_id","artist_id"`,
      })
      .select();
  }
}
