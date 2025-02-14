import toast from "react-hot-toast";
import {
  localizeDateTimeBrowser,
  localizeRelativeTimeBrowser,
} from "../../lib/localize-date.ts";
import {i18n} from "../../i18n/i18n.ts";
import {Marquee} from "./track.tsx";
import {User} from "./user.tsx";

interface Props {
  artist: string;
  track: string;
  user: string | undefined;
  listenedAt: string;
}

export function FeedItem(props: Props) {
  const { artist, track, user, listenedAt } = props;

  function handleOnClick(e: React.MouseEvent<HTMLDivElement>) {
      e.preventDefault();
      toast.promise(navigator.clipboard.writeText(`${artist} - ${track}`), {
          loading: 'Copy to clipboard...',
          success: 'track copied, I bet you\'ll like it',
          error: 'Error during copy...',
      });
  }

  return (
    <div className="feed_row">
      <div className="track_side" onClick={handleOnClick}>
        <div className="track">
            <Marquee text={track} />
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
          <User name={user} />
      </div>
    </div>
  );
}
