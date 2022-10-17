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
    .select(`id, account, invZoom, tutorial, sound`)
    .eq("account", account)
    .single();

  return data;
}

/**
 * getLandInformation
 * * Fetch player information
 * @param account {string}
 * @return data {{}}
 */
export const getLandInformation = async (tokenId: string) => {
  const { data, error } = await supabase
    .from("lands_duplicate")
    .select(
      `id, tokenId, fullMap, isInit, biomeId, nbResourcesSpawned, nbResourcesLeft, nbBuildings, 
      inventories_duplicate(fk_landid, id, wood, rock, food, coal, metal, energy, coin, gold, freePop, totalPop, level, timeSpent),
      player_buildings_duplicate(fk_buildingid, posX, posY, blockX, blockY, decay, gameUid, isDestroyed),
      player_actions(fk_landid, id, entrypoint, calldata)
    `
    )
    .eq("tokenId", tokenId)
    .eq("player_buildings_duplicate.isDestroyed", false)
    .single();

  return data;
};

/**
 * getLandByTokenId
 * * Fetch lands information by tokenId
 * @param tokenIds {[]} array of tokenIds
 * @return data {{}}
 */
export const getLandByTokenId = async (tokenIds: any[]) => {
  let query = supabase
    .from("lands_duplicate")
    .select(`id, tokenId, biomeId, isInit`);

  let str = "";
  tokenIds.map((id: number) => {
    if (str != "") str += ",";
    str += "tokenId.eq." + id;
  });
  console.log("str query", str);

  query = query.or(str);

  const { data, error } = await query;
  if (error) throw error;

  return data;
};

/**
 * initGame
 * * Init player land
 * @param account {string} account initializing game
 * @param landId {string} land id
 * @return data {{}}
 */
export const initGame = async (landId: string) => {
  const { data: inventoryData, error: inventoryError } = await supabase
    .from("inventories_duplicate")
    .insert([
      {
        fk_landid: landId,
      },
    ]);
  if (inventoryError) throw inventoryError;
  console.log("inventory", inventoryData);

  const { data: buildingData, error: buildingError } = await supabase
    .from("player_buildings_duplicate")
    .insert([
      {
        fk_landid: landId,
        fk_buildingid: 1,
        gameUid: 1,
        posX: 1.2,
        posY: 1.2,
        blockX: 11,
        blockY: 8,
        decay: 100,
        unitTimeCreatedAt: 0,
      },
    ]);
  if (buildingError) throw buildingError;

  // update init land
  const { data: landData, error: landError } = await supabase
    .from("lands_duplicate")
    .update({ isInit: true })
    .eq("id", landId)
    .select();

  if (landError) throw landError;
};

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
 * @param mapComposed {string} full map composed into string
 * @return success
 */
export const buildAction = async (
  player: any[],
  entrypoint: string,
  calldata: string,
  inventory: any,
  newBuilding: any,
  mapComposed: string
) => {
  const { data: landData, error: landError } = await supabase
    .from("lands_duplicate")
    .update([{ fullMap: mapComposed }])
    .eq("id", player["landId" as any]);
  if (landError) throw landError;

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
    .from("inventories_duplicate")
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
    .eq("fk_landid", player["landId" as any]);

  if (inventoryError) throw inventoryError;

  // Create entry in db player_buildings
  const { data: buildingData, error: buildingError } = await supabase
    .from("player_buildings_duplicate")
    .insert([
      {
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
 * @param mapComposed {string} full map composed into string
 * @return success
 */
export const harvestAction = async (
  player: any[],
  entrypoint: string,
  calldata: string,
  inventory: any,
  mapComposed: string
) => {
  const { data: landData, error: landError } = await supabase
    .from("lands_duplicate")
    .update([{ fullMap: mapComposed }])
    .eq("id", player["landId" as any]);
  if (landError) throw landError;

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
    .from("inventories_duplicate")
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
    .eq("fk_landid", player["landId" as any]);

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
    .from("inventories_duplicate")
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
    .eq("fk_landid", player["landId" as any]);

  if (inventoryError) throw inventoryError;

  // Update player_buildings
  const { data: buildingData, error: buildingError } = await supabase
    .from("player_buildings_duplicate")
    .update([{ decay: 0 }])
    .match({
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
 * @param mapComposed {string}
 * @return success
 */
export const destroyAction = async (
  player: any[],
  entrypoint: string,
  calldata: string,
  inventory: any,
  uid: number,
  mapComposed: string
) => {
  const { data: landData, error: landError } = await supabase
    .from("lands_duplicate")
    .update([{ fullMap: mapComposed }])
    .eq("id", player["landId" as any]);
  if (landError) throw landError;

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
    .from("inventories_duplicate")
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
    .eq("fk_landid", player["landId" as any]);

  if (inventoryError) throw inventoryError;

  // Update player_buildings
  const { data: buildingData, error: buildingError } = await supabase
    .from("player_buildings_duplicate")
    .update([{ isDestroyed: true }])
    .match({
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
 * @param mapComposed {string}
 * @return success
 */
export const moveAction = async (
  player: any[],
  entrypoint: string,
  calldata: string,
  playerBuilding: any,
  mapComposed: string
) => {
  const { data: landData, error: landError } = await supabase
    .from("lands_duplicate")
    .update([{ fullMap: mapComposed }])
    .eq("id", player["landId" as any]);
  if (landError) throw landError;

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
    .from("player_buildings_duplicate")
    .update([
      {
        posX: playerBuilding.posX,
        posY: playerBuilding.posY,
        blockX: playerBuilding.blockX,
        blockY: playerBuilding.blockY,
      },
    ])
    .match({
      fk_landid: player["landId" as any],
      gameUid: playerBuilding.gameUid,
    });
  if (buildingError) throw buildingError;
};

// Move
// Claim
// Fuel Production
