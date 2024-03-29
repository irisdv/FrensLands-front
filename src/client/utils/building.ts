// COMPOSITIOM
// resource_type : 1        [resources,buildings,roads,decoration]
// resource_type_id : 2     [type of resources]
// resource_uid : 4         [ID]
// level : 1                [STATE]
// mat_type : 1             [block mat type]
// fertility: 2

import { HarvestDelay } from "./constant";

export const addElemToIncoming = (
  incomingArr: any,
  id: number,
  timeStamp: number
): any[] => {
  const i: number = incomingArr.length;

  incomingArr[i] = [];
  incomingArr[i].id = id;
  incomingArr[i].timeStamp = timeStamp;

  return incomingArr;
};

export const deleteElemFromIncoming = (incomingArr: any, id: number): any[] => {
  let i: number = 0;

  while (i < incomingArr.length) {
    if (incomingArr[i].id === id) {
      incomingArr.splice(i);
    }
    i++;
  }
  return incomingArr;
};

export const incomingCompose = (incomingArr: any): string => {
  let i: number = 0;
  let comp: string = "";

  while (i < incomingArr.length) {
    comp =
      (incomingArr[i].id as string) +
      "-" +
      (incomingArr[i].timeStamp as string) +
      "|";
    i++;
  }
  return comp;
};

export const incomingComposeD = (comp: string, time: number): any[] => {
  const incomingArr: any[] = [];
  const compArr = comp.split("|");

  compArr.forEach((elem: any, index: number) => {
    if (elem.length > 0) {
      const val = elem.split("-");
      if (parseInt(val[1]) + HarvestDelay < time) {
        incomingArr[index] = [];
        incomingArr[index].id = val[0];
        incomingArr[index].timeStamp = val[1];
      }
    }
  });
  return incomingArr;
};

// COMPOSE ALL BUILDING'S CYCLE REGISTER FOR DB
export const cycleRegisterCompose = (mapBuildingArray: any): string => {
  let i: number = 0;
  let cycleReg: string = "";

  while (i < mapBuildingArray.length) {
    cycleReg =
      cycleReg +
      (mapBuildingArray[i].id as string) +
      "-" +
      (mapBuildingArray[i].cycleRegister as string) +
      "|";
    i++;
  }
  return cycleReg;
};

// DECOMPOSE CYCLE REGISTER FROM DB TO PUT BACK IN MAPBUILDINGARRAY
export const cycleRegisterComposeD = (
  cycleReg: string,
  mapBuildingArray: any
): any[] => {
  let i: number = 0;
  let tempId: string = "";
  let id: number = 0;

  while (i < cycleReg.length) {
    if (cycleReg[i] === "-") {
      id = parseInt(tempId);
      tempId = "";
      while (cycleReg[i] !== "|") {
        mapBuildingArray[id].cycleRegister =
          (mapBuildingArray[id].cycleRegister as string) + cycleReg[i];
        i++;
      }
      i++;
    }
    tempId = tempId + cycleReg;
    i++;
  }
  return mapBuildingArray;
};

// CHECK AT EVERY CYCLE THE ACTIVE CYCLES LEFT AND UPDATE MAPBUILDING ARRAY ACCORDINGLY
// called every block change
// Adds a 0 or 1 in cycleRegister of each building
export const checkFuelBuildings = (mapBuildingArray: any): any[] => {
  return mapBuildingArray.map((building: any) => {
    if (building.activeCycles > 0) {
      if (building.activeCycles === 1) {
        building.activeCycles = 0;
        building.cycleRegister = (building.cycleRegister as string) + "0";
      } else if (building.activeCycles > 1) {
        building.activeCycles -= 1;
        building.cycleRegister = (building.cycleRegister as string) + "1";
      }
    } else if (building.activeCycles === 0) {
      building.cycleRegister = (building.cycleRegister as string) + "0";
    }
    return building;
  });
};

// MAXIMUM REFILL YOU CAN DO TO A BUILDING
export const maintainMax = (
  id: number,
  inventory: any,
  fixBuildVal: any
): number => {
  let i: number = 0;
  let numRefill: number = 0;

  while (numRefill === 0 || numRefill) {
    while (i < fixBuildVal[id].maintainCost.length) {
      if (inventory[i] < fixBuildVal[id].maintainCost[i] * (numRefill + 1)) {
        console.log("maximum refill of", numRefill, " for ", id);
        return numRefill;
      }
      i++;
    }
    i = 0;
    numRefill++;
  }
  return numRefill;
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
): number => {
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

// Decrement inventory and add cycles to building
// Called when fueling a building
export const maintainBuildingPay = (
  id: number,
  inventory: any,
  fixBuildVal: any,
  // mapBuildingArray: any,
  cycles: number
): number[] => {
  let i: number = 0;

  while (i < fixBuildVal[id].maintainCost.length) {
    inventory[i] -= fixBuildVal[id].maintainCost[i] * cycles;
    i++;
  }
  // refillBuilding(id, mapBuildingArray, cycles);

  return inventory;
};

// REFILL BUILDING (CALLED BY REFILL BUILDING PAY)
export const refillBuilding = (
  id: number,
  mapBuildingArray: any,
  cycles: number
): [] => {
  let i: number = 0;

  while (i < mapBuildingArray.length) {
    if (mapBuildingArray[i].id === id) {
      (mapBuildingArray[i].activeCycles as number) += cycles;
    }
    i++;
  }
  return mapBuildingArray;
};

// CANCEL THE MAINTENANCE/REFILL OF A BUILDING
// updates the inventory
export const cancelMaintainBuilding = (
  uid: number,
  id: number,
  inventory: number[],
  fixBuildVal: any,
  mapBuildingArray: any,
  cycles: number
): number[] => {
  let i: number = 0;

  while (i < fixBuildVal[id].maintainCost) {
    inventory[i] += (fixBuildVal[id].maintainCost[i] as number) * cycles;
    i++;
  }

  // THAT DOESN"T WORK IF YOU REFILLED AN ALREADY FILLED BUILDING
  if (mapBuildingArray[uid].activeCycles === 0) {
    i = mapBuildingArray[uid].cycleRegister.length;
    while (i > mapBuildingArray[uid].cycleRegister.length - cycles) {
      mapBuildingArray[uid].cycleRegister[i] = 0;
      i--;
    }
  } else if (mapBuildingArray[uid].activeCycles > 0) {
    if (cycles < mapBuildingArray[uid].activeCycles) {
      mapBuildingArray[uid] = mapBuildingArray[uid].activeCycles - cycles;
    } else if (cycles > mapBuildingArray[uid].activeCycles) {
      // const cylesLeft: number = cycles - mapBuildingArray[uid].activeCycles
      mapBuildingArray[uid].activeCycles = 0;

      i = mapBuildingArray[uid].cycleRegister.length;
      while (i > mapBuildingArray[uid].cycleRegister.length - cycles) {
        mapBuildingArray[uid].cycleRegister[i] = 0;
        i--;
      }
    }
  }

  return inventory;
};

/**
 * checkResMaintainMsg
 *  * Checks if a player can pay production cost of a given building and returns resources lacking
 * @param id {number} type id of building to maintain
 * @param inventory {[]} player inventory
 * @param fixBuildVal {[]} building static data
 * @param multiplier {number}
 * @return res {[]} array of resources lacking
 */
export const checkResMaintainMsg = (
  id: number,
  inventory: number[],
  fixBuildVal: any,
  multiplier: number
): [] => {
  let i: number = 0;
  const res: any = [];

  while (i < 9) {
    if (inventory[i] < fixBuildVal[id].maintainCost[i] * multiplier) {
      res.push(i);
    }
    i++;
  }
  console.log("enough resources to maintain ", res);
  return res;
};

// CANCEL THE CREATION OF A BUILDING
export const cancelCreate = (
  id: number,
  inventory: number[],
  fixBuildVal: any
): number[] => {
  let i: number = 0;

  while (i < fixBuildVal[id].createCost.length) {
    if (i !== 9) {
      inventory[i] += parseInt(fixBuildVal[id].createCost[i]);
    }
    i++;
  }
  // deleteFromBuildingArray(mapBuildingArray, id);
  return inventory;
};

// CANCEL THE REPAIR OF A BUILDING
export const cancelRepairBuilding = (
  id: number,
  inventory: number[],
  fixBuildVal: any
): number[] => {
  let i: number = 0;

  while (i < fixBuildVal[id].repairCost.length) {
    inventory[i] += parseInt(fixBuildVal[id].repairCost[i]);
    i++;
  }
  return inventory;
};

// CANCEL AN HARVEST COST (WHAT YOU PAY TO HARVEST)
export const cancelHarvestRes = (
  id: number,
  inventory: number[],
  fixResVal: any
): number[] => {
  let i: number = 0;

  while (i < fixResVal[id].harvestCost.length) {
    if (i !== 9) {
      inventory[i] += parseInt(fixResVal[id].harvestCost[i]);
    }
    i++;
  }
  // deleteFromHarvestArray(id, uid, harvestIncoming, elem); // ! call to function with elem
  console.log("inventory after loop", inventory);
  return inventory;
};

// DELETE FORM INCOMING HARVEST ARRAY
export const deleteFromHarvestArray = (
  harvestIncoming: any,
  elem: number
): any[] => {
  harvestIncoming[elem] = [];

  return harvestIncoming;
};

// CANCEL THE RESOURCES YOU RECEIVED FROM AN HARVEST
export const cancelReceiveResHarvest = (
  id: number,
  inventory: any,
  fixResVal: any
): number[] => {
  let i: number = 0;

  while (i < fixResVal[id].production.length) {
    if (i !== 9) {
      inventory[i] -= parseInt(fixResVal[id].production[i]);
    }
    i++;
  }
  return inventory;
};

// GET UID OF ENTITY BASED ON POSX AND POSY
export const getIdFromPos = (
  fullmap: any,
  posY: number,
  posX: number
): number => {
  let id: number = 0;

  id = fullmap[posY][posX].id;

  return id;
};

// GET POS OF ENTITY BASED ON ITS UID
export const getPosFromId = (fullmap: any, id: number): number[] => {
  const vecYX: number[] = [];
  let j: number = 1;
  let i: number = 1;

  while (i < fullmap.length) {
    while (j < 41) {
      if (fullmap[i][j].id === id) {
        vecYX[0] = fullmap[i][j].posY;
        vecYX[1] = fullmap[i][j].posX;
      }
      j++;
    }
    j = 1;
    i++;
  }
  return vecYX;
};

/**
 * checkResHarvest
 *  * Check if a resource spawned can be harvested by a player
 * @param id {number} type id of resource to harvest
 * @param inventory {[]} player inventory
 * @param fixResVal {[]} resources spawned static data
 * @return success {number} 0 or 1
 */
export const checkResHarvest = (
  id: number,
  inventory: any,
  fixResVal: any
): number => {
  let i: number = 0;

  while (i < fixResVal[id].harvestCost) {
    if (inventory[i] < fixResVal[id].harvestCost[i]) {
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
): [] => {
  let i: number = 0;
  const res: any = [];

  while (i < 9) {
    if (inventory[i] < fixResVal[id].harvestCost[i]) {
      res.push(i);
    }
    i++;
  }
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
export const checkResBuild = (
  id: number,
  inventory: any,
  fixBuildVal: any
): number => {
  let i: number = 0;

  while (i < fixBuildVal[id].createCost.length) {
    if (i === 8) {
      if (inventory[i] - fixBuildVal[id].createCost[i] < 1) {
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
): [] => {
  let i: number = 0;
  const res: any = [];

  while (i < 9) {
    if (i === 8) {
      if (inventory[i] - fixBuildVal[id].createCost[i] < 1) {
        res.push(i);
      }
    } else if (inventory[i] < fixBuildVal[id].createCost[i]) {
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
): number => {
  let i: number = 0;

  while (i < fixBuildVal[id].repairCost.length) {
    if (inventory[i] < fixBuildVal[id].repairCost[i]) {
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
): [] => {
  let i: number = 0;
  const res: any = [];

  while (i < 9) {
    if (inventory[i] < fixBuildVal[id].repairCost[i]) {
      res.push(i);
    }
    i++;
  }
  console.log("enough resources to repair ", res);
  return res;
};

/**
 * checkIsMovable
 *  * Checks if a player can move a building
 * @param id {number} type id of building to move
 * @param fixBuildVal {[]} building static data
 * @return success {number} 0 or 1
 */
export const checkIsMovable = (id: number, fixBuildVal: any): number => {
  if (fixBuildVal[id].canMove === true) {
    return 1;
  } else {
    return 0;
  }
};

// FIND THE LAST CYCLE WHEN CLAIMING HAS BEEN INITIATED
// playerArray.claimRegister = "dernier block - current block | " where dernier block = lastClaim block
// 14-18|18-39|39-45|  -> 45
export const calculateLastClaim = (playerArray: any): number => {
  let lastClaim: number = 0;
  let strIndex: number = playerArray.claimRegister.length;
  let found: number = 0;
  let tempStr: string = "";

  // CALCULATE LAST CLAIM BASE ON CLAIM REGISTER
  if (playerArray.claimRegister.length === 0) {
    lastClaim = 0;
    return lastClaim;
  } else {
    while (found !== 1) {
      if (playerArray.claimRegister[strIndex] === "-") {
        while (playerArray.claimRegister[strIndex] !== "|") {
          tempStr = tempStr + (playerArray.claimRegister[strIndex] as string);
          strIndex++;
        }
        found = 1;
        lastClaim = parseInt(tempStr);
        return lastClaim;
      }
      strIndex--;
    }
  }
  return lastClaim;
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
  inventory: number[],
  playerArray: any,
  currenCycle: any
): number[] => {
  let i: number = 0;
  let j: number = 0;
  let k: number = 0;
  let totalActive: number = 0;

  const lastClaim: number = calculateLastClaim(playerArray);

  // CALCULATE THE CLAIM
  while (i < mapBuildingArray.length) {
    k = lastClaim + 1;
    while (k < mapBuildingArray[i].cycleRegister.length) {
      if (mapBuildingArray[i].cycleRegister[k] === "1") {
        totalActive += 1;
      }
      k++;
    }

    while (j < fixBuildVal[mapBuildingArray[i].id].production.length) {
      inventory[j] +=
        parseInt(fixBuildVal[mapBuildingArray[i].id].production[j]) *
        totalActive;
      j++;
    }
    j = 0;
    i++;
  }
  // UPDATE CLAIM REGISTER
  playerArray.claimRegister =
    playerArray.claimRegister +
    lastClaim.toString() +
    "-" +
    currenCycle.toString() +
    "|";

  return inventory;
};

// FIND THE FIRST CYCLE OF THE LAST CLAIM
// 14-18|18-39|39-45|  -> 39
export const calculateLastClaimFirstCycle = (playerArray: any): number => {
  let lastClaim: number = 0;
  let strIndex: number = playerArray.claimRegister.length;
  let found: number = 0;
  let tempStr: string = "";

  // CALCULATE LAST CLAIM BASE ON CLAIM REGISTER
  if (playerArray.claimRegister.length === 0) {
    lastClaim = 0;
    return lastClaim;
  } else {
    while (found !== 1) {
      if (playerArray.claimRegister[strIndex] === "|") {
        while (playerArray.claimRegister[strIndex] !== "-") {
          tempStr = tempStr + (playerArray.claimRegister[strIndex] as string);
          strIndex++;
        }
        found = 1;
        lastClaim = parseInt(tempStr);
        return lastClaim;
      }
      strIndex--;
    }
  }
  return lastClaim;
};

export const cancelClaim = (
  mapBuildingArray: any,
  fixBuildVal: any,
  inventory: any,
  playerArray: any
  // currenCycle: any,
): number[] => {
  let i: number = 0;
  let j: number = 0;
  let k: number = 0;
  let totalActive: number = 0;

  const lastClaimFirstCycle: number = calculateLastClaimFirstCycle(playerArray);
  const lastClaim: number = calculateLastClaim(playerArray);

  // CALCULATE THE CLAIM
  while (i < mapBuildingArray.length) {
    k = lastClaimFirstCycle + 1;
    while (k < lastClaimFirstCycle - lastClaim) {
      if (mapBuildingArray[i].cycleRegister[k] === "1") {
        totalActive += 1;
      }
      k++;
    }

    while (j < fixBuildVal[mapBuildingArray[i].id].production.length) {
      inventory[j] -=
        fixBuildVal[mapBuildingArray[i].id].production[j] * totalActive;
      j++;
    }
    j = 0;
    i++;
  }
  // UPDATE CLAIM REGISTER
  // playerArray.claimRegister = // ! DELETE LAST CLAIM

  return inventory;
};

/**
 * createBuildingPay
 *  * spend resources to build
 * @param id {number} type id of building to move
 * @param inventory {[]} player inventory
 * @param fixBuildVal {[]} building static data
 * @return inventory & mapBuildingArray updated
 */
export const createBuildingPay = (
  id: number,
  inventory: number[],
  fixBuildVal: any
): number[] => {
  let i: number = 0;

  while (i <= 8) {
    inventory[i] -= fixBuildVal[id].createCost[i];
    i++;
  }
  // handle buildings bringing new pop
  if (fixBuildVal[id].createCost[9] > 0) {
    inventory[9] += parseInt(fixBuildVal[id].createCost[9]);
    inventory[8] += parseInt(fixBuildVal[id].createCost[9]);
  }

  console.log("inventory after pay building", inventory);
  return inventory;
};

/**
 * addToBuildingArray
 * * Add a new building to player array
 * @param mapBuildingArray {[]}
 * @param type {number}
 * @param posX {number}
 * @param posY {number}
 * @param blockX {number}
 * @param blockY {number}
 * @param uid {number}
 * @return mapBuildingArray {[]} updated
 */
export const addToBuildingArray = (
  mapBuildingArray: any,
  type: number,
  posX: number,
  posY: number,
  blockX: number,
  blockY: number,
  uid: number
): any[] => {
  const _newEntry: any = [];
  _newEntry.blockX = blockX;
  _newEntry.blockY = blockY;
  _newEntry.posX = posX;
  _newEntry.posY = posY;
  _newEntry.type = type;
  _newEntry.decay = 0;
  _newEntry.gameUid = uid;
  _newEntry.activeCycles = 0;
  _newEntry.incomingCycles = 0;

  mapBuildingArray.push(_newEntry);

  return mapBuildingArray;
};

/**
 * destroyBuilding_
 * * Delete a building from player's building array
 * @param id {[]} type of building destroyed
 * @param inventory {[]} player inventory
 * @param fixBuildVal {[]} static data of buildings
 * @return inventory {[]} updated player inventory
 */
export const destroyBuilding_ = (
  id: number,
  inventory: number[],
  fixBuildVal: any
): number[] => {
  let i: number = 0;
  while (i < 8) {
    const quotient =
      (fixBuildVal[id].createCost[i] - (fixBuildVal[id].createCost[i] % 2)) / 2;
    console.log("resources back from destroy", quotient);
    inventory[i] += quotient;
    i++;
  }

  if (fixBuildVal[id].createCost[8] > 0) {
    // Pop working in the building goes back into freePop
    inventory[8] += parseInt(fixBuildVal[id].createCost[8]);
  }
  if (fixBuildVal[id].createCost[9] > 0) {
    // Pop arrived by building leaves community
    inventory[9] -= fixBuildVal[id].createCost[9];
    inventory[8] -= fixBuildVal[id].createCost[9];
  }
  return inventory;
};

export const repairBuildingPay = (
  id: number,
  inventory: any,
  fixBuildVal: any
): number[] => {
  let i: number = 0;
  while (i < 9) {
    inventory[i] -= fixBuildVal[id].repairCost[i];
    i++;
  }
  return inventory;
};

/**
 * harvestResPay
 * * Pay resources when harvesting
 * @param id {number} type id of resource harvested
 * @param uid {[]} unique id of resource harvested
 * @param inventory {[]} player inventory
 * @param fixResVal {[]} resources static data
 * @param harvestIncoming {[]} array of resource currently harvested by player
 * @return inventory {[]} updated player inventory
 */
export const harvestResPay = (
  id: number,
  inventory: any,
  fixResVal: any
): number[] => {
  let i: number = 0;
  while (i < 8) {
    inventory[i] -= fixResVal[id].harvestCost[i];
    i++;
  }
  return inventory;
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
  inventory: number[],
  fixResVal: any
): number[] => {
  let i: number = 0;
  while (i < 8) {
    inventory[i] += parseInt(fixResVal[id].production[i]);
    i++;
  }
  return inventory;
};

export const playerLevelIncrease = (inventory: number[]): number[] => {
  inventory[11] += 1;
  return inventory;
};

export const playerLevelDecrease = (inventory: number[]): number[] => {
  inventory[11] -= 1;
  return inventory;
};

/**
 * composeCycleRegister
 * * Compose cycle register array of values
 * @param cycleregisterArray {Object{}}
 * @return cycleRegisterStr {string} string
 */
export const composeCycleRegister = (cycleregisterArray: any): string => {
  let cycleRegisterStr: string = "";

  Object.keys(cycleregisterArray).map((uid: any) => {
    return cycleregisterArray[uid].map((elem: any) => {
      cycleRegisterStr =
        cycleRegisterStr +
        (uid as string) +
        "-" +
        (elem[0] as string) +
        "-" +
        (elem[1] as string) +
        "|";
    });
  });
  cycleRegisterStr = cycleRegisterStr.slice(0, -1);

  return cycleRegisterStr;
};

/**
 * decomposeCycleRegister
 * * Decompose cycle register to array
 * @param cycleregisterStr {string}
 * @return cycleRegister {[]} array ordonné through building type id
 */
export const decomposeCycleRegister = (cycleregisterStr: string): any => {
  const cycleRegisterArr = cycleregisterStr.split("|");

  const cycleRegister = cycleRegisterArr.reduce(function (acc: any, curr: any) {
    const elem = curr.split("-");
    return (
      acc[parseInt(elem[0])]
        ? acc[parseInt(elem[0])].push([parseInt(elem[1]), parseInt(elem[2])])
        : (acc[parseInt(elem[0])] = [[parseInt(elem[1]), parseInt(elem[2])]]),
      acc
    );
  }, {});

  return cycleRegister;
};

/**
 * initCounters
 * * Init player counters on first loading
 * @param playerBuilding {[]} player array of buildings
 * @param staticBuildings {[]} array of static data
 * @return incomingInventory {[]} array of resources available to claim
 * @return inactive {number} nb of inactive buildings
 * @return active {number} nb of active buildings
 * @return nbBlocksClaimable {number} nb of blocks claimable by player
 */
export const initCounters = (
  playerBuilding: any[],
  staticBuildings: any[]
): any => {
  let inactive: number = 0;
  let active: number = 0;
  let nbBlocksClaimable: number = 0;
  const incomingInventory: number[] = [];
  incomingInventory[0] = 0;
  incomingInventory[1] = 0;
  incomingInventory[2] = 0;
  incomingInventory[3] = 0;
  incomingInventory[4] = 0;
  incomingInventory[5] = 0;
  incomingInventory[6] = 0;
  incomingInventory[7] = 0;

  console.log("playerBuilding", playerBuilding);

  playerBuilding.forEach((building: any) => {
    if (building.incomingCycles > 0) {
      active++;
    } else {
      inactive++;
    }
    if (building.activeCycles > 0) {
      nbBlocksClaimable += parseInt(building.activeCycles);
      // Calculate incomingInventory with cycles to claim
      for (let i = 0; i < 8; i++) {
        incomingInventory[i] +=
          staticBuildings[building.type - 1].production[i] *
          building.activeCycles;
      }
    }
  });

  return { incomingInventory, inactive, active, nbBlocksClaimable };
};
