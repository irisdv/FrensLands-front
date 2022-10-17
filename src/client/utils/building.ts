// COMPOSITIOM
// resource_type : 1        [resources,buildings,roads,decoration]
// resource_type_id : 2     [type of resources]
// resource_uid : 4         [ID]
// level : 1                [STATE]
// mat_type : 1             [block mat type]
// fertility: 2

// FUNCTION TO DO

// ||||||- enough to harvest : resources / population (type of resource spawned)
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
// ||||||- receive resources from harvest (with timer)  ----> Need to create a Special Incoming array (checked often)
// ||||||- levelManagement (increase/decrease)
// ||||||- REV_cancelCreate
// ||||||- REV_cancelHarvest
// ||||||- REV_cancelRepair
// ||||||- REV_cancelMaintain
// - REV_cancelMove
// ||||||- Calculate how many refill you can do on a prod building
// ||||||- get id from position X|Y
// ||||||- check if all buildings are still fueled on this cycle and decrement the cycles
// ||||||- add a number of cycles per building when fueled
// ||||||- composeD of buildings registers to send to DB
// incoming id->timestamp

let  incomingArr : any[] = [];

export const addElemToIncoming = (incomingArr: any, id: number, timeStamp: number) => 
{
  let i: number = incomingArr.length;

  incomingArr[i] = [];
  incomingArr[i].id = id;
  incomingArr[i].timeStamp = timeStamp;

  return (incomingArr);
}

export const deleteElemFromIncoming = (incomingArr: any, id: number) =>
{
  let i: number = 0;

  while (i < incomingArr.length)
  {
    if (incomingArr[i].id == id)
    {
      incomingArr.splice(i);
    }
    i++;
  }
  return (incomingArr);
}

export const incomingCompose = (incomingArr: any) =>
{
  let i: number = 0;
  let comp: string = "";

  while (i < incomingArr.length)
  {
    comp = incomingArr[i].id + "-" + incomingArr[i].timeStamp + "|";
    i++;
  }
  return (comp);
}

export const incomingComposeD = (comp : string) =>
{
  let i: number = 0;
  let j: number = 0;
  let incomingArr: any[] = [];
  let tempStr: string = "";

  while (i < comp.length)
  {
    tempStr = tempStr + comp[i];
    if (comp[i] == "-")
    {
      incomingArr[j].id = parseInt(tempStr);
      tempStr = "";
      i++;
      while (comp[i] != "|")
      {
        tempStr = tempStr + comp[i];
        i++
      }
      incomingArr[j].timeStamp = parseInt(tempStr);
    }

    i++;
    j++;
  }
  return (incomingArr);
}


// COMPOSE ALL BUILDING'S CYCLE REGISTER FOR DB
export const cycleRegisterCompose = (mapBuildingArray: any) => {
  let i: number = 0;
  let cycleReg: string = "";

  while (i < mapBuildingArray.length) {
    cycleReg =
      cycleReg +
      mapBuildingArray[i].id +
      "-" +
      mapBuildingArray[i].cycleRegister +
      "|";
    i++;
  }
  return cycleReg;
};

// DECOMPOSE CYCLE REGISTER FROM DB TO PUT BACK IN MAPBUILDINGARRAY
export const cycleRegisterComposeD = (
  cycleReg: string,
  mapBuildingArray: any
) => {
  let i: number = 0;
  let tempId: string = "";
  let id: number = 0;

  while (i < cycleReg.length) {
    if (cycleReg[i] == "-") {
      id = parseInt(tempId);
      tempId = "";
      while (cycleReg[i] != "|") {
        mapBuildingArray[id].cycleRegister =
          mapBuildingArray[id].cycleRegister + cycleReg[i];
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
export const checkFuelBuildings = (mapBuildingArray: any) => {
  let i: number = 0;

  while (i < mapBuildingArray.length) {
    if (mapBuildingArray[i].activeCycles > 0) {
      if (mapBuildingArray[i].activeCycles == 1) {
        mapBuildingArray[i].activeCycles = 0;
        mapBuildingArray[i].cycleRegister =
          mapBuildingArray[i].cycleRegister + "0";
      } else if (mapBuildingArray[i].activeCycles > 1) {
        mapBuildingArray[i].activeCycles -= 1;
        mapBuildingArray[i].cycleRegister =
          mapBuildingArray[i].cycleRegister + "1";
      }
    } else if (mapBuildingArray[i].activeCycles == 0) {
      mapBuildingArray[i].cycleRegister =
        mapBuildingArray[i].cycleRegister + "0";
    }
  }
  return mapBuildingArray;
};

// MAXIMUM REFILL YOU CAN DO TO A BUILDING
export const maintainMax = (id: number, inventory: any, fixBuildVal: any) => {
  let i: number = 0;
  let numRefill: number = 0;

  while (numRefill == 0 || numRefill) {
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

// Decrement inventory and add cycles to building
// Called when fueling a building
export const maintainBuildingPay = (
  id: number,
  inventory: any,
  fixBuildVal: any,
  mapBuildingArray: any,
  cycles: number
) => {
  let i: number = 0;

  while (i < fixBuildVal[id].maintainCost) {
    inventory[i] -= fixBuildVal[id].maintainCost[i] * cycles;
    i++;
  }

  refillBuilding(id, mapBuildingArray, cycles);

  return inventory;
};

// REFILL BUILDING (CALLED BY REFILL BUILDING PAY)
export const refillBuilding = (
  id: number,
  mapBuildingArray: any,
  cycles: number
) => {
  let i: number = 0;

  while (i < mapBuildingArray.length) {
    if (mapBuildingArray[i].id == id) {
      mapBuildingArray[i].activeCycles += cycles;
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
  inventory: any,
  fixBuildVal: any,
  mapBuildingArray: any,
  cycles: number
) => {
  let i: number = 0;

  while (i < fixBuildVal[id].maintainCost) {
    inventory[i] += fixBuildVal[id].maintainCost[i] * cycles;
    i++;
  }

  // THAT DOESN"T WORK IF YOU REFILLED AN ALREADY FILLED BUILDING
  if (mapBuildingArray[uid].activeCycles == 0)
  {
    i = mapBuildingArray[uid].cycleRegister.length;
    while (i > (mapBuildingArray[uid].cycleRegister.length - cycles))
    {
      mapBuildingArray[uid].cycleRegister[i] = 0;
      i--;
    }
  }
  else if (mapBuildingArray[uid].activeCycles > 0)
  {
    if (cycles < mapBuildingArray[uid].activeCycles)
    {
      mapBuildingArray[uid] = mapBuildingArray[uid].activeCycles - cycles;
    }
    else if (cycles > mapBuildingArray[uid].activeCycles)
    {
      let cylesLeft : number = cycles - mapBuildingArray[uid].activeCycles;
      mapBuildingArray[uid].activeCycles = 0;

      i = mapBuildingArray[uid].cycleRegister.length;
      while (i > (mapBuildingArray[uid].cycleRegister.length - cycles))
      {
        mapBuildingArray[uid].cycleRegister[i] = 0;
        i--;
      }
    }
  }

  return inventory;
};

// /** // ! Not sure we need to use this fonction
//  * checkResMaintainMsg
//  *  * Checks if a player can pay production cost of a given building and returns resources lacking
//  * @param id {number} type id of building to maintain
//  * @param inventory {[]} player inventory
//  * @param fixBuildVal {[]} building static data
//  * @param multiplier {number}
//  * @return res {[]} array of resources lacking
//  */
export const checkResMaintainMsg = (
  id: number,
  inventory: any,
  fixBuildVal: any,
  multiplier: number
) => {
  let i: number = 0;
  const res: any = [];

  // while (i < fixBuildVal[id].maintainCost.length) {
  while (i < 9) {
    if (inventory[i] < fixBuildVal[id].maintainCost[i] * multiplier) {
      console.log("not enough resources to maintain ", i);
      res.push(i);
    }
    i++;
  }
  console.log("enough resources to maintain ", res);
  return res;
};

// CANCEL THE CREATION OF A BUILDING
export const cancelCreate = (id: number, inventory: any, fixBuildVal: any) => {
  let i: number = 0;

  while (i < fixBuildVal[id].createCost.length) {
    if (i != 9) {
      inventory[i] += fixBuildVal[id].createCost[i];
    }
    i++;
  }
  //deleteFromBuildingArray(mapBuildingArray, id); // ! DELETE FROM BUILDING ARRAY WHEN WE PUT mapBuildingArray BACK

  return inventory;
};

// CANCEL THE REPAIR OF A BUILDING
export const cancelRepairBuilding = (
  id: number,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;

  while (i < fixBuildVal[id].repairCost.length) {
    inventory[i] += fixBuildVal[id].repairCost[i];
    i++;
  }
  return inventory;
};

// CANCEL AN HARVEST COST (WHAT YOU PAY TO HARVEST)
export const cancelHarvestRes = (
  id: number,
  // uid: number,
  inventory: any,
  fixResVal: any
  // harvestIncoming: any
) => {
  let i: number = 0;

  while (i < fixResVal[id].harvestCost.length) {
    if (i != 9) {
      inventory[i] += fixResVal[id].harvestCost[i];
    }
    i++;
  }
  // deleteFromHarvestArray(id, uid, harvestIncoming, elem); // ! call to function with elem
  console.log("inventory after loop", inventory);
  return inventory;
};

// DELETE FORM INCOMING HARVEST ARRAY
export const deleteFromHarvestArray = (
  id: number,
  uid: number,
  harvestIncoming: any,
  elem: number
) => {
  harvestIncoming[elem] = [];

  return harvestIncoming;
};

// CANCEL THE RESOURCES YOU RECEIVED FROM AN HARVEST
export const cancelReceiveResHarvest = (
  id: number,
  inventory: any,
  fixResVal: any
) => {
  let i: number = 0;

  while (i < fixResVal[id].production.length) {
    if (i != 9) {
      inventory[i] -= fixResVal[id].production[i];
    }
    i++;
  }
  return inventory;
};

// GET UID OF ENTITY BASED ON POSX AND POSY
export const getIdFromPos = (fullmap: any, posY: number, posX: number) => {
  let id: number = 0;

  id = fullmap[posY][posX].id;

  return id;
};

// GET POS OF ENTITY BASED ON ITS UID
export const getPosFromId = (fullmap: any, id: number) => {
  let vecYX: any[] = [];
  let j: number = 1;
  let i: number = 1;

  while (i < fullmap.length) {
    while (j < 41) {
      if (fullmap[i][j].id == id) {
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
  // console.log("lacking resources to harvest ", res);
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

// FIND THE LAST CYCLE WHEN CLAIMING HAS BEEN INITIATED
// playerArray.claimRegister = "dernier block - current block | " where dernier block = lastClaim block
//// 14-18|18-39|39-45|  -> 45
export const calculateLastClaim = (playerArray: any) => {
  let lastClaim: number = 0;
  let strIndex: number = playerArray.claimRegister.length;
  let found: number = 0;
  let tempStr: string = "";

  // CALCULATE LAST CLAIM BASE ON CLAIM REGISTER
  if (playerArray.claimRegister.length == 0) {
    lastClaim = 0;
    return lastClaim;
  } else {
    while (found != 1) {
      if (playerArray.claimRegister[strIndex] == "-") {
        while (playerArray.claimRegister[strIndex] != "|") {
          tempStr = tempStr + playerArray.claimRegister[strIndex];
          strIndex++;
        }
        found = 1;
        lastClaim = parseInt(tempStr);
        return lastClaim;
      }
      strIndex--;
    }
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
  inventory: any,
  playerArray: any,
  currenCycle: any
) => {
  let i: number = 0;
  let j: number = 0;
  let k: number = 0;
  let totalActive: number = 0;

  let lastClaim: number = calculateLastClaim(playerArray) as number;

  // CALCULATE THE CLAIM
  while (i < mapBuildingArray.length) {
    k = lastClaim + 1;
    while (k < mapBuildingArray[i].cycleRegister.length) {
      if (mapBuildingArray[i].cycleRegister[k] == "1") {
        totalActive += 1;
      }
      k++;
    }

    while (j < fixBuildVal[mapBuildingArray[i].id].production.length) {
      inventory[j] +=
        fixBuildVal[mapBuildingArray[i].id].production[j] * totalActive;
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

//FIND THE FIRST CYCLE OF THE LAST CLAIM
// 14-18|18-39|39-45|  -> 39
export const calculateLastClaimFirstCycle = (playerArray: any) => {
  let lastClaim: number = 0;
  let strIndex: number = playerArray.claimRegister.length;
  let found: number = 0;
  let tempStr: string = "";

  // CALCULATE LAST CLAIM BASE ON CLAIM REGISTER
  if (playerArray.claimRegister.length == 0) {
    lastClaim = 0;
    return lastClaim;
  } else {
    while (found != 1) {
      if (playerArray.claimRegister[strIndex] == "|") {
        while (playerArray.claimRegister[strIndex] != "-") {
          tempStr = tempStr + playerArray.claimRegister[strIndex];
          strIndex++;
        }
        found = 1;
        lastClaim = parseInt(tempStr);
        return lastClaim;
      }
      strIndex--;
    }
  }
};

export const cancelClaim = (
  mapBuildingArray: any,
  fixBuildVal: any,
  inventory: any,
  playerArray: any
  //currenCycle: any,
) => {
  let i: number = 0;
  let j: number = 0;
  let k: number = 0;
  let totalActive: number = 0;

  let lastClaimFirstCycle: number = calculateLastClaimFirstCycle(
    playerArray
  ) as number;
  let lastClaim: number = calculateLastClaim(playerArray) as number;

  // CALCULATE THE CLAIM
  while (i < mapBuildingArray.length) {
    k = lastClaimFirstCycle + 1;
    while (k < lastClaimFirstCycle - lastClaim) {
      if (mapBuildingArray[i].cycleRegister[k] == "1") {
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
  // mapBuildingArray: any,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;

  while (i < fixBuildVal[id].createCost.length) {
    if (i != 9) {
      inventory[i] -= fixBuildVal[id].createCost[i];
    }
    i++;
  }
  // mapBuildingArray = addToBuildingArray(mapBuildingArray, id, 0, 0, 0, 0);
  // NEED TO RETURN MAPBUILDINGARRAY AND CONNECT THE POSITIONS
  return inventory;
};

/**
 * addToBuildingArray
 * * Add a new building to player array
 * TODO need to test it it's [mapBuildingArray.length + 1]
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
) => {
  const _newEntry: any[] = [];
  _newEntry["blockX" as any] = blockX;
  _newEntry["blockY" as any] = blockY;
  _newEntry["posX" as any] = posX;
  _newEntry["posY" as any] = posY;
  _newEntry["type" as any] = type;
  _newEntry["decay" as any] = 0;
  _newEntry["gameUid" as any] = uid;

  mapBuildingArray.push(_newEntry);

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
 * destroyBuilding_
 * * Delete a building from player's building array
 * ? check right way to delete an element
 * @param uid {[]}
 * @param id {[]}
 * @param mapBuildingArray {[]}
 * @param uid {number} uid of building to destroy
 * ? return array w/ [inventory, mapBuildingArray]
 * @return inventory {[]} updated
 */
export const destroyBuilding_ = (
  // uid: number,
  id: number,
  // mapBuildingArray: any,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;
  while (i < fixBuildVal[id].createCost.length) {
    var quotient =
      (fixBuildVal[id].createCost[i] - (fixBuildVal[id].createCost[i] % 2)) / 2;
    console.log("resources back from destroy", quotient);
    inventory[i] += quotient;
    i++;
  }
  // mapBuildingArray = deleteFromBuildingArray(mapBuildingArray, uid);
  // NEED TO RETURN MAPBUILDINGARRAY AS WELL
  return inventory;
};

export const repairBuildingPay = (
  id: number,
  inventory: any,
  fixBuildVal: any
) => {
  let i: number = 0;

  // while (i < fixBuildVal[id].repairCost.length) {
  while (i < 9) {
    inventory[i] -= fixBuildVal[id].repairCost[i];
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
