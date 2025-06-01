import { toast } from "react-hot-toast";
import {
  localizeDateTimeBrowser,
  localizeRelativeTimeBrowser,
} from "../../lib/localize-date.ts";
import { Trans } from "@lingui/react";
import { Marquee } from "./track.tsx";
import { User } from "./user.tsx";
import { Album } from "./album.tsx";
import { Artist } from "./artist.tsx";

interface Props {
  artist: string;
  album: string | null;
  track: string;
  user: string | undefined;
  listenedAt: string;
}

export function FeedItem(props: Props) {
  const { artist, album, track, user, listenedAt } = props;

  // Create time translations object
  const timeTranslations = {
    seconds: "seconds",
    minutes: "minutes",
    hours: "hours",
    days: "days",
  };

  // Hidden Trans components for extraction
  const hiddenTranslations = (
    <div style={{ display: "none" }}>
      <Trans id="seconds">seconds</Trans>
      <Trans id="minutes">minutes</Trans>
      <Trans id="hours">hours</Trans>
      <Trans id="days">days</Trans>
    </div>
  );

  function handleOnClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    toast.promise(navigator.clipboard.writeText(`${artist} - ${track}`), {
      loading: "Copy to clipboard...",
      success: "track copied, I bet you'll like it",
      error: "Error during copy...",
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
          {localizeRelativeTimeBrowser(listenedAt, timeTranslations)}
        </div>
        <User name={user} />
      </div>
      {hiddenTranslations}
    </div>
  );
}
