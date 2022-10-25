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

  if (error) throw error;

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
    .from("lands")
    .select(
      `id, tokenId, fullMap, isInit, biomeId, nbResourcesSpawned, claimRegister, cycleRegister, timestampCheck,
      inventories(fk_landid, id, wood, rock, food, coal, metal, energy, coin, gold, freePop, totalPop, level, timeSpent, incomingInventories),
      player_buildings(fk_buildingid, id, posX, posY, blockX, blockY, decay, gameUid, isDestroyed),
      player_actions(fk_landid, id, entrypoint, calldata, status, txHash, validated)
    `
    )
    .eq("tokenId", tokenId)
    .eq("player_buildings.isDestroyed", false)
    .eq("player_actions.validated", false)
    .order("created_at", { foreignTable: "player_actions", ascending: true })
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
  let query = _supabase.from("lands").select(`id, tokenId, biomeId, isInit`);

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
    .from("inventories")
    .insert([
      {
        fk_landid: landId,
      },
    ]);
  if (inventoryError) throw inventoryError;
  console.log("inventory", inventoryData);

  const { data: buildingData, error: buildingError } = await _supabase
    .from("player_buildings")
    .insert([
      {
        fk_landid: landId,
        fk_buildingid: 1,
        gameUid: 1,
        posX: 1.2,
        posY: 1.2,
        blockX: 20,
        blockY: 8,
        decay: 100,
        unitTimeCreatedAt: 0,
      },
    ]);
  if (buildingError) throw buildingError;

  // update init land
  const { data: landData, error: landError } = await _supabase
    .from("lands")
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
  player: any,
  entrypoint: string,
  calldata: string
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: actionData, error: actionError } = await _supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player.id,
        fk_landid: player.landId,
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
  player: any,
  entrypoint: string,
  calldata: string,
  inventory: any,
  newBuilding: any,
  mapComposed: string
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: landData, error: landError } = await _supabase
    .from("lands")
    .update([{ fullMap: mapComposed }])
    .eq("id", player.landId);
  if (landError) throw landError;

  const { data: actionData, error: actionError } = await _supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player.id,
        fk_landid: player.landId,
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ])
    .select();

  if (actionError) throw actionError;

  const { data: inventoryData, error: inventoryError } = await _supabase
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
    .eq("fk_landid", player.landId);

  if (inventoryError) throw inventoryError;

  // Create entry in db player_buildings
  const { data: buildingData, error: buildingError } = await _supabase
    .from("player_buildings")
    .insert([
      {
        fk_landid: player.landId,
        fk_buildingid: newBuilding["type"],
        gameUid: newBuilding["gameUid"],
        posX: newBuilding["posX"],
        posY: newBuilding["posY"],
        blockX: newBuilding["blockX"],
        blockY: newBuilding["blockY"],
      },
    ]);

  if (buildingError) throw buildingError;

  return actionData;
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
  player: any,
  entrypoint: string,
  calldata: string,
  inventory: any,
  mapComposed: string,
  incomingInventories: string
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: landData, error: landError } = await _supabase
    .from("lands")
    .update([{ fullMap: mapComposed }])
    .eq("id", player.landId);
  if (landError) throw landError;

  const { data: inventoryData, error: inventoryError } = await _supabase
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
        incomingInventories: incomingInventories,
      },
    ])
    .eq("fk_landid", player.landId);

  if (inventoryError) throw inventoryError;

  const { data: actionData, error: actionError } = await _supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player.id,
        fk_landid: player.landId,
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ])
    .select();

  if (actionError) throw actionError;
  return actionData;
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
  player: any,
  entrypoint: string,
  calldata: string,
  inventory: any,
  uid: number
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: inventoryData, error: inventoryError } = await _supabase
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
    .eq("fk_landid", player.landId);

  if (inventoryError) throw inventoryError;

  // Update player_buildings
  const { data: buildingData, error: buildingError } = await _supabase
    .from("player_buildings")
    .update([{ decay: 0 }])
    .match({
      fk_landid: player.landId,
      gameUid: uid,
    });

  if (buildingError) throw buildingError;

  const { data: actionData, error: actionError } = await _supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player.id,
        fk_landid: player.landId,
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ])
    .select();

  if (actionError) throw actionError;
  return actionData;
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
  player: any,
  entrypoint: string,
  calldata: string,
  inventory: any,
  uid: number,
  mapComposed: string
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: landData, error: landError } = await _supabase
    .from("lands")
    .update([{ fullMap: mapComposed }])
    .eq("id", player.landId);
  if (landError) throw landError;

  const { data: inventoryData, error: inventoryError } = await _supabase
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
    .eq("fk_landid", player.landId);

  if (inventoryError) throw inventoryError;

  // Update player_buildings
  const { data: buildingData, error: buildingError } = await _supabase
    .from("player_buildings")
    .update([{ isDestroyed: true }])
    .match({
      fk_landid: player.landId,
      gameUid: uid,
    });

  if (buildingError) throw buildingError;

  const { data: actionData, error: actionError } = await _supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player.id,
        fk_landid: player.landId,
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ])
    .select();

  if (actionError) throw actionError;
  return actionData;
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
  player: any,
  entrypoint: string,
  calldata: string,
  playerBuilding: any,
  mapComposed: string
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: landData, error: landError } = await _supabase
    .from("lands")
    .update([{ fullMap: mapComposed }])
    .eq("id", player.landId);
  if (landError) throw landError;

  // Update player_buildings
  const { data: buildingData, error: buildingError } = await _supabase
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
      fk_landid: player.landId,
      gameUid: playerBuilding.gameUid,
    });
  if (buildingError) throw buildingError;

  const { data: actionData, error: actionError } = await _supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player.id,
        fk_landid: player.landId,
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ])
    .select();
  if (actionError) throw actionError;

  return actionData;
};

/**
 * updateIncomingInventories
 * * Update incomingInventories in player inventory once an action has bee
 * @param player {[]} player information
 * @param incomingInventories {string}
 */
export const updateIncomingInventories = async (
  player: any,
  incomingInventories: string
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);
  const { data: inventoryData, error: inventoryError } = await _supabase
    .from("inventories")
    .update([
      {
        incomingInventories: incomingInventories,
      },
    ])
    .eq("fk_landid", player.landId);
  if (inventoryError) throw inventoryError;
};

/**
 * bulkUpdateActions
 * * Update incomingInventories in player inventory once an action has bee
 * @param player {[]} player information
 * @param actionsArr {[]}
 */
export const bulkUpdateActions = async (player: any, actionsArr: any[]) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);

  var actionsQuery: any[] = [];
  actionsArr.map((action: any) => {
    actionsQuery.push({
      id: action.id,
      fk_userid: player.id,
      validated: action.validated,
      txHash: action.txHash,
      status: action.status,
    });
  });

  console.log("actionsQuery", actionsQuery);

  const { data: actionData, error: actionError } = await _supabase
    .from("player_actions")
    .upsert(actionsQuery)
    .match({
      fk_landid: player.landId,
      fk_userid: player.id,
    });

  if (actionError) throw actionError;
};

/**
 * reinitLand
 * * Reinit player land
 * @param player {[]} player information
 * @param playerBuildings {[]} array of building of player
 * @param actionsArr {[]}
 */
export const reinitLand = async (
  player: any,
  txData: any,
  hasStarted: boolean
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);

  // reinit inventory
  const { data: inventoryData, error: inventoryError } = await _supabase
    .from("inventories")
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
      },
    ])
    .eq("fk_landid", player.landId);
  if (inventoryError) throw inventoryError;
  console.log("inventory", inventoryData);

  // update init land
  const { data: landData, error: landError } = await _supabase
    .from("lands")
    .update({
      fullMap: initMap,
      claimRegister: null,
      cycleRegister: null,
      nbResourcesSpawned: 196,
    })
    .eq("id", player.landId)
    .select();
  if (landError) throw landError;

  // update cabin
  const { data: buildingData, error: buildingError } = await _supabase
    .from("player_buildings")
    .update([
      {
        posX: 1.2,
        posY: 1.2,
        blockX: 20,
        blockY: 8,
        decay: 100,
        unitTimeCreatedAt: 0,
      },
    ])
    .match({
      fk_landid: player.landId,
      fk_buildingid: 1,
      gameUid: 1,
    });
  if (buildingError) throw buildingError;

  // Pass all buildings to destroyed
  const { data: buildingDestroyedData, error: buildingDestroyedError } =
    await _supabase
      .from("player_buildings")
      .update([{ isDestroyed: true }])
      .match({
        fk_landid: player.landId,
      })
      .neq("gameUid", 1);
  if (buildingDestroyedError) throw buildingDestroyedError;

  // Delete actions that are not validated onchain
  const { data: destroyData, error: destroyError } = await _supabase
    .from("player_actions")
    .delete()
    .eq("fk_landid", player.landId)
    .eq("validated", false)
    .neq("entrypoint", "start_game");
  if (destroyError) throw destroyError;

  if (hasStarted) {
    const { data: actionReinitData, error: actionReinitError } = await _supabase
      .from("player_actions")
      .insert({
        fk_userid: player.id,
        fk_landid: player.landId,
        entrypoint: "reinit_game",
        calldata: player.tokenId + "|0",
        validated: false,
        txHash: txData.transaction_hash,
        status: txData.code,
      })
      .select();
    if (actionReinitError) throw actionReinitError;
  }
};

/**
 * fuelProdQuery
 * * Fuel production of a building
 * @param player {[]} player information
 * @param inventory {[]} player inventory
 * @param entrypoint {string}
 * @param calldata {string}
 */
export const fuelProdQuery = async (
  player: any,
  inventory: any[],
  entrypoint: string,
  calldata: string
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);

  const { data: inventoryData, error: inventoryError } = await _supabase
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
    .eq("fk_landid", player.landId);
  if (inventoryError) throw inventoryError;

  const { data: actionData, error: actionError } = await _supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player.id,
        fk_landid: player.landId,
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ])
    .select();

  if (actionError) throw actionError;
  return actionData;
};

/**
 * fuelProdEffective
 * * Fuel production of a building after tx was accepted onchain
 * @param player {[]} player information
 * @param playerBuilding {[]} array of building of player that were recharged
 * @param playerAction {[]} array of player actions that were juste validated onchain
 */
export const fuelProdEffective = async (
  player: any,
  actionsArr: any,
  cycleRegisterStr: any
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);

  if (actionsArr.length > 0) {
    var actionsQuery: any[] = [];
    actionsArr.map((action: any) => {
      actionsQuery.push({
        id: action.id,
        fk_userid: player.id,
        validated: action.validated,
        txHash: action.transaction_hash,
        status: action.status,
      });
    });

    const { data: actionData, error: actionError } = await _supabase
      .from("player_actions")
      .upsert(actionsQuery)
      .match({
        fk_landid: player.landId,
        fk_userid: player.id,
      });

    if (actionError) throw actionError;
  }

  // update le building rechargé
  if (cycleRegisterStr) {
    const { data: buildingData, error: buildingError } = await _supabase
      .from("lands")
      .update({ cycleRegister: cycleRegisterStr })
      .eq("id", player.landId);
    if (buildingError) throw buildingError;
  }
};

/**
 * claimResourcesQuery
 * * Claim building production
 * @param player {[]} player information
 * @param inventory {[]} updated player inventory
 * @param claimRegister {string} string composed with block number of claims
 * @param entrypoint {string}
 * @param calldata {string}
 * @return actionData {[]} action info stored in DB
 */
export const claimResourcesQuery = async (
  player: any,
  inventory: any[],
  claimRegister: any,
  entrypoint: string,
  calldata: string
) => {
  const _supabase = createSupabase(localStorage.getItem("user") as string);

  // update claimRegister
  const { data: buildingData, error: buildingError } = await _supabase
    .from("lands")
    .update({ claimRegister: claimRegister })
    .eq("id", player.landId);
  if (buildingError) throw buildingError;

  // update inventory
  const { data: inventoryData, error: inventoryError } = await _supabase
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
      },
    ])
    .eq("fk_landid", player.landId);
  if (inventoryError) throw inventoryError;

  // Insert new action
  const { data: actionData, error: actionError } = await _supabase
    .from("player_actions")
    .insert([
      {
        fk_userid: player.id,
        fk_landid: player.landId,
        entrypoint: entrypoint,
        calldata: calldata,
        validated: false,
      },
    ])
    .select();
  if (actionError) throw actionError;
  return actionData;
};
