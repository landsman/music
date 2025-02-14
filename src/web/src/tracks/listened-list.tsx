"use client";

import { useQuery } from '@tanstack/react-query'
import {getLastListenedTracks, ListenedTracks} from "./api.ts";
import {OrbitProgress} from "npm:react-loading-indicators@1.0.0";

export function ListenedList() {
  const { isLoading, error, data = [] } = useQuery<ListenedTracks[]>({
    queryKey: ['lastListenedTracks'],
    queryFn: ({ signal }) => getLastListenedTracks(signal),
  });

  if (isLoading) return <OrbitProgress variant="track-disc" color={'#FFF'} />;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      {data.map((item: ListenedTracks) => (
          <div key={item.id}>
            <a href={`https://www.last.fm/user/${item.hooman?.lastfm_user || 'unknown'}`}>
              {item.hooman?.lastfm_user || 'Unknown User'}
            </a>: {item.artist_name} - {item.track_name}
          </div>
      ))}
    </div>
  );
}
