import { useEffect, useState } from "react";
import { useQuery } from "../lib/react-query.tsx";
import { getLastListenedTracks, ListenedTracks } from "./tracks-api.ts";

export function useTracks() {
  const [page, setPage] = useState(0);
  const [allTracks, setAllTracks] = useState<ListenedTracks[]>([]);

  const { isLoading, isFetching, error, data = [], refetch } = useQuery<
    ListenedTracks[]
  >({
    queryKey: ["lastListenedTracks", page],
    queryFn: ({ signal }) => getLastListenedTracks(signal, page),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Handle data updates
  useEffect(() => {
    if (data && data.length > 0) {
      if (page === 0) {
        setAllTracks(data);
      } else {
        setAllTracks((prev) => {
          return [...prev, ...data];
        });
      }
    }
  }, [data, page]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Query error:", error);
    }
  }, [error]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const retryFetch = async () => {
    console.log("Retrying data fetch...");
    setPage(0);
    setAllTracks([]);
    try {
      await refetch();
      console.log("Refetch initiated");
    } catch (err) {
      console.error("Refetch failed:", err);
    }
  };

  const hasMoreData = data.length === 50;

  return {
    tracks: allTracks,
    isLoading,
    isFetching,
    error,
    loadMore,
    retryFetch,
    hasMoreData,
    page,
  };
}
