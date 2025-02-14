import {
  localizeDateTimeBrowser,
  localizeRelativeTimeBrowser,
} from "../../lib/localize-date.ts";
import {i18n} from "../../i18n/i18n.ts";
import {Track} from "./track.tsx";

interface Props {
  artist: string;
  track: string;
  user: string | undefined;
  listenedAt: string;
}

export function FeedItem(props: Props) {
  const { artist, track, user, listenedAt } = props;
  return (
    <div className="feed_row">
      <div className="track_side">
        <div className="track">
            <Track name={track} />
        </div>
        <div className="artist">
          {artist}
        </div>
      </div>
      <div className="user_side">
        <div
          className="listened_at"
          title={localizeDateTimeBrowser(listenedAt)}
        >
          {localizeRelativeTimeBrowser(listenedAt, i18n.time)}
        </div>
          <div className="user">
              <a href={`https://www.last.fm/user/${user || "unknown"}`} title={i18n.visitUserProfile}>
                  {user || "Unknown User"}
              </a>
          </div>
      </div>
    </div>
  );
}
