import { FeedItem } from "./feed-item.tsx";
import { ListenedTracks } from "../../data/tracks-api.ts";
import "./feed.module.css";
import { MusicLoader } from "../activity/loader.tsx";

interface FeedListProps {
  data: ListenedTracks[];
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
}

export function FeedList(props: FeedListProps) {
  const { data, isLoading, isFetching } = props;

  if (isLoading) {
    return null;
  }

  return (
    <div className="feed" data-fetching={isFetching}>
      {isFetching && <MusicLoader size={32} className="feed__fetching" />}
      {data.map((item: ListenedTracks) => (
        <FeedItem
          key={item.id}
          artist={item.artist_name}
          album={item.album_name}
          track={item.track_name}
          listenedAt={item.listened_at}
          user={item.hooman?.lastfm_user}
        />
      ))}
    </div>
  );
}
