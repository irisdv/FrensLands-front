import { equal } from "assert";
import { supabase } from "../supabaseClient";

/**
 * getPlayer
 * * Fetch player information
 * @param account {string}
 * @return data {{}}
 */
export default async function getPlayer(account: string) {
  const { data, error } = await supabase
    .from("users")
    .select(
      `id, account, invZoom, tutorial, sound, 
      lands(fk_userid, id, biomeId, fullMap, nbResourcesSpawned), 
      inventories(fk_userid, id, wood, rock, food, coal, metal, energy, coin, gold, freePop, totalPop, level, timeSpent),
      player_buildings(fk_userid, fk_buildingid, posX, posY, blockX, blockY, decay, gameUid, isDestroyed),
      player_actions(fk_userid, fk_landid, id, entrypoint, calldata)
    `
    )
    .eq("account", account)
    .eq("player_buildings.isDestroyed", false)
    .single();

  return data;
}

/**
 * storeAction
 * * Add action in player actions table
 * @param account {[]} player wallet address
 * @param entrypoint {string} in contract
 * @param calldata {string}
 * @return success
 */
export const storeAction = async (
  player: any[],
  entrypoint: string,
  calldata: string
) => {
  const { data: actionData, error: actionError } = await supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player["id" as any],
        fk_landid: player["landId" as any],
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ]);

  if (actionError) throw actionError;
};

/**
 * updateSettings
 * * Update tutorial setting
 * @param account {[]} player wallet address
 * @param entrypoint {string} in contract
 * @param calldata {string}
 * @return success
 */
export const updateTutorial = async (uid: string, val: boolean) => {
  const { data: settingData, error: settingError } = await supabase
    .from("users")
    .update([{ tutorial: val }])
    .eq("id", uid);

  if (settingError) {
    throw settingError;
  } else {
    return 1;
  }
};

/**
 * updateZoomRequest
 * * Update Zoom setting
 * @param account {[]} player wallet address
 * @param entrypoint {string} in contract
 * @param calldata {string}
 * @return success
 */
export const updateZoomRequest = async (uid: string, val: boolean) => {
  const { data: settingData, error: settingError } = await supabase
    .from("users")
    .update([{ invZoom: val }])
    .eq("id", uid);

  if (settingError) {
    throw settingError;
  } else {
    return 1;
  }
};

/**
 * buildAction
 * * Update after player built
 * @param account {string}
 * @param entrypoint {string} in contract
 * @param calldata {string}
 * @param inventory {[]} updated player inventory
 * @param newBuilding {[]} building data
 * @return success
 */
// TODO add fullMap composed in string
export const buildAction = async (
  player: any[],
  entrypoint: string,
  calldata: string,
  inventory: any,
  newBuilding: any
) => {
  const { data: actionData, error: actionError } = await supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player["id" as any],
        fk_landid: player["landId" as any],
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ]);

  if (actionError) throw actionError;

  const { data: inventoryData, error: inventoryError } = await supabase
    .from("inventories")
    .update([
      {
        wood: inventory[0],
        rock: inventory[1],
        food: inventory[2],
        metal: inventory[3],
        coal: inventory[4],
        energy: inventory[5],
        coin: inventory[6],
        gold: inventory[7],
        freePop: inventory[8],
        totalPop: inventory[9],
        timeSpent: inventory[10],
        level: inventory[11],
      },
    ])
    .eq("fk_userid", player["id" as any]);

  if (inventoryError) throw inventoryError;

  // Create entry in db player_buildings
  const { data: buildingData, error: buildingError } = await supabase
    .from("player_buildings")
    .insert([
      {
        fk_userid: player["id" as any],
        fk_landid: player["landId" as any],
        fk_buildingid: newBuilding["type"],
        gameUid: newBuilding["gameUid"],
        posX: newBuilding["posX"],
        posY: newBuilding["posY"],
        blockX: newBuilding["blockX"],
        blockY: newBuilding["blockY"],
      },
    ]);

  if (buildingError) throw buildingError;
};

/**
 * harvestAction
 * * Update after player built
 * @param account {[]} player wallet address
 * @param entrypoint {string} in contract
 * @param calldata {string}
 * @param inventory {[]} updated player inventory
 * @return success
 */
// TODO translated fullMap into string and add in request
export const harvestAction = async (
  player: any[],
  entrypoint: string,
  calldata: string,
  inventory: any
) => {
  const { data: actionData, error: actionError } = await supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player["id" as any],
        fk_landid: player["landId" as any],
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ]);

  if (actionError) throw actionError;

  const { data: inventoryData, error: inventoryError } = await supabase
    .from("inventories")
    .update([
      {
        wood: inventory[0],
        rock: inventory[1],
        food: inventory[2],
        metal: inventory[3],
        coal: inventory[4],
        energy: inventory[5],
        coin: inventory[6],
        gold: inventory[7],
        freePop: inventory[8],
        totalPop: inventory[9],
        timeSpent: inventory[10],
        level: inventory[11],
      },
    ])
    .eq("fk_userid", player["id" as any]);

  if (inventoryError) throw inventoryError;
};

/**
 * repairAction
 * * Update after player built
 * @param player {[]} player information
 * @param entrypoint {string} in contract
 * @param calldata {string}
 * @param inventory {[]} updated player inventory
 * @return success
 */
// TODO translated fullMap into string and add in request
export const repairAction = async (
  player: any[],
  entrypoint: string,
  calldata: string,
  inventory: any,
  uid: number
) => {
  const { data: actionData, error: actionError } = await supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player["id" as any],
        fk_landid: player["landId" as any],
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ]);

  if (actionError) throw actionError;

  const { data: inventoryData, error: inventoryError } = await supabase
    .from("inventories")
    .update([
      {
        wood: inventory[0],
        rock: inventory[1],
        food: inventory[2],
        metal: inventory[3],
        coal: inventory[4],
        energy: inventory[5],
        coin: inventory[6],
        gold: inventory[7],
        freePop: inventory[8],
        totalPop: inventory[9],
        timeSpent: inventory[10],
        level: inventory[11],
      },
    ])
    .eq("fk_userid", player["id" as any]);

  if (inventoryError) throw inventoryError;

  // Update player_buildings
  const { data: buildingData, error: buildingError } = await supabase
    .from("player_buildings")
    .update([{ decay: 0 }])
    .match({
      fk_userid: player["id" as any],
      fk_landid: player["landId" as any],
      gameUid: uid,
    });

  if (buildingError) throw buildingError;
};

/**
 * destroyAction
 * * Update after player destroyed a building
 * @param player {[]} player information
 * @param entrypoint {string} in contract
 * @param calldata {string}
 * @param inventory {[]} updated player inventory
 * @return success
 */
// TODO translated fullMap into string and add in request
export const destroyAction = async (
  player: any[],
  entrypoint: string,
  calldata: string,
  inventory: any,
  uid: number
) => {
  const { data: actionData, error: actionError } = await supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player["id" as any],
        fk_landid: player["landId" as any],
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ]);

  if (actionError) throw actionError;

  const { data: inventoryData, error: inventoryError } = await supabase
    .from("inventories")
    .update([
      {
        wood: inventory[0],
        rock: inventory[1],
        food: inventory[2],
        metal: inventory[3],
        coal: inventory[4],
        energy: inventory[5],
        coin: inventory[6],
        gold: inventory[7],
        freePop: inventory[8],
        totalPop: inventory[9],
        timeSpent: inventory[10],
        level: inventory[11],
      },
    ])
    .eq("fk_userid", player["id" as any]);

  if (inventoryError) throw inventoryError;

  // Update player_buildings
  const { data: buildingData, error: buildingError } = await supabase
    .from("player_buildings")
    .update([{ isDestroyed: true }])
    .match({
      fk_userid: player["id" as any],
      fk_landid: player["landId" as any],
      gameUid: uid,
    });

  if (buildingError) throw buildingError;
};

/**
 * moveAction
 * * Update after player moved a building
 * @param player {[]} player information
 * @param entrypoint {string} in contract
 * @param calldata {string}
 * @param inventory {[]} updated player inventory
 * @return success
 */
// TODO translated fullMap into string and add in request
export const moveAction = async (
  player: any[],
  entrypoint: string,
  calldata: string,
  playerBuilding: any
) => {
  const { data: actionData, error: actionError } = await supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player["id" as any],
        fk_landid: player["landId" as any],
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ]);

  if (actionError) throw actionError;

  // Update player_buildings
  const { data: buildingData, error: buildingError } = await supabase
    .from("player_buildings")
    .update([
      {
        posX: playerBuilding.posX,
        posY: playerBuilding.posY,
        blockX: playerBuilding.blockX,
        blockY: playerBuilding.blockY,
      },
    ])
    .match({
      fk_userid: player["id" as any],
      fk_landid: player["landId" as any],
      gameUid: playerBuilding.gameUid,
    });

  if (buildingError) throw buildingError;

  // TODO update fullMap
};

// Move
// Claim
// Fuel Production
