"use client";

import { useQuery } from '@tanstack/react-query'
import {OrbitProgress} from "npm:react-loading-indicators@1.0.0";
import {getLastListenedTracks, ListenedTracks} from "./api.ts";
import {localizeDateTimeBrowser} from "../lib/localize-date.ts";

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
          <div key={item.id} className={'row'}>
            <div className={'artist_track'}>{item.artist_name} - {item.track_name}</div>
            <div className={'listened_at'}>
              <a href={`https://www.last.fm/user/${item.hooman?.lastfm_user || 'unknown'}`}>
                {item.hooman?.lastfm_user || 'Unknown User'}
              </a> at {localizeDateTimeBrowser(item.listened_at)}
            </div>
          </div>
      ))}
    </div>
  );
}
