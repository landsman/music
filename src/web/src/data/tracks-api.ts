import { Database, supabase } from "../lib/supabase.ts";

type Tables = Database["public"]["Tables"];
type Listened = Tables["listened"]["Row"];
type Hooman = Tables["hooman"]["Row"];

export type ListenedTracks = Omit<Listened, "hooman_id"> & {
  hooman: Hooman | null;
};

export async function getLastListenedTracks(
  signal: AbortSignal,
  page: number = 0,
  hoomanId?: string,
): Promise<ListenedTracks[]> {
  const limit = 50;
  const offset = page * limit;

  console.log("Fetching tracks with page:", page, "offset:", offset);

  try {
    // First, check if we can connect to Supabase at all
    const healthCheck = await supabase.from("listened").select("count()", {
      count: "exact",
    });
    console.log("Supabase health check:", healthCheck);

    // Now perform the actual query
    let query = supabase
      .from("listened")
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
      .order("listened_at", { ascending: false })
      .range(offset, offset + limit - 1)
      .abortSignal(signal);

    if (hoomanId) {
      query = query.eq("hooman_id", hoomanId);
    }

    const { data, error } = await query;

    console.log("Supabase response:", {
      dataReceived: !!data,
      dataLength: data?.length || 0,
      error: error ? error.message : null,
      firstItem: data && data.length > 0
        ? {
          id: data[0].id,
          artist: data[0].artist_name,
          track: data[0].track_name,
        }
        : null,
    });

    if (error) {
      console.error("Supabase error details:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn("No data returned from Supabase query");
    }

    return data ?? [];
  } catch (error) {
    console.error("Error fetching tracks:", error);
    throw error;
  }
}
