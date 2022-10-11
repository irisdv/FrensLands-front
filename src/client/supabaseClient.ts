import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const access_token = localStorage.getItem("user") || "";

export const supabase = createClient(
  supabaseUrl as string,
  supabaseAnonKey as string,
  {
    global: {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  }
);

export const createSupabase = (_token: string) => {
  const supabase = createClient(
    supabaseUrl as string,
    supabaseAnonKey as string,
    {
      global: {
        headers: {
          Authorization: `Bearer ${_token}`,
        },
      },
    }
  );

  return supabase;
};
