import { LastFmApiClient, throwOnLastFmError } from "./api-client.ts";

/**
 * https://www.last.fm/api/show/library.getArtists
 */
export async function getLibraryArtists(
  apiKey: string,
  userName: string,
  limit: number,
  page: number,
): Promise<ArtistsResponse | null> {
  const lastfm = new LastFmApiClient(apiKey);
  const url = lastfm.buildUrl(
    lastfm.buildParams({
      userName: userName,
      method: lastfm.getMethods().libraryGetArtists,
      methodParams: {
        limit,
        page,
      },
    }),
  );
  const data = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
  throwOnLastFmError(data);
  if (!data?.artists) {
    console.error(
      "getLibraryArtists - unexpected response:",
      JSON.stringify(data),
    );
    return null;
  }
  return data as ArtistsResponse;
}

interface ArtistsResponse {
  artists: Artists;
}

interface Artists {
  artist: Artist[];
  "@attr": Attr;
}

export interface Artist {
  tagcount: string;
  image: Image[];
  mbid: string;
  url: string;
  playcount: string;
  name: string;
  streamable: string;
}

interface Image {
  size: string;
  "#text": string;
}

interface Attr {
  user: string;
  totalPages: string;
  page: string;
  total: string;
  perPage: string;
}
