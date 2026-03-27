/**
 * Last.fm users tracked by this application.
 * Used in cron job definitions and anywhere a user list is needed.
 */
export const LASTFM_USERS = ["Insuit", "Weinkaa"] as const;

export type LastFmUser = (typeof LASTFM_USERS)[number];
