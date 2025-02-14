"use client";

import { Headphones } from "lucide-react";
import { useQuery } from "../lib/react-query.tsx";
import { getLastListenedTracks, ListenedTracks } from "../data/tracks-api.ts";
import { FeedList } from "../ui/feed/feed-list.tsx";
import { MusicLoader } from "../ui/activity/loader.tsx";
import { i18n } from "../i18n/i18n.ts";

export function IndexView() {
  const { isLoading, isFetching, error, data = [] } = useQuery<
    ListenedTracks[]
  >({
    queryKey: ["lastListenedTracks"],
    queryFn: ({ signal }) => getLastListenedTracks(signal),
  });

  return (
    <div className="index-view">
      <h2>
        <Headphones size={24} /> {i18n.lastListened}
      </h2>
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
