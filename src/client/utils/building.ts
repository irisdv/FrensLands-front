// COMPOSITIOM
// resource_type : 1        [resources,buildings,roads,decoration]
// resource_type_id : 2     [type of resources]
// resource_uid : 4         [ID]
// level : 1                [STATE]
// mat_type : 1             [block mat type]
// fertility: 2

// FUNCTION TO DO

// ||||||-  enough to harvest : resources / population (type of resource spawned)
// ||||||- enough to build : resources / population (type of building)
// ||||||- enough to repair
// ||||||- get resource / population back from destroying (type of building) ---> unsigned_div_rem keep just quotient | full pop
// ||||||- enough to fuel production of one building (type of building)
// ||||||- calculate total claimable resources ()
// ||||||- can move an infrastructure (is movable, destination block is empty)
// ||||||- make array of fix building values
// ||||||- make array of fix resources values
// ||||||- create building
// ||||||- repair building
// ||||||- maintain building
// ||||||- destroy building
// ||||||- harvest resources
// - receive resources from harvest (with timer)  ----> Need to create a Special Incoming array (checked often)
// - levelManagement (increase/decrease)
// - REV_cancelCreate
// - REV_cancelHarvest
// - REV_cancelRepair
// - REV_cancelMaintain
// - REV_cancelMove

/**
 * checkResHarvest
 *  * Check if a resource spawned can be harvested by a player
 * @param id {number} type id of resource to harvest
 * @param inventory {[]} player inventory
 * @param fixResVal {[]} resources spawned static data
 * @return success {number} 0 or 1
 */
export const checkResHarvest = (id: number, inventory: any, fixResVal: any) => {
  let i: number = 0;

  while (i < fixResVal[id].harvestCost) {
    if (inventory[i] < fixResVal[id].harvestCost[i]) {
      console.log("not enough resources to harvest ", id);
      return 0;
    }
    i++;
  }
  console.log("enough resources to harvest ", id);
  return 1;
};

/**
 * checkResHarvestMsg
 *  * Check if a resource spawned can be harvested by a player and returns resources lacking
 * @param id {number} type id of resource to harvest
 * @param inventory {[]} player inventory
 * @param fixResVal {[]} resources spawned static data
 * @return res {[]} array of resources lacking
 */
export const checkResHarvestMsg = (
  id: number,
  inventory: any,
  fixResVal: any
) => {
  let i: number = 0;
  const res: any = [];

  // while (i < fixResVal[id].harvestCost) {
  while (i < 9) {
    if (inventory[i] < fixResVal[id].harvestCost[i]) {
      console.log("not enough resources to harvest ", i);
      res.push(i);
    }
    i++;
  }
  console.log("lacking resources to harvest ", res);
  return res;
};

/**
 * checkResMaintain
 *  * Checks if a player can pay production cost of a given building
 * @param id {number} type id of building to maintain
 * @param inventory {[]} player inventory
 * @param fixBuildVal {[]} building static data
 * @return success {number} 0 or 1
 */
export const checkResMaintain = (
  id: number,
  inventory: any,
  fixBuildVal: any
) => {
  const i: number = 0;

  while (i < fixBuildVal[id].maintainCost.length) {
    if (inventory[i] < fixBuildVal[id].maintainCost[i]) {
      console.log("not enough resources to maintain ", id);
      return 0;
    }
  }
  console.log("enough resources to maintain ", id);
  return 1;
};

/**
 * checkResMaintainMsg
 *  * Checks if a player can pay production cost of a given building and returns resources lacking
 * @param id {number} type id of building to maintain
 * @param inventory {[]} player inventory
 * @param fixBuildVal {[]} building static data
 * @return res {[]} array of resources lacking
 */
export const checkResMaintainMsg = (
  id: number,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;
  const res: any = [];

  // while (i < fixBuildVal[id].maintainCost.length) {
  while (i < 9) {
    if (inventory[i] < fixBuildVal[id].maintainCost[i]) {
      console.log("not enough resources to maintain ", i);
      res.push(i);
    }
    i++;
  }
  console.log("enough resources to maintain ", res);
  return res;
};

/**
 * checkResBuild
 *  * Checks if a player has enough resources to build
 * @param id {number} type id of building to build
 * @param inventory {[]} player inventory
 * @param fixBuildVal {[]} building static data
 * @return success {number} 0 or 1
 */
export const checkResBuild = (id: number, inventory: any, fixBuildVal: any) => {
  let i: number = 0;

  while (i < fixBuildVal[id].createCost.length) {
    if (i == 8) {
      if (inventory[i] - fixBuildVal[id].createCost[i] < 1) {
        console.log("not enough resources to build ", id);
        return 0;
      }
    } else if (inventory[i] < fixBuildVal[id].createCost[i]) {
      console.log("not enough resources to build ", id);
      return 0;
    }
    i++;
  }
  console.log("enough resources to build ", id);
  return 1;
};

/**
 * checkResBuildMsg
 *  * Checks if a player has enough resources to build and returns resources lacking
 * @param id {number} type id of building to build
 * @param inventory {[]} player inventory
 * @param fixBuildVal {[]} building static data
 * @return res {[]} array of resources lacking
 */
export const checkResBuildMsg = (
  id: number,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;
  const res: any = [];

  // while (i < fixBuildVal[id].createCost.length) {
  while (i < 9) {
    if (i == 8) {
      if (inventory[i] - fixBuildVal[id].createCost[i] < 1) {
        res.push(i);
        console.log("not enough resources to build ", i);
      }
    } else if (inventory[i] < fixBuildVal[id].createCost[i]) {
      console.log("not enough resources to build ", i);
      res.push(i);
    }
    i++;
  }
  console.log("missing resources to build", res);
  return res;
};

/**
 * checkResRepair
 *  * Checks if a player has enough resources to repair a building
 * @param id {number} type id of building to repair
 * @param inventory {[]} player inventory
 * @param fixBuildVal {[]} building static data
 * @return success {number} 0 or 1
 */
export const checkResRepair = (
  id: number,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;

  while (i < fixBuildVal[id].repairCost.length) {
    if (inventory[i] < fixBuildVal[id].repairCost[i]) {
      console.log("not enough resources to repair ", id);
      return 0;
    }
    i++;
  }
  console.log("enough resources to repair ", id);
  return 1;
};

/**
 * checkResRepairMsg
 *  * Checks if a player has enough resources to repair a building and returns resources lacking
 * @param id {number} type id of building to repair
 * @param inventory {[]} player inventory
 * @param fixBuildVal {[]} building static data
 * @return res {[]} array of resources lacking
 */
export const checkResRepairMsg = (
  id: number,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;
  const res: any = [];

  // while (i < fixBuildVal[id].repairCost.length) {
  while (i < 9) {
    if (inventory[i] < fixBuildVal[id].repairCost[i]) {
      console.log("not enough resources to repair ", i);
      // return 0;
      res.push(i);
    }
    i++;
  }
  console.log("enough resources to repair ", res);
  // return 1;
  return res;
};

/**
 * checkIsMovable
 *  * Checks if a player can move a building
 * @param id {number} type id of building to move
 * @param fixBuildVal {[]} building static data
 * @return success {number} 0 or 1
 */
export const checkIsMovable = (id: number, fixBuildVal: any) => {
  if (fixBuildVal[id].canMove == true) {
    return 1;
  } else {
    return 0;
  }
};

/**
 * claim
 *  * Claim resources from production
 *  TODO calculate nb blocks + return multiple values
 * @param id {number} type id of building to move
 * @param fixBuildVal {[]} building static data
 * @return success {number} 0 or 1
 */
export const claim = (
  mapBuildingArray: any,
  fixBuildVal: any,
  inventory: any
) => {
  let i: number = 0;
  let j: number = 0;
  const cycles: number = 1;

  // CALCULATE THE NUMBER OF CYCLES

  while (i < mapBuildingArray.length) {
    while (j < fixBuildVal[mapBuildingArray[i].id].production.length) {
      inventory[j] +=
        fixBuildVal[mapBuildingArray[i].id].production[j] * cycles;
      j++;
    }
    j = 0;
    i++;
  }
  // NEED TO RETURN MAPBUILDINGARRAY TOO WITH THE LAST CLAIMED BLOCK UPDATED
  return inventory;
};

/**
 * createBuildingPay
 *  * spend resources to build
 *  TODO return multiple values + link to positions
 * @param id {number} type id of building to move
 * @param mapBuildingArray {[]} player buildings
 * @param inventory {[]} player inventory
 * @param fixBuildVal {[]} building static data
 * ? return an array : [inventory, mapBuildingArray]
 * @return inventory & mapBuildingArray updated
 */
export const createBuildingPay = (
  id: number,
  mapBuildingArray: any,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;

  while (i < fixBuildVal[id].createCost) {
    inventory[i] -= fixBuildVal[id].createCost[i];
    i++;
  }
  mapBuildingArray = addToBuildingArray(mapBuildingArray, id, 0, 0, 0, 0);
  // NEED TO RETURN MAPBUILDINGARRAY AND CONNECT THE POSITIONS
  return inventory;
};

/**
 * addToBuildingArray
 * * Add a new building to player array
 * TODO need to test it it's [mapBuildingArray.length + 1]
 * @param mapBuildingArray {[]}
 * @param id {number}
 * @param posX {number}
 * @param posY {number}
 * @param blockX {number}
 * @param blockY {number}
 * @return mapBuildingArray {[]} updated
 */
export const addToBuildingArray = (
  mapBuildingArray: any,
  id: number,
  posX: number,
  posY: number,
  blockX: number,
  blockY: number
) => {
  // NEED TO TEST IF IT's LIKE THIS OR [mapBuildingArray.length + 1]
  mapBuildingArray[mapBuildingArray.length] = [];
  mapBuildingArray[mapBuildingArray.length].id = id;
  mapBuildingArray[mapBuildingArray.length].posX = posX;
  mapBuildingArray[mapBuildingArray.length].posY = posY;
  mapBuildingArray[mapBuildingArray.length].blockX = blockX;
  mapBuildingArray[mapBuildingArray.length].blockY = blockY;

  return mapBuildingArray;
};

/**
 * deleteFromBuildingArray
 * * Delete a building from player's building array
 * ? check right way to delete an element
 * @param mapBuildingArray {[]}
 * @param uid {number} uid of building to destroy
 * @return mapBuildingArray {[]} updated
 */
export const deleteFromBuildingArray = (mapBuildingArray: any, uid: number) => {
  // RIGHT WAY TO DELETE AN ELEMENT ?
  const temp: any[] = [];
  mapBuildingArray[uid] = temp;

  return mapBuildingArray;
};

/**
 * destroyBuilding
 * * Delete a building from player's building array
 * ? check right way to delete an element
 * @param uid {[]}
 * @param id {[]}
 * @param mapBuildingArray {[]}
 * @param uid {number} uid of building to destroy
 * ? return array w/ [inventory, mapBuildingArray]
 * @return inventory {[]} updated
 */
export const destroyBuilding = (
  uid: number,
  id: number,
  mapBuildingArray: any,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;
  // NEED TO DO THE SPECIAL DIVISION LIKE IT IS ON CHAIN
  // get quotient & reste from createCost / 2
  // give back quotient to player
  while (i < fixBuildVal[id].createCost) {
    inventory[i] += fixBuildVal[id].createCost[i];
    i++;
  }
  mapBuildingArray = deleteFromBuildingArray(mapBuildingArray, uid);
  // NEED TO RETURN MAPBUILDINGARRAY AS WELL
  return inventory;
};

export const repairBuildingPay = (
  id: number,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;

  while (i < fixBuildVal[id].repairCost) {
    inventory[i] -= fixBuildVal[id].repairCost[i];
    i++;
  }
  return inventory;
};

export const maintainBuildingPay = (
  id: number,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;

  while (i < fixBuildVal[id].maintainCost) {
    inventory[i] -= fixBuildVal[id].maintainCost[i];
    i++;
  }
  return inventory;
};

/**
 * harvestResPay
 * * Pay resources when harvesting
 * ? check right way to delete an element
 * @param id {number} type id of resource harvested
 * @param uid {[]} unique id of resource harvested
 * @param inventory {[]} player inventory
 * @param fixResVal {[]} resources static data
 * @param harvestIncoming {[]} array of resource currently harvested by player
 * @return inventory {[]} updated player inventory
 */
export const harvestResPay = (
  id: number,
  // uid: number,
  inventory: any,
  fixResVal: any
  // harvestIncoming: any
) => {
  let i: number = 0;

  // while (i < fixResVal[id].harvestCost.length) {
  while (i < 8) {
    inventory[i] -= fixResVal[id].harvestCost[i];
    i++;
  }
  // addToHarvestArray(id, uid, harvestIncoming);
  console.log("inventory after loop", inventory);
  return inventory;
};

/**
 * addToHarvestArray
 * * Updated array of resource currently harvested by player
 * @param id {number} type id of resource harvested
 * @param uid {numer} unique id of resource harvested
 * @param harvestIncoming {[]} current harvestIncoming
 * @return harvestIncoming {[]} updated harvestIncoming array
 */
export const addToHarvestArray = (
  id: number,
  uid: number,
  harvestIncoming: any
) => {
  harvestIncoming[harvestIncoming.length] = [];
  harvestIncoming[harvestIncoming.length].uid = uid;
  harvestIncoming[harvestIncoming.length].type = id;
  harvestIncoming[harvestIncoming.length].harvestStartTime = Date.now();
  harvestIncoming[harvestIncoming.length].harvestDelay = 1000;

  return harvestIncoming;
};

/**
 * receiveResHarvest
 * * Receive resources after harvesting
 * @param id {number} type id of resources harvested
 * @param inventory {[]} player inventory
 * @param fixResVal {[]} resources static data
 * ? return array w/ [inventory, mapBuildingArray]
 * @return inventory {[]} updated player inventory
 */
export const receiveResHarvest = (
  id: number,
  inventory: any,
  fixResVal: any
) => {
  let i: number = 0;

  // while (i < fixResVal[id].production.length) {
  while (i < 8) {
    inventory[i] += fixResVal[id].production[i];
    i++;
  }
  return inventory;
};

export const playerLevelIncrease = (inventory: any) => {
  inventory[11] += 1;
  return inventory;
};

export const playerLevelDecrease = (inventory: any) => {
  inventory[11] -= 1;
  return inventory;
};
