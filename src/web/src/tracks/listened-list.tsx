"use client";

import { useQuery } from '@tanstack/react-query'
import { getLastListenedTracks } from "./api.ts";

export function ListenedList() {
  const { isLoading, error, data } = useQuery({ queryKey: ['last_listened'], queryFn: getLastListenedTracks })

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data!.map((item) => (
          <div key={item.id}>
            <a href={`https://www.last.fm/user/${item.hooman!.lastfm_user}`}>
              {item.hooman!.lastfm_user}
            </a>: {item.artist_name} - {item.track_name}
          </div>
      ))}
    </div>
  );
}
