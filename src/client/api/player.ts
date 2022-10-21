import { createSupabase } from "../supabaseClient";
import { initMap } from "../utils/constant";

/**
 * getPlayer
 * * Fetch player information
 * @param account {string}
 * @return data {{}}
 */
export default async function getPlayer(account: string) {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data, error } = await _supabase
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
  const _supabase = createSupabase(localStorage.getItem("user") as string);

  const { data, error } = await _supabase
    .from("lands_duplicate")
    .select(
      `id, tokenId, fullMap, isInit, biomeId, nbResourcesSpawned, claimRegister, cycleRegister, 
      inventories_duplicate(fk_landid, id, wood, rock, food, coal, metal, energy, coin, gold, freePop, totalPop, level, timeSpent, incomingInventories),
      player_buildings_duplicate(fk_buildingid, posX, posY, blockX, blockY, decay, gameUid, isDestroyed),
      player_actions(fk_landid, id, entrypoint, calldata, status, txHash, validated)
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
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  let query = _supabase
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
export const initGame = async (
  userId: string,
  landId: string,
  biomeId: string,
  tokenId: number,
  txInfo: any
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: inventoryData, error: inventoryError } = await _supabase
    .from("inventories_duplicate")
    .insert([
      {
        fk_landid: landId,
      },
    ]);
  if (inventoryError) throw inventoryError;
  console.log("inventory", inventoryData);

  const { data: buildingData, error: buildingError } = await _supabase
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
  const { data: landData, error: landError } = await _supabase
    .from("lands_duplicate")
    .update({ isInit: true })
    .eq("id", landId)
    .select();

  if (landError) throw landError;

  // Add action start game in db
  const { data: actionData, error: actionError } = await _supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: userId,
        fk_landid: landId,
        entrypoint: "start_game",
        calldata: tokenId + "|0|" + biomeId,
        validated: false,
        txHash: txInfo.transaction_hash,
        status: txInfo.code,
      },
    ])
    .select();
  console.log("actionData", actionData);

  if (actionError) throw actionError;
  return actionData;
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
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: actionData, error: actionError } = await _supabase
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
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: settingData, error: settingError } = await _supabase
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
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: settingData, error: settingError } = await _supabase
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
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: landData, error: landError } = await _supabase
    .from("lands_duplicate")
    .update([{ fullMap: mapComposed }])
    .eq("id", player["landId" as any]);
  if (landError) throw landError;

  const { data: actionData, error: actionError } = await _supabase
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

  const { data: inventoryData, error: inventoryError } = await _supabase
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
  const { data: buildingData, error: buildingError } = await _supabase
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
 * @param incomingInventories {string}
 * @return success
 */
export const harvestAction = async (
  player: any[],
  entrypoint: string,
  calldata: string,
  inventory: any,
  mapComposed: string,
  incomingInventories: string
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: landData, error: landError } = await _supabase
    .from("lands_duplicate")
    .update([{ fullMap: mapComposed }])
    .eq("id", player["landId" as any]);
  if (landError) throw landError;

  const { data: actionData, error: actionError } = await _supabase
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

  const { data: inventoryData, error: inventoryError } = await _supabase
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
        incomingInventories: incomingInventories,
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
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: actionData, error: actionError } = await _supabase
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

  const { data: inventoryData, error: inventoryError } = await _supabase
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
  const { data: buildingData, error: buildingError } = await _supabase
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
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: landData, error: landError } = await _supabase
    .from("lands_duplicate")
    .update([{ fullMap: mapComposed }])
    .eq("id", player["landId" as any]);
  if (landError) throw landError;

  const { data: actionData, error: actionError } = await _supabase
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

  const { data: inventoryData, error: inventoryError } = await _supabase
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
  const { data: buildingData, error: buildingError } = await _supabase
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
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: landData, error: landError } = await _supabase
    .from("lands_duplicate")
    .update([{ fullMap: mapComposed }])
    .eq("id", player["landId" as any]);
  if (landError) throw landError;

  const { data: actionData, error: actionError } = await _supabase
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
  const { data: buildingData, error: buildingError } = await _supabase
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

/**
 * updateIncomingInventories
 * * Update incomingInventories in player inventory once an action has bee
 * @param player {[]} player information
 * @param incomingInventories {string}
 */
export const updateIncomingInventories = async (
  player: any[],
  incomingInventories: string
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: inventoryData, error: inventoryError } = await _supabase
    .from("inventories_duplicate")
    .update([
      {
        incomingInventories: incomingInventories,
      },
    ])
    .eq("fk_landid", player["landId" as any]);
  if (inventoryError) throw inventoryError;
};

/**
 * bulkUpdateActions
 * * Update incomingInventories in player inventory once an action has bee
 * @param player {[]} player information
 * @param actionsArr {[]}
 */
export const bulkUpdateActions = async (player: any[], actionsArr: any[]) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);

  var actionsQuery: any[] = [];
  actionsArr.map((action: any) => {
    // if (action.id == 0) {
    //   const {data : test, error: errortest} = await _supabase.from('player_ac')
    // }
    actionsQuery.push({
      id: action.id,
      fk_userid: player["id" as any],
      validated: action.validated,
      txHash: action.transaction_hash,
      status: action.status,
    });
  });

  const { data: actionData, error: actionError } = await _supabase
    .from("player_actions")
    .upsert(actionsQuery)
    .match({
      fk_landid: player["landId" as any],
      fk_userid: player["id" as any],
    });

  if (actionError) throw actionError;
};

/**
 * reinitLand
 * * Update incomingInventories in player inventory once an action has bee
 * @param player {[]} player information
 * @param actionsArr {[]}
 */
export const reinitLand = async (player: any[], playerBuildings: any[]) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);

  const { data: inventoryData, error: inventoryError } = await _supabase
    .from("inventories_duplicate")
    .update([
      {
        wood: 0,
        rock: 0,
        food: 20,
        metal: 0,
        coal: 0,
        gold: 0,
        energy: 0,
        coin: 0,
        totalPop: 1,
        freePop: 1,
        level: 1,
        timeSpent: 0,
        incomingInventories: "",
        claimRegister: "",
      },
    ])
    .eq("fk_landid", player["landId" as any]);
  if (inventoryError) throw inventoryError;
  console.log("inventory", inventoryData);

  const { data: buildingData, error: buildingError } = await _supabase
    .from("player_buildings_duplicate")
    .update([
      {
        posX: 1.2,
        posY: 1.2,
        blockX: 11,
        blockY: 8,
        decay: 100,
        unitTimeCreatedAt: 0,
      },
    ])
    .match({
      fk_landid: player["landId" as any],
      fk_buildingid: 1,
      gameUid: 1,
    });
  if (buildingError) throw buildingError;

  // TODO delete all buildings that are not cabin

  // update init land
  const { data: landData, error: landError } = await _supabase
    .from("lands_duplicate")
    .update({ fullMap: initMap })
    .eq("id", player["landId" as any])
    .select();

  if (landError) throw landError;

  // Delete actions that are not validated onchain
  const { data: destroyData, error: destroyError } = await _supabase
    .from("player_actions")
    .delete()
    .match({
      id: player["landId" as any],
      validated: false,
    });

  if (destroyError) throw destroyError;

  // Add action of reinit land in db w/ tx Hash received in args

  // Update inventory
  // Player buildings :
  // Update cabin w/ decay to 0 and posX posY
  // Delete all other player_buildings
  // Lands : reupdate the fullMap to start and resources to total
  // Delete all actions not sent onchain
  // Add reinit action in DB
  //

  // var buildingsToDestroy : any[] = []
  // actionsArr.map((action: any) => {
  //   actionsQuery.push({"id": action.id, "fk_userid": player['id' as any], "validated": action.validated, "txHash": action.transaction_hash, "status": action.status })
  // })

  // const { data: actionData, error: actionError } = await _supabase
  //     .from("player_actions")
  //     .upsert(actionsQuery)
  //     .match(
  //       {
  //         fk_landid: player["landId" as any],
  //         fk_userid: player["id" as any]
  //       }
  //     )

  // if (actionError) throw actionError;
};

// Move
// Claim
// Fuel Production
