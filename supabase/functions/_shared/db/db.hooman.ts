import { BaseTable } from "./db.ts";

export class HoomanTable extends BaseTable {
  async findOrCreateByLastFmUser(lastFmUser: string): Promise<string> {
    const { data, error } = await this.getSupabase()
      .from("hooman")
      .select("id")
      .eq("lastfm_user", lastFmUser.replace(/\s/g, ""))
      .limit(1)
      .maybeSingle<{ id: string } | null>();

    if (error) {
      throw new Error("Error fetching Hooman: " + JSON.stringify(error));
    }

    if (data !== null) {
      return data.id;
    } else {
      console.log("Hooman not found:", lastFmUser);
    }

    const { data: insertData, error: insertError } = await this.getSupabase()
      .from("hooman")
      .insert({
        "created_at": new Date().toString(),
        "lastfm_user": lastFmUser,
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (insertError || !insertData) {
      throw new Error("Error creating Hooman: " + JSON.stringify(insertError));
    }

    console.log("Created new Hooman:", insertData);

    return insertData.id;
  }
}
