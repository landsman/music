import { BaseTable } from "./db.ts";

export interface ArtistRow {
  created_at: string;
  name: string;
  lastfm_data: null | string | object;
}

const columnName: ArtistRow = {
  created_at: "created_at",
  name: "name",
  lastfm_data: "lastfm_data",
};

export class ArtistTable extends BaseTable {
  override tableName = "artist";

  async sync(
    artists: ArtistRow[],
  ): Promise<{ message?: string; error?: unknown }> {
    return await this.getSupabase()
      .from(this.tableName)
      .upsert(artists, { onConflict: columnName.name }) // insert?
      .select();
  }

  async findIdByName(name: string): Promise<string | null> {
    const { data, error } = await this.getSupabase()
      .from(this.tableName)
      .select("id")
      .eq(columnName.name, name)
      .limit(1)
      .maybeSingle<{ id: string } | null>();

    if (error) {
      console.error("Error fetching artist by name:", error);
      return null;
    }

    return data ? data.id : null;
  }
}
