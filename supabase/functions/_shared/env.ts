export interface Variables {
  DEVELOPER_MODE: boolean;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  LASTFM_API_KEY: string;
  LASTFM_USERNAME: string;
}

export const env: Variables = {
  DEVELOPER_MODE: Deno.env.get("DEVELOPER_MODE") !== "true",
  SUPABASE_URL: Deno.env.get("SUPABASE_URL")!,
  SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY")!,
  LASTFM_API_KEY: Deno.env.get("LASTFM_API_KEY")!,
  LASTFM_USERNAME: Deno.env.get("LASTFM_USERNAME")!,
};
