/**
 * see https://www.last.fm/api/show/user.getRecentTracks
 */
export async function getRecentTracks(
  apiKey: string,
  userName: string,
  page: number = 1,
  limit: number = 1,
  from: number | null = null,
  to: number | null = null,
): Promise<RecentTracks | null> {
  const url = new URL("https://ws.audioscrobbler.com/2.0/");

  const paramsRegular = {
    api_key: apiKey,
    format: "json",
    method: "user.getrecenttracks",
    user: userName,
    limit: limit.toString(),
    page: page.toString(),
    extended: "1",

    // UNIX timestamp format (integer number of seconds since 00:00:00, January 1st 1970 UTC).
    // This must be in the UTC time zone.
    from: from ? from.toString() : "",
    to: to ? to.toString() : "",
  };

  url.search = new URLSearchParams(paramsRegular).toString();

  return await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
}

type Image = {
  size: string;
  "#text": string;
};

interface Artist {
  url: string;
  name: string;
  image: Image[];
  mbid: string;
}

interface Track {
  artist: Artist;
  // date is present only when the track is not playing right now...
  date?: {
    uts: number;
    "#text": string;
  };
  mbid: string;
  name: string;
  image: Image[];
  url: string;
  streamable: string;
  album: {
    mbid: string;
    "#text": string;
  };
  loved: string;
  // present only when it is playing, weird I know
  "@attr"?: {
    nowplaying: boolean;
  };
}

interface Attributes {
  user: string;
  totalPages: string;
  page: string;
  perPage: string;
  total: string;
}

interface RecentTracks {
  recenttracks: {
    track: Track[];
    "@attr": Attributes;
  };
}
