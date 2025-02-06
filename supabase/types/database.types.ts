export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      artist: {
        Row: {
          created_at: string;
          id: string;
          lastfm_id: string | null;
          name: string | null;
        };
        Insert: {
          created_at: string;
          id?: string;
          lastfm_id?: string | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          lastfm_id?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      hooman: {
        Row: {
          created_at: string;
          id: string;
          lastfm_user: string;
        };
        Insert: {
          created_at: string;
          id?: string;
          lastfm_user: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          lastfm_user?: string;
        };
        Relationships: [];
      };
      hooman_artist: {
        Row: {
          artist_id: string;
          created_at: string;
          hooman_id: string;
          id: string;
        };
        Insert: {
          artist_id: string;
          created_at: string;
          hooman_id: string;
          id?: string;
        };
        Update: {
          artist_id?: string;
          created_at?: string;
          hooman_id?: string;
          id?: string;
        };
        Relationships: [];
      };
      listened: {
        Row: {
          album_lastfm_id: string | null;
          album_name: string | null;
          artist_name: string;
          created_at: string;
          hooman_id: string | null;
          id: string;
          lastfm_id: string | null;
          listened_at: string;
          track_name: string;
        };
        Insert: {
          album_lastfm_id?: string | null;
          album_name?: string | null;
          artist_name: string;
          created_at: string;
          hooman_id?: string | null;
          id?: string;
          lastfm_id?: string | null;
          listened_at: string;
          track_name: string;
        };
        Update: {
          album_lastfm_id?: string | null;
          album_name?: string | null;
          artist_name?: string;
          created_at?: string;
          hooman_id?: string | null;
          id?: string;
          lastfm_id?: string | null;
          listened_at?: string;
          track_name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      hooman_artist_count: {
        Row: {
          count: number | null;
          lastfm_user: string | null;
        };
        Relationships: [];
      };
      hooman_artist_match: {
        Row: {
          created_at: string | null;
          hooman_match: string | null;
          id: string | null;
          name: string | null;
        };
        Relationships: [];
      };
      hooman_artist_most_listened: {
        Row: {
          artist: string | null;
          count: number | null;
          hooman: string | null;
        };
        Relationships: [];
      };
      hooman_tracks_most_listened: {
        Row: {
          count: number | null;
          hooman: string | null;
          track: string | null;
        };
        Relationships: [];
      };
      listened_by_kacka: {
        Row: {
          album_name: string | null;
          artist_name: string | null;
          listened_at: string | null;
          track_name: string | null;
        };
        Relationships: [];
      };
      listened_by_michal: {
        Row: {
          album_name: string | null;
          artist_name: string | null;
          listened_at: string | null;
          track_name: string | null;
        };
        Relationships: [];
      };
      listened_count: {
        Row: {
          count: number | null;
          lastfm_user: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (
      & Database[PublicTableNameOrOptions["schema"]]["Tables"]
      & Database[PublicTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[PublicTableNameOrOptions["schema"]]["Tables"]
    & Database[PublicTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : PublicTableNameOrOptions extends keyof (
    & PublicSchema["Tables"]
    & PublicSchema["Views"]
  ) ? (
      & PublicSchema["Tables"]
      & PublicSchema["Views"]
    )[PublicTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  } ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  } ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  } ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]][
      "CompositeTypes"
    ]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][
    CompositeTypeName
  ]
  : PublicCompositeTypeNameOrOptions extends
    keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
