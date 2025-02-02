import { BaseTable } from "./db.ts";

export interface Row {
  created_at: string;
  lastfm_user: string;
}

const columnName: Row = {
  created_at: "created_at",
  lastfm_user: "lastfm_user",
};

export class TableHooman extends BaseTable {
  tableName = "hooman";

  async findOrCreateByLastFmUser(lastFmUser: string): Promise<string> {
    const { data, error } = await this.getSupabase()
      .from(this.tableName)
      .select("id")
      .eq(columnName.lastfm_user, lastFmUser.replace(/\s/g, ""))
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
      .from(this.tableName)
      .insert({
        [columnName.created_at]: new Date(),
        [columnName.lastfm_user]: lastFmUser,
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
