import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface ScrobbleRow {
    track: string;
    artist: string;
    album: string | null;
    timestamp: string; // ISO 8601 timestamp
    url: string;
}

export interface LatestTimestampResponse {
    timestamp: string;
}

/**
 * Database table "scrobble"
 */
export class Scrobble {
    private readonly supabase: SupabaseClient | undefined;

    private tableName = "scrobbles";

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    /**
     * Get the latest timestamp from the scrobbles table.
     * @param supabase - The Supabase client instance.
     * @returns The latest timestamp in Unix seconds or null.
     */
    async getLatestTimestamp(): Promise<number | null> {
        if (!this.supabase) {
            throw new Error('supabase is not initialized');
        }

        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("timestamp")
            .order("timestamp", { ascending: false })
            .limit(1)
            .single<LatestTimestampResponse>();

        if (error) {
            console.error("Error fetching latest timestamp:", error);
            return null;
        }

        return data ? Math.floor(new Date(data.timestamp).getTime() / 1000) : null;
    }

    // /**
    //  * Transform Last.fm tracks to ScrobbleEntity type.
    //  * @param tracks - Array of tracks from Last.fm API.
    //  * @returns Array of transformed scrobbles.
    //  */
    // transformTracks(tracks: LastFmTrack[]): ScrobbleRow[] {
    //     return tracks
    //         .filter(track => !track["@attr"]?.nowplaying)
    //         .map(track => ({
    //             track: track.name,
    //             artist: track.artist["#text"],
    //             album: track.album["#text"] || null,
    //             timestamp: new Date(parseInt(track.date.uts) * 1000).toISOString(),
    //             url: track.url,
    //         }));
    // }

    /**
     * Save new scrobbles to Supabase.
     * @param tracks - Array of new scrobbles to save.
     * @returns An object containing a message or error.
     */
    async saveToSupabase(tracks: ScrobbleRow[]): Promise<{ message?: string; error?: unknown }> {
        if (tracks.length === 0) {
            console.log("No new scrobbles to save.");
            return { message: "No new scrobbles" };
        }

        if (!this.supabase) {
            throw new Error('supabase is not initialized');
        }

        const { error } = await this.supabase.from(this.tableName).insert(tracks);

        if (error) {
            console.error("Error inserting data:", error);
            return { error };
        } else {
            console.log(`Saved ${tracks.length} new scrobbles to Supabase.`);
            return { message: `Saved ${tracks.length} new scrobbles` };
        }
    }
}
