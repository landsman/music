import { supabase, Database } from "../lib/supabase.ts";

// Define type for the database tables
type Tables = Database['public']['Tables'];
type Listened = Tables['listened']['Row'];
type Hooman = Tables['hooman']['Row'];

export interface LastListenedTrack extends Listened {
    hooman: Hooman;
}

export async function getLastListenedTracks(): Promise<LastListenedTrack[]> {
    const { data, error } = await supabase
        .from('listened')
        .select<string, LastListenedTrack>(`
            id, 
            artist_name, 
            track_name,
            hooman (
              id,
              lastfm_user
            )
        `)
        .order("listened_at", { ascending: false })
        .limit(50);

    if (error) {
        throw error;
    }

    return data;
}
