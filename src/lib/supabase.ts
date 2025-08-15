import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for the minitest results
export interface MinitestResult {
  created_at: string;
  type_name: string;
  keywords: string[];
  one_liner: string;
  type_description: string;

  strengths: string[];

  example_characters: {
    name: string;
    context: string;
  }[];
  advice: string;
  summary_card: {
    type: string;
    keywords: string[];
    direction: string;
    catchphrase: string;
  };
  specific_behaviors: string[];
}

// Database functions
export const supabaseService = {
  async getResultByFinalType(finalType: string) {
    // URL 디코딩
    const decodedType = decodeURIComponent(finalType);

    const { data, error } = await supabase
      .from("n8nAnswer")
      .select("*")
      .eq("type_name", decodedType)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log("No data found for type:", finalType);
      return null;
    }

    return data[0] as MinitestResult;
  },
};
