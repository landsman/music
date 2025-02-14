import { supabase, Database } from "../lib/supabase.ts";

// Define type for the database tables
type Tables = Database['public']['Tables'];
type Listened = Tables['listened']['Row'];
type Hooman = Tables['hooman']['Row'];

type JoinedListened = Omit<Listened, 'hooman_id'> & {
    hooman: Hooman;
};

export async function getLastListenedTracks(): Promise<JoinedListened[]> {
    const { data, error } = await supabase
        .from('listened')
        .select(`
            id, 
            artist_name, 
            track_name,
            album_lastfm_id,
            album_name,
            created_at,b
            hooman:hooman_id (
              id,
              lastfm_user
            )
        `)
        .order("listened_at", { ascending: false })
        .limit(50);

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error("No data returned");
    }

    return data as JoinedListened[];
}
