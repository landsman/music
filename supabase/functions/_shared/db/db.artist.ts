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
      .upsert(artists, { onConflict: "name" });
  }

  async findIdsByNames(names: string[]): Promise<Map<string, string>> {
    const { data, error } = await this.getSupabase()
      .from("artist")
      .select("id, name")
      .in("name", names);

    if (error || !data) {
      console.error("Error fetching artists by names:", error);
      return new Map();
    }

    return new Map(
      data.flatMap((r) => r.id ? [[r.name, r.id] as [string, string]] : []),
    );
  }
}
