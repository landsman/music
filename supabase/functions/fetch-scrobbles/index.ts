import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getRecentTracks } from "./lastfm.ts"
import { Row, TableListened } from "./table.ts"
import { env } from "./env.ts"

Deno.serve(async () => {
    const size = 50
    const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
    const table = new TableListened(supabaseClient)
    const startFrom: number | null = await table.getLastListenedDate()
    let totalPages = 1
    let total = 0
    let page = 1

    if (startFrom) {
        console.log('Starting from last listened date:', new Date(startFrom * 1000).toLocaleString())
    }
    else {
        console.log('Database is empty, starting from the last page')
    }

    const fmInitial = await getRecentTracks(env.LASTFM_API_KEY, env.LASTFM_USERNAME, 1, size, startFrom)
    if (fmInitial === null) {
        console.error('Fail - No tracks returned from initial api request.')
        return new Response('error', { headers: { "Content-Type": "text/plain" } })
    }
    const paginationInitial = fmInitial.recenttracks["@attr"]
    totalPages = parseInt(paginationInitial.totalPages)
    total = parseInt(paginationInitial.total)
    page = totalPages

    if (startFrom) {
        console.log(`Found ${total} new tracks to save! Starting from page ${totalPages}.`)
    }
    else {
        console.log(`Found ${total} tracks in total. Starting from page ${totalPages}.`)
    }

    let processedPages = 0
    do {
        if (processedPages === 10) {
            console.log(`Already inserted ${processedPages * size} items to db. Stopped. See ya in next cron.`)
            break
        }

        const fm = await getRecentTracks(env.LASTFM_API_KEY, env.LASTFM_USERNAME, page, size, startFrom)
        if (fm === null) {
            console.error('Fail - No tracks returned from api request.')
            break
        }
        const data = fm.recenttracks
        const tracks = data.track

        if (total === 0 || tracks.length === 0) {
            break
        }

        console.log(`Fetching page ${page}/${totalPages}`)

        const toInsert: Row[] = tracks.map(track => ({
            created_at: new Date().toISOString(),
            listened_at: new Date(track.date.uts * 1000).toISOString(),
            artist_name: track.artist.name,
            track_name: track.name,
            album_name: track.album["#text"],
            lastfm_data: track,
        }))

        const { error, message } = await table.save(toInsert)
        if (error) {
            break
        }

        if (message) {
            console.log(message)
        }

        processedPages++
        page--
    }
    while (page >= 1)

    return new Response('ok1', { headers: { "Content-Type": "text/plain" } })
})