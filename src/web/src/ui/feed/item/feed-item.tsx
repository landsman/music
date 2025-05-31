import { toast } from "react-hot-toast";
import { useLingui } from "@lingui/react/macro";
import {
  localizeDateTimeBrowser,
  localizeRelativeTimeBrowser,
} from "../../../lib/localize-date.ts";
import { Marquee } from "../track/track.tsx";
import { User } from "../../user/user.tsx";
import { Album } from "../album.tsx";
import { Artist } from "../artist.tsx";

interface Props {
  artist: string;
  album: string | null;
  track: string;
  user: string | undefined;
  listenedAt: string;
}

export function FeedItem(props: Props) {
  const { t, i18n } = useLingui();
  const { artist, album, track, user, listenedAt } = props;

  console.log("FeedItem received props:", {
    artist,
    album,
    track,
    user,
    listenedAt,
  });

  function handleOnClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    toast.promise(navigator.clipboard.writeText(`${artist} - ${track}`), {
      loading: t`copyToClipboard`,
      success: t`copyToClipboard.success`,
      error: t`copyToClipboard.error`,
    });
  }

  return (
    <div className="feed_row">
      <div className="track_side" onClick={handleOnClick}>
        <div className="track">
          <Marquee text={track} />
        </div>
        <div className="artist">
          <Artist name={artist} />
          <Album name={album} />
        </div>
      </div>
      <div className="user_side">
        <div
          className="listened_at"
          title={localizeDateTimeBrowser(listenedAt)}
        >
          {localizeRelativeTimeBrowser(listenedAt, i18n.locale, {
            seconds: t`time.seconds`,
            minutes: t`time.minutes`,
            hours: t`time.hours`,
            days: t`time.days`,
            ago: t`time.ago`,
            in: t`time.in`,
          })}
        </div>
        <User name={user} />
      </div>
    </div>
  );
}
