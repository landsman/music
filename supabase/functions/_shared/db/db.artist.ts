import {BaseTable} from "./db.ts";

export interface ArtistRow {
    created_at: string;
    name: string;
    lastfm_data: null|string|object;
}

const columnName: ArtistRow = {
    created_at: "created_at",
    name: "name",
    lastfm_data: "lastfm_data",
};

export class ArtistTable extends BaseTable {
    override tableName = "artist";

    async sync(artists: ArtistRow[]): Promise<{ message?: string, error?: unknown }> {
        return await this.getSupabase()
            .from(this.tableName)
            .upsert(artists, { onConflict: columnName.name })
            .select()
    }
}