"use client";

import { useQuery } from '@tanstack/react-query'
import { getLastListenedTracks } from "./api.ts";
import {OrbitProgress} from "npm:react-loading-indicators@1.0.0";

export function ListenedList() {
  const { isLoading, error, data } = useQuery({ queryKey: ['last_listened'], queryFn: getLastListenedTracks })

  if (isLoading) return <OrbitProgress variant="track-disc" color={'#FFF'} />;
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
