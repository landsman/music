import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getRecentTracks } from "./lastfm.ts";
import { Variables } from "./env.ts";
import { TableHooman } from "./db.hooman.ts";
import { ListenedRow, TableListened } from "./db.listened.ts";

/**
 * Sync data from Last.fm to Supabase Database.
 */
export async function scrobbles(
  env: Variables,
  lastFmUser: string | null = null,
): Promise<string> {
  const size = 50;
  const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const listened = new TableListened(supabaseClient);
  const hooman = new TableHooman(supabaseClient);
  const startFrom: number | null = await listened.getLastListenedDate();

  let totalPages = 1;
  let total = 0;
  let page = 1;

  if (startFrom) {
    console.log(
      "Starting from last listened date:",
      new Date(startFrom * 1000).toLocaleString(),
    );
  } else {
    console.log("Database is empty, starting from the last page");
  }

  const lastFmUserToUse = lastFmUser ? lastFmUser : env.LASTFM_USERNAME;
  console.log(`Last.fm user: ${lastFmUserToUse}`);

  const hoomanId = await hooman.findOrCreateByLastFmUser(lastFmUserToUse);

  const fmInitial = await getRecentTracks(
    env.LASTFM_API_KEY,
    lastFmUserToUse,
    1,
    size,
    startFrom,
  );
  if (fmInitial === null) {
    throw new Error("Fail - No tracks returned from initial api request.");
  }
  const paginationInitial = fmInitial.recenttracks["@attr"];
  totalPages = parseInt(paginationInitial.totalPages);
  total = parseInt(paginationInitial.total);
  page = totalPages;

  if (total === 0) {
    console.log("Nothing new to save.");
    return "ok";
  }

  if (startFrom) {
    console.log(
      `Found ${total} new tracks to save! Starting from page ${totalPages}.`,
    );
  } else {
    console.log(
      `Found ${total} tracks in total. Starting from page ${totalPages}.`,
    );
  }

  let processedPages = 0;
  do {
    if (processedPages === 10) {
      console.log(
        `Already inserted ${
          processedPages * size
        } items to db. Stopped. See ya in next cron.`,
      );
      break;
    }

    const fm = await getRecentTracks(
      env.LASTFM_API_KEY,
      lastFmUserToUse,
      page,
      size,
      startFrom,
    );
    if (fm === null) {
      console.warn("Fail - No tracks returned from api request.");
      break;
    }
    const data = fm.recenttracks;
    const tracks = data.track;

    if (total === 0 || tracks.length === 0) {
      break;
    }

    console.log(`Fetching page ${page}/${totalPages}`);

    const toInsert: ListenedRow[] = tracks
      .filter((track) => !(track["@attr"] && track["@attr"].nowplaying))
      .map((track) => ({
        created_at: new Date().toISOString(),
        listened_at: new Date(track.date!.uts * 1000).toISOString(),
        artist_name: track.artist.name,
        track_name: track.name,
        album_name: track.album["#text"],
        lastfm_data: track,
        hooman_id: hoomanId,
      }));

    const { error, message } = await listened.save(toInsert);
    if (error) {
      throw new Error(error.toString());
    }

    if (message) {
      console.log(message);
    }

    processedPages++;
    page--;
  } while (page >= 1);

  return "ok";
}
