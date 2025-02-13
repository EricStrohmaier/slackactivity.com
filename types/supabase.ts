import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "./supabase_generated";
import { SupabaseClient } from "@supabase/supabase-js";

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        apartment_costs: {
          Row: {
            // make them optional
            id?: number;
            created_at?: string;
          };
        };
      };
    };
  }
>;
export type TypedSupabaseClient = SupabaseClient<Database>;

// Ads

export type User = Database["public"]["Tables"]["users"]["Row"];

export type dbWorkspace = Database["public"]["Tables"]["workspace"]["Row"];

export type Workspace = dbWorkspace & {
  working_hours: WorkingHours;
};

export interface WorkingHours {
  startHour: number;
  endHour: number;
  daysOfWeek: number[];
  timezone: string;
}

export interface ActivityReport {
  totalUpdates: number;
  activeUpdates: number;
  awayUpdates: number;
  activePercentage: number;
  awayPercentage: number;
}
