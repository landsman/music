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
import { usePlaySound } from "../../../lib/use-play-sound.ts";

interface Props {
  index: number;
  isOpen: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  artist: string;
  album: string | null;
  track: string;
  user: string | undefined;
  listenedAt: string;
}

export function FeedItem(props: Props) {
  const { t, i18n } = useLingui();
  const { playSuccess, playError } = usePlaySound();
  const { index, isOpen, onClick, artist, album, track, user, listenedAt } =
    props;

  async function handleOnClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    try {
      await toast.promise(
        navigator.clipboard.writeText(`${artist} - ${track}`),
        {
          loading: t`copyToClipboard`,
          success: t`copyToClipboard.success`,
          error: t`copyToClipboard.error`,
        },
      );
      playSuccess();
    } catch {
      playError();
    }
  }

  return (
    <div
      className={`feed_row ${isOpen ? "isOpen" : ""}`}
      style={{ "--animation-order": index } as React.CSSProperties}
      onClick={(e) => {
        handleOnClick(e);
        onClick(e);
      }}
    >
      <div className="track_item">
        <div className="track_side">
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
    </div>
  );
}
