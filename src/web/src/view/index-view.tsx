"use client";

import { useState } from "react";
import { useQuery } from "../lib/react-query.tsx";
import { getLastListenedTracks, ListenedTracks } from "../data/tracks-api.ts";
import { FeedList } from "../ui/feed/feed-list.tsx";
import { MusicLoader } from "../ui/activity/loader.tsx";
import { Header } from "../ui/header.tsx";
import {i18n} from "../i18n/i18n.ts";

export function IndexView() {
  const [page, setPage] = useState(0);
  const [allTracks, setAllTracks] = useState<ListenedTracks[]>([]);

  console.log('IndexView rendered with state:', { page, allTracksLength: allTracks.length });

  const { isLoading, isFetching, error, data = [], refetch } = useQuery<
    ListenedTracks[]
  >({
    queryKey: ["lastListenedTracks", page],
    queryFn: ({ signal }) => getLastListenedTracks(signal, page),
    onSuccess: (newData) => {
      console.log('Query success, received data:', newData);
      if (page === 0) {
        console.log('Setting initial tracks');
        setAllTracks(newData);
      } else {
        console.log('Appending new tracks to existing ones');
        setAllTracks((prev) => {
          const updatedTracks = [...prev, ...newData];
          console.log('Updated tracks array:', updatedTracks);
          return updatedTracks;
        });
      }
    },
    onError: (err) => {
      console.error('Query error:', err);
    },
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const hasMoreData = data.length === 50;

  console.log('Before rendering FeedList:', { 
    allTracksLength: allTracks.length, 
    dataLength: data.length,
    isLoading,
    isFetching,
    error: error ? (error as Error).message : null
  });

  // Function to retry fetching data
  const retryFetch = async () => {
    console.log('Retrying data fetch...');
    // Reset page to 0 and clear tracks
    setPage(0);
    setAllTracks([]);
    // Use React Query's refetch function
    try {
      await refetch();
      console.log('Refetch initiated');
    } catch (err) {
      console.error('Refetch failed:', err);
    }
  };

  return (
    <div className="index-view">
      <Header />
      {isLoading && page === 0 && <MusicLoader size={64} center paddingTop={40} />}

      {error && (
        <div style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>
          <p>Error: {(error as Error).message}</p>
          <button 
            onClick={retryFetch}
            style={{ 
              padding: '10px 20px', 
              marginTop: '10px',
              borderRadius: '6px',
              background: '#1e1e1e',
              color: '#fff',
              border: '1px solid #2f2f2f',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {allTracks.length === 0 && !isLoading && !error && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>No tracks found. This could be due to:</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>- No data in the database</li>
            <li>- Connection issues with Supabase</li>
            <li>- Authentication problems</li>
          </ul>
          <button 
            onClick={retryFetch}
            style={{ 
              padding: '10px 20px', 
              marginTop: '10px',
              borderRadius: '6px',
              background: '#1e1e1e',
              color: '#fff',
              border: '1px solid #2f2f2f',
              cursor: 'pointer'
            }}
          >
            {i18n.retry}
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
