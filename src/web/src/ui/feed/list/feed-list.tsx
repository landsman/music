import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { FeedItem } from "../item/feed-item.tsx";
import { ListenedTracks } from "../../../data/tracks-api.ts";
import { MusicLoader } from "../../activity/loader.tsx";
import { LoadMore } from "./load-more.tsx";
import "./feed.module.css";

interface FeedListProps {
  data: ListenedTracks[];
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  onLoadMore?: () => void;
  hasMoreData?: boolean;
}

export function FeedList(props: FeedListProps) {
  const [trackIsOpen, setTrackIsOpen] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(feedRef, () => setTrackIsOpen(null));

  const {
    data,
    isLoading,
    error,
    isFetching,
    onLoadMore,
    hasMoreData = false,
  } = props;

  if (isLoading) {
    return null;
  }

  // Check if we have data to display
  const hasData = data && data.length > 0;

  return (
    <div ref={feedRef} className="feed" data-fetching={isFetching}>
      {isFetching && <MusicLoader size={32} className="feed__fetching" />}

      {hasData && (data.map((item: ListenedTracks, index: number) => (
        <FeedItem
          key={item.id}
          index={index}
          isOpen={trackIsOpen === item.id}
          onClick={() => setTrackIsOpen(item.id)}
          artist={item.artist_name}
          album={item.album_name}
          track={item.track_name}
          listenedAt={item.listened_at}
          user={item.hooman?.lastfm_user}
        />
      )))}

      {!error && hasMoreData && onLoadMore && (
        <LoadMore
          onLoadMore={() => {
            setTrackIsOpen(null);
            onLoadMore();
          }}
          isFetching={isFetching}
          hasMoreData={hasMoreData}
          error={error}
        />
      )}
    </div>
  );
}
