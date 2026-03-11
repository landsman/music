import { Database, supabase } from "../lib/supabase.ts";

type Tables = Database["public"]["Tables"];
type Hooman = Tables["hooman"]["Row"];

export type User = Pick<Hooman, "id" | "lastfm_user">;

export async function getUsers(signal: AbortSignal): Promise<User[]> {
  const { data, error } = await supabase
    .from("hooman")
    .select("id, lastfm_user")
    .order("lastfm_user", { ascending: true })
    .abortSignal(signal);

  if (error) throw error;
  return data ?? [];
}
