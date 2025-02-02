import { getLibraryArtists } from "../_shared/lastfm/library-artists.ts";
import { Variables } from "../_shared/env.ts";

/**
 * Sync database of artists with Last.fm
 */
export async function syncArtists(env: Variables, lastFmUser: string) {
  const apiData = await getLibraryArtists(
    env.LASTFM_API_KEY,
    lastFmUser,
    50,
    1,
  );

  console.log(apiData);

  return "ok";
}
