type Image = {
    size: string
    "#text": string
}

interface Artist {
    url: string
    name: string
    image: Image[]
    mbid: string
}

interface Track {
    artist: Artist
    date: {
        uts: number
        "#text": string
    }
    mbid: string
    name: string
    image: Image[]
    url: string
    streamable: string
    album: {
        mbid: string
        "#text": string
    }
    loved: string
}

interface Attributes {
    user: string
    totalPages: string
    page: string
    perPage: string
    total: string
}

export interface RecentTracks {
    recenttracks: {
        track: Track[]
        "@attr": Attributes
    }
}