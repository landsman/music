import {supabase} from "../lib/supabase.ts";

export interface LastListenedTrack {
    id: string;
    artist_name: string;
    track_name: string;
    hooman: {
        id: string;
        lastfm_user: string;
    } | null; // todo: get rid of nullable in db
}

export async function getLastListenedTracks(): Promise<LastListenedTrack[]> {
    const { data, error } = await supabase
        .from("listened")
        .select(`
        id, 
        artist_name, 
        track_name, 
        hooman (
          id,
          lastfm_user
        )
      `)
        .order("listened_at", { ascending: false })
        .limit(20)
    ;

    if (error) {
        throw error;
    }

    return data;
}
