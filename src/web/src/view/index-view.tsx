"use client";

import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react/macro";
import { useQuery } from "../lib/react-query.tsx";
import { getLastListenedTracks, ListenedTracks } from "../data/tracks-api.ts";
import { FeedList } from "../ui/feed/list/feed-list.tsx";
import { MusicLoader } from "../ui/activity/loader.tsx";
import { Header } from "../ui/header/header.tsx";

export function IndexView() {
  const { t } = useLingui();
  const [page, setPage] = useState(0);
  const [allTracks, setAllTracks] = useState<ListenedTracks[]>([]);

  console.log("IndexView rendered with state:", {
    page,
    allTracksLength: allTracks.length,
  });

  const { isLoading, isFetching, error, data = [], refetch } = useQuery<
    ListenedTracks[]
  >({
    queryKey: ["lastListenedTracks", page],
    queryFn: ({ signal }) => getLastListenedTracks(signal, page),
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Handle data updates with useEffect instead of onSuccess
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("Query success, received data:", data);
      if (page === 0) {
        console.log("Setting initial tracks");
        setAllTracks(data);
      } else {
        console.log("Appending new tracks to existing ones");
        setAllTracks((prev) => {
          const updatedTracks = [...prev, ...data];
          console.log("Updated tracks array:", updatedTracks);
          return updatedTracks;
        });
      }
    }
  }, [data, page]);

  // Handle errors with useEffect
  useEffect(() => {
    if (error) {
      console.error("Query error:", error);
    }
  }, [error]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const hasMoreData = data.length === 50;

  console.log("Before rendering FeedList:", {
    allTracksLength: allTracks.length,
    dataLength: data.length,
    isLoading,
    isFetching,
    error: error ? (error as Error).message : null,
  });

  // Function to retry fetching data
  const retryFetch = async () => {
    console.log("Retrying data fetch...");
    // Reset page to 0 and clear tracks
    setPage(0);
    setAllTracks([]);
    // Use React Query's refetch function
    try {
      await refetch();
      console.log("Refetch initiated");
    } catch (err) {
      console.error("Refetch failed:", err);
    }
  };

  return (
    <div className="index-view">
      <Header />
      {isLoading && page === 0 && (
        <MusicLoader size={64} center paddingTop={40} />
      )}

      {error && (
        <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
          <p>Error: {(error as Error).message}</p>
          <button type="button" onClick={retryFetch}>
            {t`retry`}
          </button>
        </div>
      )}

      {allTracks.length === 0 && !isLoading && !error && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>No tracks found. This could be due to:</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>- No data in the database</li>
            <li>- Connection issues with Supabase</li>
            <li>- Authentication problems</li>
          </ul>
          <button type="button" onClick={retryFetch}>
            {t`retry`}
          </button>
        </div>
      )}

      <FeedList
        isLoading={isLoading && page === 0}
        isFetching={isFetching}
        error={error}
        data={allTracks}
        onLoadMore={loadMore}
        hasMoreData={hasMoreData}
      />
    </div>
  );
}
