import { BaseTable } from "./db.ts";

export interface HoomanArtistRow {
    created_at: string;
    hooman_id: string;
    artist_id: string;
}

const columnName: HoomanArtistRow = {
    created_at: "created_at",
    hooman_id: "hooman_id",
    artist_id: "artist_id",
};

/**
 * pair table user <> artist
 */
export class HoomanArtistTable extends BaseTable {
    override tableName = "hooman_artist";

    async pair(
        artists: HoomanArtistRow[],
    ): Promise<{ message?: string; error?: unknown }> {
        return await this.getSupabase()
            .from(this.tableName)
            .upsert(artists, { onConflict: columnName.artist_id })
            .select();
    }
}
