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
