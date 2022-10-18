import { supabase, createSupabase } from "../supabaseClient";

export const getStaticBuildings = async () => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  let { data, error } = await _supabase.from("static_buildings").select("*");

  if (error) console.log("error fetching static_buildings", error);

  return data;
};

export const getStaticResources = async (biomeId: number) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  let { data, error } = await _supabase
    .from("static_resources")
    .select("*")
    .eq("biomeId", biomeId);

  if (error) console.log("error fetching static_resources", error);

  console.log("data resources", data);

  return data;
};
