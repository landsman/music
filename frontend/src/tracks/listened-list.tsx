import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.ts";

interface Item {
  id: string;
  artist_name: string;
  track_name: string;
  hooman: {
    id: string;
    lastfm_user: string;
  } | null; // todo: get rid of nullable in db
}

async function fetchItems(): Promise<Item[]> {
  const { data, error } = await supabase
      .from("listened")
      .select(`
        id, 
        artist_name, 
        track_name, 
        hooman (
          id,
          lastfm_user
        )
      `)
      .order("listened_at", { ascending: false })
      .limit(20)
  ;

  if (error) {
    throw error;
  }

  return data;
}

export function ListenedList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getItems() {
      try {
        const data = await fetchItems();
        console.log(data);
        setItems(data)
      } catch (e) {
        console.error(e);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    }
    getItems()
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {items.map((item) => (
          <div key={item.id}>
            <a href={`https://www.last.fm/user/${item.hooman!.lastfm_user}`} target={'_blank'}>
              {item.hooman!.lastfm_user}
            </a>: {item.artist_name} - {item.track_name}
          </div>
      ))}
    </div>
  );
}
