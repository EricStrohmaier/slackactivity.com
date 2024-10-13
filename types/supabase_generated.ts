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
      activity_logs: {
        Row: {
          action: string | null;
          details: Json | null;
          id: number;
          timestamp: string | null;
          user_id: string | null;
          workspace_id: string | null;
        };
        Insert: {
          action?: string | null;
          details?: Json | null;
          id?: number;
          timestamp?: string | null;
          user_id?: string | null;
          workspace_id?: string | null;
        };
        Update: {
          action?: string | null;
          details?: Json | null;
          id?: number;
          timestamp?: string | null;
          user_id?: string | null;
          workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activity_logs_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          }
        ];
      };
      ms_token_info: {
        Row: {
          access_token: string;
          created_at: string | null;
          expires_at: string;
          id: string;
          refresh_token: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          access_token: string;
          created_at?: string | null;
          expires_at: string;
          id?: string;
          refresh_token: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          access_token?: string;
          created_at?: string | null;
          expires_at?: string;
          id?: string;
          refresh_token?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "token_info_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      temp_tokens: {
        Row: {
          created_at: string | null;
          id: string;
          state: string;
          token_data: Json;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          state: string;
          token_data: Json;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          state?: string;
          token_data?: Json;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          slack_auth_token: string | null;
          stripe_customer_id: string | null;
          working_hours: Json | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          slack_auth_token?: string | null;
          stripe_customer_id?: string | null;
          working_hours?: Json | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          slack_auth_token?: string | null;
          stripe_customer_id?: string | null;
          working_hours?: Json | null;
        };
        Relationships: [];
      };
      workspace: {
        Row: {
          created_at: string;
          enterprise: Json | null;
          id: string;
          is_active: boolean | null;
          slack_auth_token: string | null;
          stripe_is_paid: boolean | null;
          stripe_payment_id: string | null;
          team_id: string | null;
          team_name: string | null;
          user_id: string | null;
          working_hours: Json | null;
        };
        Insert: {
          created_at?: string;
          enterprise?: Json | null;
          id?: string;
          is_active?: boolean | null;
          slack_auth_token?: string | null;
          stripe_is_paid?: boolean | null;
          stripe_payment_id?: string | null;
          team_id?: string | null;
          team_name?: string | null;
          user_id?: string | null;
          working_hours?: Json | null;
        };
        Update: {
          created_at?: string;
          enterprise?: Json | null;
          id?: string;
          is_active?: boolean | null;
          slack_auth_token?: string | null;
          stripe_is_paid?: boolean | null;
          stripe_payment_id?: string | null;
          team_id?: string | null;
          team_name?: string | null;
          user_id?: string | null;
          working_hours?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
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
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
