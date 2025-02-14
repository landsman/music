"use client";

import {useQuery} from "../lib/react-query.tsx";
import {getLastListenedTracks, ListenedTracks} from "../data/tracks-api.ts";
import {FeedList} from "../ui/feed/feed-list.tsx";
import {Loader} from "../ui/activity/loader.tsx";
import {i18n} from "../i18n/i18n.ts";

export function IndexView() {
    const { isLoading, error, data = [] } = useQuery<ListenedTracks[]>({
        queryKey: ['lastListenedTracks'],
        queryFn: ({ signal }) => getLastListenedTracks(signal),
    });

    if (isLoading) return <Loader />
    if (error) return <div>Error: {(error as Error).message}</div>;

    return (
        <div className='index-view'>
            <h2>{i18n.lastListened}</h2>
            <FeedList data={data} isLoading={isLoading} error={error} />
        </div>
    )
}