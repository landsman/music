interface BuildParams {
  userName: string;
  method: string;
  methodParams: object;
}

/**
 * https://www.last.fm/api
 */
export class LastFmApiClient {
  private readonly host: string;
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.host = "https://ws.audioscrobbler.com/2.0/";
  }

  /**
   * available "endpoints"
   */
  getMethods() {
    return {
      userRecentTracks: "user.getrecenttracks",
      libraryGetArtists: "library.getArtists",
    };
  }

  /**
   * prepare url search params
   */
  buildParams(props: BuildParams): URLSearchParams {
    const { method, methodParams, userName } = props;

    const paramsRegular = {
      api_key: this.apiKey,
      format: "json",
      method: method,
      user: userName,
    };

    return new URLSearchParams({ ...paramsRegular, ...methodParams });
  }

  /**
   * return the whole URL for fetch
   */
  buildUrl(params: URLSearchParams) {
    const url = new URL(this.host);
    url.search = new URLSearchParams(params).toString();

    return url;
  }
}

/**
 * Throws when Last.fm answered with its error shape, `{ error, message }`.
 * https://www.last.fm/api/errorcodes
 */
export function throwOnLastFmError(data: unknown): void {
  const { error, message } = (data ?? {}) as {
    error?: unknown;
    message?: unknown;
  };
  if (typeof error === "number") {
    throw new LastFmError(error, String(message));
  }
}

export class LastFmError extends Error {
  constructor(readonly code: number, message: string) {
    super(`Last.fm error ${code}: ${message}`);
    this.name = "LastFmError";
  }

  /** Last.fm's own "try again later": an outage on their side, not a bug here. */
  get transient(): boolean {
    return TRANSIENT_CODES.has(this.code);
  }
}

// 8 backend failed, 11 service offline, 16 temporarily unavailable, 29 rate limit
const TRANSIENT_CODES = new Set([8, 11, 16, 29]);
