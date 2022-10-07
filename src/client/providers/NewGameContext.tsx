import { IStarknetWindowObject } from "get-starknet";
import React, { useReducer, useEffect, useState, useCallback } from "react";
import * as starknet from "starknet";
import uint256, { AccountInterface } from "starknet";

export interface ILand {
  id: number;
  biomeId: number;
  fullMap: string;
}

export interface Iinventory {
  wood: number;
  rock: number;
  coal: number;
  metal: number;
  energy: number;
  gold: number;
  food: number;
  coin: number;
  freePop: number;
  totalPop: number;
  timeSpent: number;
  level: number;
}

export interface IplayerBuilding {
  blockX: number;
  blockY: number;
  posX: number;
  posY: number;
  fk_buildingid: number;
}

export interface INewGameState {
  timeSpent: number;
  player: any;
  landId: number;
  biomeId: number;
  fullMap: any[];
  balances: any[];
  counterBuilding: number;
  counterRS: any[];
  payloadActions: any[];
  harvestActions: any[];
  initPlayer: (wallet: IStarknetWindowObject) => void;
  initGameSession: (
    inventory: Iinventory,
    land: ILand,
    playerActions: [],
    playerBuildings: IplayerBuilding
  ) => void;
  addAction: (entrypoint: string, calldata: string) => void;
}

export const NewGameState: INewGameState = {
  timeSpent: 0,
  player: null,
  landId: 0,
  biomeId: 0,
  fullMap: [],
  balances: [],
  counterBuilding: 0,
  counterRS: [],
  payloadActions: [],
  harvestActions: [],
  initPlayer: (wallet) => {},
  initGameSession: (inventory, land, playerActions, playerBuildings) => {},
  addAction: (entrypoint, calldata) => {},
};

const NewStateContext = React.createContext(NewGameState);

interface SetPlayer {
  type: "set_player";
  wallet: IStarknetWindowObject;
}

// Setup player session
interface SetGameSession {
  type: "set_gameSession";
  address?: string;
  landId: number;
  biomeId: number;
  fullMap?: any[];
  actions: any[];
  buildings?: any[];
}

interface SetPayloadAction {
  type: "set_payloadAction";
  entrypoint: string;
  calldata: string;
}

interface SetError {
  type: "set_error";
  error: Error;
}

type Action = SetPlayer | SetGameSession | SetError | SetPayloadAction;

function reducer(state: INewGameState, action: Action): INewGameState {
  switch (action.type) {
    case "set_player": {
      return {
        ...state,
        player: action.wallet,
      };
    }
    case "set_gameSession": {
      console.log("action received", action);
      return {
        ...state,
        landId: action.landId,
        biomeId: action.biomeId,
        // fullMap: action.fullMap,
        payloadActions: action.actions,
      };
    }
    case "set_payloadAction": {
      var currentPayload = state.payloadActions;
      console.log("state.payloadActions", state.payloadActions);
      currentPayload.push({
        entrypoint: action.entrypoint,
        calldata: action.calldata,
      });
      console.log("current payload", currentPayload);
      return {
        ...state,
        payloadActions: currentPayload,
      };
    }
    case "set_error": {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
    default: {
      return state;
    }
  }
}

export const NewAppStateProvider: React.FC<
  React.PropsWithChildren<{ children: any }>
> = (props: React.PropsWithChildren<{ children: any }>): React.ReactElement => {
  const [state, dispatch] = useReducer(reducer, NewGameState);
  const value = React.useMemo(() => [state, dispatch], [state]);
  //const [fixBuildVal, setFixBuildVal] = useState<any[]>([]);
  //const [fixResVal, setFixResVal] = useState<any[]>([]);

  const addAction = React.useCallback(
    (entrypoint: string, calldata: string) => {
      console.log("action received", entrypoint);
      dispatch({
        type: "set_payloadAction",
        entrypoint: entrypoint,
        calldata: calldata,
      });
    },
    []
  );

  const initPlayer = React.useCallback((wallet: IStarknetWindowObject) => {
    dispatch({
      type: "set_player",
      wallet: wallet,
    });
  }, []);

  const revComposeD = (compMap: string) => {
    let tempArray: any[] = [];

    let x: number = 0;
    let y: number = 0;
    let i: number = 0;

    tempArray[y] = [];
    var compMapSplit = compMap.split("|");

    while (i < compMapSplit.length) {
      if (x > 40) {
        y++;
        tempArray[y] = [];
        x = 0;
      }

      if (compMapSplit[i] == "0") {
        tempArray[y][x] = [];
        tempArray[y][x].resType = 0;
        tempArray[y][x].type = 0;
        tempArray[y][x].id = 0;
        tempArray[y][x].state = 0;
        tempArray[y][x].blockType = 0;
        tempArray[y][x].blockFertility = 0;
      } else {
        tempArray[y][x] = [];
        tempArray[y][x].resType = parseInt(compMapSplit[i][0]);
        tempArray[y][x].type = parseInt(
          compMapSplit[i][1] + compMapSplit[i][2]
        );
        tempArray[y][x].id = parseInt(
          compMapSplit[i][3] +
            compMapSplit[i][4] +
            compMapSplit[i][5] +
            compMapSplit[i][6]
        );
        tempArray[y][x].state = parseInt(compMapSplit[i][7]);
        tempArray[y][x].blockType = parseInt(compMapSplit[i][8]);
        tempArray[y][x].blockFertility = parseInt(
          compMapSplit[i][9] + compMapSplit[i][10]
        );
      }

      x++;
      i++;
    }

    console.log(tempArray);

    return tempArray;
  };

  const generateFullMap = () => {
    let fullMap: string = "";
    let i: number = 0;
    let j: number = 0;
    let uid: number = 0;

    let tree: any[] = [
      48, 64, 84, 87, 91, 95, 99, 103, 106, 113, 126, 128, 129, 130, 133, 134,
      143, 144, 147, 148, 149, 150, 152, 154, 163, 164, 165, 168, 171, 184, 185,
      189, 190, 191, 196, 204, 205, 207, 210, 211, 216, 218, 223, 225, 226, 227,
      228, 230, 231, 232, 236, 243, 244, 249, 250, 253, 256, 257, 258, 265, 266,
      267, 268, 271, 277, 284, 287, 294, 301, 308, 309, 311, 313, 316, 323, 325,
      327, 329, 330, 331, 348, 350, 352, 353, 354, 357, 366, 371, 373, 376, 382,
      391, 392, 394, 395, 403, 404, 407, 408, 409, 410, 412, 414, 421, 424, 426,
      427, 432, 434, 444, 446, 448, 449, 450, 451, 452, 456, 459, 469, 471, 473,
      475, 485, 488, 489, 502, 507, 510, 525, 528, 533, 536, 540, 545, 557, 562,
      566, 571, 577, 584, 591, 595,
    ];
    let rock: any[] = [
      53, 66, 68, 85, 89, 122, 162, 166, 173, 181, 234, 312, 315, 328, 339, 345,
      359, 367, 368, 369, 436, 439, 514, 526, 537, 538, 550, 589,
    ];
    let bush: any[] = [
      92, 111, 145, 151, 169, 187, 201, 229, 246, 248, 272, 274, 288, 291, 293,
      305, 364, 411, 429, 477, 482, 492, 494, 495, 552,
    ];
    let mine: any[] = [93, 286, 314, 484];

    while (i < 640) {
      let resType: string = "";
      let type: string = "";
      let tempUID: any = "0";
      let state: string = "0";
      let fertility: string = "99";
      let infraType: string = "1";

      while (j < rock.length) {
        if (i == rock[j]) {
          resType = "1";
          type = "02";
        }
        j++;
      }
      j = 0;
      while (j < bush.length) {
        if (i == bush[j]) {
          resType = "1";
          type = "03";
        }
        j++;
      }
      j = 0;
      while (j < tree.length) {
        if (i == tree[j]) {
          resType = "1";
          type = "01";
        }
        j++;
      }
      j = 0;
      while (j < mine.length) {
        if (i == mine[j]) {
          resType = "1";
          type = "04";
        }
        j++;
      }
      j = 0;

      if (resType != "1") {
        tempUID = "0";
        fertility = "0";
        infraType = "0";
      } else {
        tempUID = uid.toString();
        if (uid < 10) {
          tempUID = "000" + uid.toString();
        } else if (uid >= 10 && uid < 100) {
          tempUID = "00" + uid.toString();
        } else if (uid >= 100) {
          tempUID = "0" + uid.toString();
        }
        uid++;
        state = "1";
      }

      fullMap =
        fullMap +
        parseInt(
          infraType.toString() +
            resType.toString() +
            type.toString() +
            tempUID.toString() +
            state.toString() +
            fertility.toString()
        ).toString() +
        "|";

      i++;
    }
    return fullMap;
  };

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
  // - receive resources from harvest (with timer)  ----> Need to create a Special Incoming array (checked often)
  // - levelManagement (increase/decrease)
  // - REV_cancelCreate
  // - REV_cancelHarvest
  // - REV_cancelRepair
  // - REV_cancelMaintain
  // - REV_cancelMove

  const getStaticBuildings = () => {
    return fetch(`http://localhost:3001/api/static_buildings`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("static buildings retrieved", data);
        return data;
      });
  };

  const getStaticResources = () => {
    return fetch(`http://localhost:3001/api/static_resources_spawned`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("static resources spawned retrieved", data);
        return data;
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const parseResToArray = (str: string) => {
    var tempArray = str.split("-");

    return tempArray;
  };

  const parsePipeResToArray = (str: string) => {
    var tempArray = str.split("|");

    return tempArray;
  };

  const checkResHarvest = (id: number, inventory: any, fixResVal: any) => {
    let i: number = 0;

    while (i < fixResVal[id].harvestCost) {
      if (inventory[i] < fixResVal[id].harvestCost[i]) {
        console.log("not enough resources to harvest ", id);
        return 0;
      }
    }
    console.log("enough resources to harvest ", id);
    return 1;
  };

  const checkResMaintain = (id: number, inventory: any, fixBuildVal: any) => {
    let i: number = 0;

    while (i < fixBuildVal[id].maintainCost) {
      if (inventory[i] < fixBuildVal[id].maintainCost[i]) {
        console.log("not enough resources to maintain ", id);
        return 0;
      }
    }
    console.log("enough resources to maintain ", id);
    return 1;
  };

  const checkResBuild = (id: number, inventory: any, fixBuildVal: any) => {
    let i: number = 0;

    while (i < fixBuildVal[id].createCost) {
      if (i == 8) {
        if (inventory[i] - fixBuildVal[id].createCost[i] < 1) {
          console.log("not enough resources to build ", id);
          return 0;
        }
      } else if (inventory[i] < fixBuildVal[id].createCost[i]) {
        console.log("not enough resources to build ", id);
        return 0;
      }
    }
    console.log("enough resources to build ", id);
    return 1;
  };

  const checkResRepair = (id: number, inventory: any, fixBuildVal: any) => {
    let i: number = 0;

    while (i < fixBuildVal[id].repairCost) {
      if (inventory[i] < fixBuildVal[id].repairCost[i]) {
        console.log("not enough resources to repair ", id);
        return 0;
      }
    }
    console.log("enough resources to repair ", id);
    return 1;
  };

  const checkIsMovable = (id: number, fixBuildVal: any) => {
    if (fixBuildVal[id].canMove == true) {
      return 1;
    } else {
      return 0;
    }
  };

  const claim = (mapBuildingArray: any, fixBuildVal: any, inventory: any) => {
    let i: number = 0;
    let j: number = 0;
    let cycles: number = 1;

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
    //NEED TO RETURN MAPBUILDINGARRAY TOO WITH THE LAST CLAIMED BLOCK UPDATED
    return inventory;
  };

  const createBuildingPay = (
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
    //NEED TO RETURN MAPBUILDINGARRAY AND CONNECT THE POSITIONS
    return inventory;
  };

  const addToBuildingArray = (
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

  const deleteFromBuildingArray = (mapBuildingArray: any, uid: number) => {
    // RIGHT WAY TO DELETE AN ELEMENT ?
    const temp: any[] = [];
    mapBuildingArray[uid] = temp;

    return mapBuildingArray;
  };

  const destroyBuilding = (
    uid: number,
    id: number,
    mapBuildingArray: any,
    inventory: any,
    fixBuildVal: any
  ) => {
    let i: number = 0;
    // NEED TO DO THE SPECIAL DIVISION LIKE IT IS ON CHAIN
    while (i < fixBuildVal[id].createCost) {
      inventory[i] += fixBuildVal[id].createCost[i];
      i++;
    }
    mapBuildingArray = deleteFromBuildingArray(mapBuildingArray, uid);
    //NEED TO RETURN MAPBUILDINGARRAY AS WELL
    return inventory;
  };

  const repairBuildingPay = (id: number, inventory: any, fixBuildVal: any) => {
    let i: number = 0;

    while (i < fixBuildVal[id].repairCost) {
      inventory[i] -= fixBuildVal[id].repairCost[i];
      i++;
    }
    return inventory;
  };

  const maintainBuildingPay = (
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

  const harvestResPay = (
    id: number,
    uid: number,
    inventory: any,
    fixResVal: any,
    harvestIncoming: any
  ) => {
    let i: number = 0;

    while (i < fixResVal[id].harvestCost) {
      inventory[i] -= fixResVal[id].harvestCost[i];
      i++;
    }
    addToHarvestArray(id, uid, harvestIncoming);
    return inventory;
  };

  const addToHarvestArray = (id: number, uid: number, harvestIncoming: any) => {
    harvestIncoming[harvestIncoming.length] = [];
    harvestIncoming[harvestIncoming.length].uid = uid;
    harvestIncoming[harvestIncoming.length].type = id;
    harvestIncoming[harvestIncoming.length].harvestStartTime = Date.now();
    harvestIncoming[harvestIncoming.length].harvestDelay = 1000;

    return harvestIncoming;
  };

  const receiveResHarvest = (id: number, inventory: any, fixResVal: any) => {
    let i: number = 0;

    while (i < fixResVal[id].production) {
      inventory[i] += fixResVal[id].production[i];
      i++;
    }
    return inventory;
  };

  const playerLevelIncrease = (inventory: any) => {
    inventory[11] += 1;
    return inventory;
  };

  const playerLevelDecrease = (inventory: any) => {
    inventory[11] -= 1;
    return inventory;
  };

  const initGameSession = React.useCallback(
    async (
      inventory: Iinventory,
      land: ILand,
      playerActions: [],
      playerBuildings: IplayerBuilding
    ) => {
      //console.log("inventory = ", inventory);
      console.log("playerBuildings = ", playerBuildings);

      let fullMap: string = "";
      fullMap = generateFullMap();
      //console.log("fullMap = ", fullMap);
      let testArray = [];
      testArray = revComposeD(fullMap);
      //console.log("testArray = ", testArray);

      // Fetch static buildings
      let staticBuildings: any = await getStaticBuildings();
      // Fetch static resources spawned
      let staticResources: any = await getStaticResources();

      //  - - - - - - DATA IN ARRAYS - - - - - -

      let inventoryArray: any[] = [];

      inventoryArray[0] = inventory.wood;
      inventoryArray[1] = inventory.rock;
      inventoryArray[4] = inventory.food;
      inventoryArray[3] = inventory.metal;
      inventoryArray[2] = inventory.coal;
      inventoryArray[6] = inventory.energy;
      inventoryArray[5] = inventory.coin;
      inventoryArray[7] = inventory.gold;
      inventoryArray[8] = inventory.freePop;
      inventoryArray[9] = inventory.totalPop;
      inventoryArray[10] = inventory.timeSpent;
      inventoryArray[11] = inventory.level;

      console.log("inventoryArray = ", inventoryArray);

      let i: number = 0;
      let mapBuildingArray: any[] = [];
      const mapBuildingTemp = Object.values(playerBuildings);

      while (i < mapBuildingTemp.length) {
        mapBuildingArray[i] = [];

        mapBuildingArray[i].blockX = mapBuildingTemp[i].blockX;
        mapBuildingArray[i].blockY = mapBuildingTemp[i].blockY;
        mapBuildingArray[i].posX = mapBuildingTemp[i].posX;
        mapBuildingArray[i].posY = mapBuildingTemp[i].posY;
        mapBuildingArray[i].id = mapBuildingTemp[i].fk_buildingid;

        i++;
      }

      console.log("mapBuildingArray = ", mapBuildingArray);

      i = 0;
      let fixBuildVal: any[] = [];

      while (i < staticBuildings.length) {
        fixBuildVal[i] = [];
        fixBuildVal[i].id = staticBuildings[i].id;
        fixBuildVal[i].type = staticBuildings[i].type;
        fixBuildVal[i].biome = staticBuildings[i].biomeId;
        fixBuildVal[i].name = staticBuildings[i].name;
        fixBuildVal[i].sprite = parseResToArray(staticBuildings[i].spriteId);
        fixBuildVal[i].canMove = staticBuildings[i].canMove;
        fixBuildVal[i].canDestroy = staticBuildings[i].canDestroy;
        fixBuildVal[i].level = staticBuildings[i].nbLevel;
        fixBuildVal[i].needMaintain = staticBuildings[i].needMaintain;
        fixBuildVal[i].animated = staticBuildings[i].animated;
        fixBuildVal[i].pLevelToUnlock = staticBuildings[i].pLevelToUnlock;
        fixBuildVal[i].locked = staticBuildings[i].locked;
        fixBuildVal[i].fertility = staticBuildings[i].fertilityNeed;
        fixBuildVal[i].createCost = parseResToArray(
          staticBuildings[i].createCost
        );
        fixBuildVal[i].maintainCost = parseResToArray(
          staticBuildings[i].maintainCost
        );
        fixBuildVal[i].production = parseResToArray(
          staticBuildings[i].production
        );
        i++;
      }
      console.log("fixBuildVal = ", fixBuildVal);

      i = 0;

      let fixResVal: any[] = [];

      while (i < staticResources.length) {
        let tempSpriteArray: any[] = [];
        tempSpriteArray = parsePipeResToArray(staticResources[i].spriteId);

        fixResVal[i] = [];
        fixResVal[i].id = staticResources[i].id;
        fixResVal[i].biome = staticResources[i].biomeId;
        fixResVal[i].type = staticResources[i].type;
        fixResVal[i].nbHarvest = staticResources[i].nbHarvest;
        fixResVal[i].animated = staticResources[i].animated;
        fixResVal[i].locked = staticResources[i].locked;
        fixResVal[i].size = staticResources[i].size;
        fixResVal[i].level = staticResources[i].nbLevels;
        fixResVal[i].fertility = staticResources[i].fertilityNeed;
        fixResVal[i].sprites = parseResToArray(tempSpriteArray[0]);
        fixResVal[i].harvestSprites = parseResToArray(tempSpriteArray[1]);
        fixResVal[i].harvestCost = parseResToArray(
          staticResources[i].harvestCost
        );
        fixResVal[i].production = parseResToArray(
          staticResources[i].production
        );

        i++;
      }

      console.log("fixResVal[i] = ", fixResVal);

      let harvestIncoming: any[] = [];

      //  - - - - - - DATA IN ARRAYS - - - - - - END

      dispatch({
        type: "set_gameSession",
        landId: land.id,
        biomeId: land.biomeId,
        // fullMap: revComposeD(land.fullMap),
        actions: playerActions,
      });
    },
    []
  );

  return (
    <NewStateContext.Provider
      value={{
        timeSpent: state.timeSpent,
        player: state.player,
        landId: state.landId,
        biomeId: state.biomeId,
        fullMap: state.fullMap,
        balances: state.balances,
        counterBuilding: state.counterBuilding,
        counterRS: state.counterRS,
        payloadActions: state.payloadActions,
        harvestActions: state.harvestActions,
        initPlayer,
        initGameSession,
        addAction,
      }}
    >
      {props.children}
    </NewStateContext.Provider>
  );
};

export default NewStateContext;
