export interface Variables {
  DEVELOPER_MODE: boolean;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  LASTFM_API_KEY: string;
  LASTFM_USERNAME: string;
}

export const env: Variables = {
  DEVELOPER_MODE: Deno.env.get("DEVELOPER_MODE") !== "true",
  SUPABASE_URL: Deno.env.get("SUPABASE_URL")!,
  SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY")!,
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  LASTFM_API_KEY: Deno.env.get("LASTFM_API_KEY")!,
  LASTFM_USERNAME: Deno.env.get("LASTFM_USERNAME")!,
};
