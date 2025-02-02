import { DbSupabaseTable } from "../_shared/supabase-table.ts";

export interface Row {
  created_at: string;
  lastfm_user: string;
}

const columnName: Row = {
  created_at: "created_at",
  lastfm_user: "lastfm_user",
};

export class TableHooman extends DbSupabaseTable {
  tableName = "hooman";

  async findOrCreateByLastFmUser(lastFmUser: string): Promise<string> {
    const { data, error } = await this.getSupabase()
      .from(this.tableName)
      .select("id")
      .eq(columnName.lastfm_user, lastFmUser)
      .limit(1)
      .maybeSingle<{ id: string } | null>();

    if (error) {
      throw new Error("Error fetching hooman: " + JSON.stringify(error));
    }

    if (data) {
      return data.id;
    }

    console.log(`Creating new user: ${lastFmUser}`);

    const { data: insertData, error: insertError } = await this.getSupabase()
      .from(this.tableName)
      .insert({
        [columnName.created_at]: new Date(),
        [columnName.lastfm_user]: lastFmUser,
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (insertError || !insertData) {
      throw new Error("Error creating hooman: " + JSON.stringify(insertError));
    }

    return insertData.id;
  }
}
