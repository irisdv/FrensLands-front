import { IStarknetWindowObject } from "get-starknet";
import React, { useReducer, useEffect, useState, useCallback } from "react";
import * as starknet from "starknet";
import uint256, { AccountInterface, GetBlockResponse } from "starknet";

import { revComposeD, generateFullMap } from "../utils/land";
import { parsePipeResToArray, parseResToArray } from "../utils/utils";
import { fillStaticBuildings, fillStaticResources } from "../utils/static";
import { getStaticBuildings, getStaticResources } from "../api/static";
import {
  getIdFromPos,
  getPosFromId,
  cycleRegisterCompose,
  cycleRegisterComposeD,
  harvestResPay,
  incomingComposeD,
  incomingCompose,
} from "../utils/building";
import { ComposeD } from "../utils/land";
import { BuildDelay, HarvestDelay } from "../utils/constant";
import { updateIncomingInventories } from "../api/player";

export interface ILand {
  id: number;
  biomeId: number;
  fullMap: string;
}

export interface IInventory {
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

export interface IPlayerBuilding {
  blockX: number;
  blockY: number;
  posX: number;
  posY: number;
  fk_buildingid: number;
}

export interface INewGameState {
  // Static data
  staticResources: any[];
  staticBuildings: any[];
  // Player data
  timeSpent: number;
  wallet: any;
  player: any[];
  fullMap: any[];
  inventory: any[];
  playerBuilding: any[];
  counters: any[];
  payloadActions: any[];
  incomingArray: any[];
  initPlayer: (wallet: IStarknetWindowObject) => void;
  initGameSession: (
    inventory: any,
    land: any,
    playerActions: any,
    playerBuildings: [],
    account: string,
    userId: string
  ) => void;
  addAction: (entrypoint: string, calldata: string) => void;
  updateInventory: (inventory: any[]) => void;
  updatePlayerBuilding: (_playerBuilding: any[]) => void;
  // Harvest actions
  harvestActions: any[];
  updateIncomingActions: (
    infraType: number,
    posX: number,
    posY: number,
    uid: number,
    time: number,
    status: number
  ) => void;
  updateMapBlock: (_map: any[]) => void;
  transactions: any[];
}

export const NewGameState: INewGameState = {
  // Static data
  staticResources: [],
  staticBuildings: [],
  // Player data
  timeSpent: 0,
  wallet: null,
  player: [],
  fullMap: [],
  inventory: [],
  playerBuilding: [],
  counters: [],
  payloadActions: [],
  incomingArray: [],
  initPlayer: (wallet) => {},
  initGameSession: (
    inventory,
    land,
    playerActions,
    playerBuildings,
    account,
    userId
  ) => {},
  addAction: (entrypoint, calldata) => {},
  updateInventory: (inventory) => {},
  updatePlayerBuilding: (_playerBuilding) => {},
  // Harvest actions
  harvestActions: [],
  updateIncomingActions: (infraType, posX, posY, uid, time, status) => {},
  updateMapBlock: (_map) => {},
  transactions: [],
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
  player: any[];
  fullMap: any[];
  actions: any[];
  playerBuilding: any[];
  inventory: any[];
  staticResources: any[];
  staticBuildings: any[];
  counters: any[];
  incomingArray: any[];
}

interface SetPayloadAction {
  type: "set_payloadAction";
  entrypoint: string;
  calldata: string;
}

interface SetInventory {
  type: "set_inventory";
  inventory: any[];
}
interface SetPlayerBuildings {
  type: "set_playerBuilding";
  playerBuilding: any[];
}
interface SetHarvestAction {
  type: "set_harvestAction";
  harvestingArr: any[];
}
interface SetFullMap {
  type: "set_fullMap";
  map: any[];
}

interface SetExecuteHarvest {
  type: "set_executeHarvest";
  inventory: any[];
  map: any[];
  harvestingArr: any[];
}

interface SetError {
  type: "set_error";
  error: Error;
}

// Update inventory
// Update player building array

type Action =
  | SetPlayer
  | SetGameSession
  | SetError
  | SetPayloadAction
  | SetInventory
  | SetPlayerBuildings
  | SetHarvestAction
  | SetFullMap
  | SetExecuteHarvest;

function reducer(state: INewGameState, action: Action): INewGameState {
  switch (action.type) {
    case "set_player": {
      return {
        ...state,
        wallet: action.wallet,
      };
    }
    case "set_gameSession": {
      return {
        ...state,
        player: action.player,
        fullMap: action.fullMap,
        payloadActions: action.actions,
        inventory: action.inventory,
        playerBuilding: action.playerBuilding,
        staticBuildings: action.staticBuildings,
        staticResources: action.staticResources,
        counters: action.counters,
        incomingArray: action.incomingArray,
      };
    }
    case "set_payloadAction": {
      const currentPayload = state.payloadActions;
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
    case "set_inventory": {
      console.log("current payload", state.inventory);
      return {
        ...state,
        inventory: action.inventory,
      };
    }
    case "set_playerBuilding": {
      console.log("updating playerBuilding", state.playerBuilding);
      return {
        ...state,
        playerBuilding: action.playerBuilding,
      };
    }
    case "set_harvestAction": {
      console.log("current payload harvest", action.harvestingArr);
      return {
        ...state,
        harvestActions: action.harvestingArr,
      };
    }
    case "set_fullMap": {
      return {
        ...state,
        fullMap: action.map,
      };
    }
    case "set_executeHarvest": {
      console.log("actions", action);
      return {
        ...state,
        inventory: action.inventory,
        fullMap: action.map,
        harvestActions: action.harvestingArr,
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
  const [block, setBlock] = useState<GetBlockResponse | undefined>(undefined);
  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  // const [fixBuildVal, setFixBuildVal] = useState<any[]>([]);
  // const [fixResVal, setFixResVal] = useState<any[]>([]);

  const fetchBlock = useCallback(() => {
    if (state.wallet) {
      state.wallet.account
        .getBlock()
        .then((newBlock: any) => {
          setBlock((oldBlock) => {
            if (oldBlock?.block_hash === newBlock.block_hash) {
              return oldBlock;
            }
            // Reset error and return new block.
            console.log("new block", newBlock);
            // TODO call functions when block is updated
            // TODO check newBlock.transactions against transactions array
            // If tx validated then show notif and delete tx in array + update player_actions db to validated
            return newBlock;
          });
        })
        .catch((error: any) => {
          console.log("failed fetching block", error);
        })
        .finally(() => setLoading(false));
    }
  }, [setBlock, state.wallet, setLoading]);

  useEffect(() => {
    setLoading(true);

    // Fetch block immediately
    fetchBlock();

    const intervalId = setInterval(() => {
      fetchBlock();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchBlock]);

  const addAction = React.useCallback(
    (entrypoint: string, calldata: string) => {
      console.log("action received", entrypoint);
      dispatch({
        type: "set_payloadAction",
        entrypoint,
        calldata,
      });
    },
    []
  );

  const initPlayer = React.useCallback((wallet: IStarknetWindowObject) => {
    dispatch({
      type: "set_player",
      wallet,
    });
  }, []);

  const initGameSession = React.useCallback(
    async (
      inventory: any,
      land: any,
      playerActions: any,
      playerBuildings: [],
      account: string,
      userId: string
    ) => {
      //  - - - - - - PLAYER LAND - - - - - -
      // let test = generateFullMap();
      // console.log("test", test);

      const fullMapArray = revComposeD(land.fullMap, account);
      console.log("fullMapArray = ", fullMapArray);

      //const composition = ComposeD(fullMapArray);

      // const fullMapArray = revComposeD(land.fullMap);
      //console.log("fullMapArray = ", fullMapArray);

      // - - - - - - - TEST CALL FUNCTION - - - - - - - - //

      //const test = getIdFromPos(fullMapArray, 8, 21);
      //const test2 = getPosFromId(fullMapArray, 97);

      //console.log("test = ", test);
      //console.log("test2 = ", test2);

      //  - - - - - - INVENTORY - - - - - -
      const inventoryArray: any[] = [];

      inventoryArray[0] = inventory[0].wood;
      inventoryArray[1] = inventory[0].rock;
      inventoryArray[2] = inventory[0].food;
      // inventoryArray[0] = 100;
      // inventoryArray[1] = 100;
      // inventoryArray[2] = 100;
      inventoryArray[3] = inventory[0].metal;
      // inventoryArray[3] = 100;
      inventoryArray[4] = inventory[0].coal;
      inventoryArray[5] = inventory[0].energy;
      inventoryArray[6] = inventory[0].coin;
      // inventoryArray[6] = 100;
      inventoryArray[7] = inventory[0].gold;
      inventoryArray[8] = inventory[0].freePop;
      inventoryArray[9] = inventory[0].totalPop;
      // inventoryArray[8] = 100;
      // inventoryArray[9] = 100;
      inventoryArray[10] = inventory[0].timeSpent;
      inventoryArray[11] = inventory[0].level;
      // inventoryArray[11] = 8;

      console.log("inventoryArray = ", inventoryArray);

      //  - - - - - - PLAYER BUILDINGS - - - - - -
      const mapBuildingArray: any[] = [];
      playerBuildings.map((elem: any, key: number) => {
        mapBuildingArray[key] = [];
        mapBuildingArray[key].blockX = elem.blockX;
        mapBuildingArray[key].blockY = elem.blockY;
        mapBuildingArray[key].activeCycles = elem.activeCycles;
        mapBuildingArray[key].cycleRegister = elem.cycleRegister;
        mapBuildingArray[key].posX = elem.posX;
        mapBuildingArray[key].posY = elem.posY;
        mapBuildingArray[key].type = elem.fk_buildingid;
        mapBuildingArray[key].decay = elem.decay;
        mapBuildingArray[key].gameUid = elem.gameUid;
      });
      console.log("mapBuildingArray = ", mapBuildingArray);

      //  - - - - - - STATIC BUILDINGS - - - - - -
      const staticBuildings: any = await getStaticBuildings();
      console.log("static buildings", staticBuildings);

      const fixBuildVal: any[] = fillStaticBuildings(staticBuildings);
      console.log("fixBuildVal = ", fixBuildVal);

      //  - - - - - - STATIC RESOURCES - - - - - -
      const staticResources: any = await getStaticResources(land.biomeId);
      const fixResVal: any[] = fillStaticResources(staticResources);
      console.log("fixResVal = ", fixResVal);

      //  - - - - - - HARVEST - - - - - -

      const harvestIncoming: any[] = [];

      //  - - - - - - COUNTERS - - - - - -

      const buildingCounter = mapBuildingArray.length;
      console.log("buildingCounter", buildingCounter);

      var counters: any[] = [];
      counters["buildings" as any] = buildingCounter;

      const playerArray: any[] = [];
      playerArray["landId" as any] = land.id;
      playerArray["tokenId" as any] = land.tokenId;
      playerArray["id" as any] = userId;
      playerArray["biomeId" as any] = land.biomeId;
      playerArray["claimRegister" as any] = []; // ! TEMPORARY (NEED TO GET DATA FROM DB)
      console.log("playerArray", playerArray);
      //  - - - - - - DATA IN ARRAYS - - - - - - END

      // Build incoming Array and update if action finished
      var time = Date.now();
      var incomingArray: any[] = incomingComposeD(
        inventory[0].incomingInventories,
        time
      );
      var incomingArrStr = incomingCompose(incomingArray);
      let _updateArr = updateIncomingInventories(playerArray, incomingArrStr);

      dispatch({
        type: "set_gameSession",
        player: playerArray,
        fullMap: fullMapArray,
        actions: playerActions,
        inventory: inventoryArray,
        playerBuilding: mapBuildingArray,
        staticBuildings: fixBuildVal,
        staticResources: fixResVal,
        incomingArray: incomingArray,
        counters: counters,
      });
    },
    []
  );

  const updateInventory = React.useCallback((_inventory: any[]) => {
    dispatch({
      type: "set_inventory",
      inventory: _inventory,
    });
  }, []);

  const updateIncomingActions = React.useCallback(
    async (
      type: number,
      posX: number,
      posY: number,
      uid: number,
      time: number,
      status: number
    ) => {
      if (
        posX &&
        posY &&
        state.harvestActions &&
        (status == 1 || status == 0)
      ) {
        const currArr = state.harvestActions;

        if (currArr && currArr[posY] != undefined) {
          if (!currArr[posY][posX]) currArr[posY][posX] = [];
          currArr[posY][posX].uid = uid;
          currArr[posY][posX].status = status;
          currArr[posY][posX].harvestStartTime = time;
          if (type == 1) {
            currArr[posY][posX].harvestDelay = HarvestDelay;
          } else if (type == 2) {
            currArr[posY][posX].harvestDelay = BuildDelay;
          }
        } else {
          currArr[posY] = [];
          currArr[posY][posX] = [];
          currArr[posY][posX].uid = uid;
          currArr[posY][posX].status = status;
          currArr[posY][posX].harvestStartTime = time;
          if (type == 1) {
            currArr[posY][posX].harvestDelay = HarvestDelay;
          } else if (type == 2) {
            currArr[posY][posX].harvestDelay = BuildDelay;
          }
        }
        dispatch({
          type: "set_harvestAction",
          harvestingArr: currArr,
        });
      }
    },
    []
  );

  const updateMapBlock = React.useCallback((_map: any[]) => {
    console.log("_map", _map);
    dispatch({
      type: "set_fullMap",
      map: _map,
    });
  }, []);

  const updatePlayerBuilding = React.useCallback((_playerBuilding: any[]) => {
    console.log("_playerBuilding updating", _playerBuilding);
    dispatch({
      type: "set_playerBuilding",
      playerBuilding: _playerBuilding,
    });
  }, []);

  return (
    <NewStateContext.Provider
      value={{
        staticResources: state.staticResources,
        staticBuildings: state.staticBuildings,
        timeSpent: state.timeSpent,
        wallet: state.wallet,
        player: state.player,
        fullMap: state.fullMap,
        inventory: state.inventory,
        updatePlayerBuilding,
        playerBuilding: state.playerBuilding,
        counters: state.counters,
        payloadActions: state.payloadActions,
        harvestActions: state.harvestActions,
        incomingArray: state.incomingArray,
        initPlayer,
        initGameSession,
        addAction,
        updateInventory,
        updateIncomingActions,
        updateMapBlock,
        transactions: state.transactions,
      }}
    >
      {props.children}
    </NewStateContext.Provider>
  );
};

export default NewStateContext;
