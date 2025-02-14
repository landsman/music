import { FeedItem } from "./feed-item.tsx";
import { ListenedTracks } from "../../data/tracks-api.ts";
import "./feed.module.css";

interface FeedListProps {
  data: ListenedTracks[];
  error: Error | null;
  isLoading: boolean;
}

export function FeedList(props: FeedListProps) {
  const { data, isLoading } = props;

  if (isLoading) {
    return null;
  }

  return (
    <div className="feed">
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
