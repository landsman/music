import {Database, supabase} from "../lib/supabase.ts";

type Tables = Database['public']['Tables'];
type Listened = Tables['listened']['Row'];
type Hooman = Tables['hooman']['Row'];

export type ListenedTracks = Omit<Listened, 'hooman_id'> & {
    hooman: Hooman | null;
};

export async function getLastListenedTracks(signal: AbortSignal): Promise<ListenedTracks[]> {
    const { data, error } = await supabase
        .from('listened')
        .select<string, ListenedTracks>(`
            id, 
            artist_name, 
            track_name,
            album_lastfm_id,
            album_name,
            created_at,
            listened_at,
            lastfm_id,
            hooman:hooman_id (
              id,
              lastfm_user
            )
        `)
        .order("listened_at", {ascending: false})
        .limit(50)
        .abortSignal(signal);

    if (error) throw error;
    return data ?? [];
}
