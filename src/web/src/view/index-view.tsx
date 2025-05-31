"use client";

import { useQuery } from "../lib/react-query.tsx";
import { getLastListenedTracks } from "../data/tracks-api.ts";
import type { ListenedTracks } from "../data/tracks-api.ts";
import { FeedList } from "../ui/feed/feed-list.tsx";
import { MusicLoader } from "../ui/activity/loader.tsx";
import { Header } from "../ui/header.tsx";

export function IndexView() {
  const { isLoading, isFetching, error, data = [] } = useQuery<
    ListenedTracks[]
  >({
    queryKey: ["lastListenedTracks"],
    queryFn: ({ signal }) => getLastListenedTracks(signal),
  });

  return (
    <div className="index-view">
      <Header />
      {isLoading && <MusicLoader size={64} center paddingTop={40} />}
      {error && <div>Error: {(error as Error).message}</div>}
      <FeedList
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        data={data}
      />
    </div>
  );
}
