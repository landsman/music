import { BaseTable } from "./db.ts";

export interface ArtistRow {
  created_at: string;
  name: string;
  lastfm_id: string | null;
}

export class ArtistTable extends BaseTable {
  async sync(
    artists: ArtistRow[],
  ): Promise<{ message?: string; error?: unknown }> {
    return await this.getSupabase()
      .from("artist")
      .upsert(artists, { onConflict: "name" }) // insert?
      .select();
  }

  async findIdByName(name: string): Promise<string | null> {
    const { data, error } = await this.getSupabase()
      .from("artist")
      .select("id")
      .eq("name", name)
      .limit(1)
      .maybeSingle<{ id: string } | null>();

    if (error) {
      console.error("Error fetching artist by name:", error);
      return null;
    }

    return data ? data.id : null;
  }
}
