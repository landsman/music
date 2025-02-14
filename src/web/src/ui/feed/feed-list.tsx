import {FeedItem} from "./feed-item.tsx";
import {OrbitProgress} from "npm:react-loading-indicators@1.0.0";
import {ListenedTracks} from "../../data/tracks-api.ts";
import "./feed.module.css"

interface FeedListProps {
  data: ListenedTracks[];
  error: Error | null;
  isLoading: boolean;
}

export function FeedList(props: FeedListProps) {
  const { data, error, isLoading } = props;

  if (isLoading) return <OrbitProgress variant="track-disc" color={"#FFF"} />;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="feed">
      {data.map((item: ListenedTracks) => (
        <FeedItem
          key={item.id}
          track={item.track_name}
          artist={item.artist_name}
          listenedAt={item.listened_at}
          user={item.hooman?.lastfm_user}
        />
      ))}
    </div>
  );
}
