export const env = {
  SUPABASE_URL: Deno.env.get("SUPABASE_URL")!,
  SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY")!,
  LASTFM_API_KEY: Deno.env.get("LASTFM_API_KEY")!,
  LASTFM_USERNAME: Deno.env.get("LASTFM_USERNAME")!,
};
