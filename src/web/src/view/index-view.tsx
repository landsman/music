"use client";

import { useState } from "react";
import { useTracks } from "../data/use-tracks.ts";
import { FeedList } from "../ui/feed/list/feed-list.tsx";
import { MusicLoader } from "../ui/activity/loader.tsx";
import { Header } from "../ui/header/header.tsx";
import { UserFilter } from "../ui/header/user-filter.tsx";
import { ErrorState } from "../ui/feed/state/error.tsx";
import { EmptyState } from "../ui/feed/state/empty.tsx";

export function IndexView() {
  const [selectedUserId, setSelectedUserId] = useState("");

  const {
    tracks,
    isLoading,
    isFetching,
    error,
    loadMore,
    retryFetch,
    hasMoreData,
    page,
  } = useTracks(selectedUserId || undefined);

  const isEmpty = tracks.length === 0 && !isLoading && !error;

  return (
    <div className="index-view">
      <Header
        rightSlot={
          <UserFilter value={selectedUserId} onChange={setSelectedUserId} />
        }
      />

      {isLoading && page === 0 && (
        <MusicLoader size={64} center paddingTop={40} />
      )}

      {error && <ErrorState error={error as Error} onRetry={retryFetch} />}

      {isEmpty && <EmptyState onRetry={retryFetch} />}

      <FeedList
        isLoading={isLoading && page === 0}
        isFetching={isFetching}
        error={error}
        data={tracks}
        onLoadMore={loadMore}
        hasMoreData={hasMoreData}
      />
    </div>
  );
}
