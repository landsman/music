import { FeedItem } from "./feed-item.tsx";
import { ListenedTracks } from "../../data/tracks-api.ts";
import "./feed.module.css";
import { MusicLoader } from "../activity/loader.tsx";
import { i18n } from "../../i18n/i18n.ts";

interface FeedListProps {
  data: ListenedTracks[];
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  onLoadMore?: () => void;
  hasMoreData?: boolean;
}

export function FeedList(props: FeedListProps) {
  const {
    data,
    isLoading,
    error,
    isFetching,
    onLoadMore,
    hasMoreData = false,
  } = props;

  console.log("FeedList received data:", data);
  console.log("FeedList props:", { isLoading, isFetching, hasMoreData });

  if (isLoading) {
    return null;
  }

  // Check if we have data to display
  const hasData = data && data.length > 0;

  return (
    <div className="feed" data-fetching={isFetching}>
      {isFetching && <MusicLoader size={32} className="feed__fetching" />}

      {hasData
        ? (
          // Render items if we have data
          data.map((item: ListenedTracks) => (
            <FeedItem
              key={item.id}
              artist={item.artist_name}
              album={item.album_name}
              track={item.track_name}
              listenedAt={item.listened_at}
              user={item.hooman?.lastfm_user}
            />
          ))
        )
        : (
          // This will be shown if data is empty but not loading and no error
          // The main error/empty state handling is in IndexView
          !isLoading && !error && <div className="feed__empty"></div>
        )}

      {!error && hasData && hasMoreData && onLoadMore && (
        <div className="feed__load-more">
          <button
            onClick={onLoadMore}
            disabled={isFetching}
            className="feed__load-more-button"
          >
            {isFetching ? i18n.loading : i18n.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
