import { IStarknetWindowObject } from "get-starknet";
import React, { useReducer, useEffect, useState, useCallback } from "react";
import * as starknet from "starknet";
import uint256, { AccountInterface } from "starknet";

import { revComposeD, generateFullMap } from "../utils/land";
import { parsePipeResToArray, parseResToArray } from "../utils/utils";
import { fillStaticBuildings, fillStaticResources } from "../utils/static";
import { getStaticBuildings, getStaticResources } from "../api/static";
import { getIdFromPos } from "../utils/building";
import { getPosFromId } from "../utils/building";

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
  initPlayer: (wallet: IStarknetWindowObject) => void;
  initGameSession: (
    inventory: any,
    land: any,
    playerActions: any,
    playerBuildings: [],
    account: string
  ) => void;
  addAction: (entrypoint: string, calldata: string) => void;
  updateInventory: (inventory: any[]) => void;
  updatePlayerBuilding: (_playerBuilding: any[]) => void;
  // Harvest actions
  harvestActions: any[];
  updateHarvestActions: (
    posX: number,
    posY: number,
    uid: number,
    time: number,
    status: number
  ) => void;
  updateMapBlock: (_map: any[]) => void;

  executeHarvest: (
    _posX: number,
    _posY: number,
    _state: number,
    _status: number,
    _inventory: any[]
  ) => void;
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
  initPlayer: (wallet) => {},
  initGameSession: (
    inventory,
    land,
    playerActions,
    playerBuildings,
    account
  ) => {},
  addAction: (entrypoint, calldata) => {},
  updateInventory: (inventory) => {},
  updatePlayerBuilding: (_playerBuilding) => {},
  // Harvest actions
  harvestActions: [],
  updateHarvestActions: (posX, posY, uid, time, status) => {},
  updateMapBlock: (_map) => {},

  executeHarvest: (_posX, _posY, _state, _status, _inventory) => {},
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
      console.log("action received", action);
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
  // const [fixBuildVal, setFixBuildVal] = useState<any[]>([]);
  // const [fixResVal, setFixResVal] = useState<any[]>([]);

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
      account: string
    ) => {
      //  - - - - - - PLAYER LAND - - - - - -
      // let test = generateFullMap();
      // console.log("test", test);

      const fullMapArray = revComposeD(land[0].fullMap, account);
      console.log("fullMapArray = ", fullMapArray);
      // const fullMapArray = revComposeD(land.fullMap);
      //console.log("fullMapArray = ", fullMapArray);

      // - - - - - - - TEST CALL FUNCTION - - - - - - - - //

      //const test = getIdFromPos(fullMapArray, 8, 21);
      //const test2 = getPosFromId(fullMapArray, 97);

      //console.log("test = ", test);
      //console.log("test2 = ", test2);

      // //  - - - - - - INVENTORY - - - - - -
      const inventoryArray: any[] = [];

      // inventoryArray[0] = inventory[0].wood;
      // inventoryArray[1] = inventory[0].rock;
      // inventoryArray[2] = inventory[0].food;
      inventoryArray[0] = 100;
      inventoryArray[1] = 100;
      inventoryArray[2] = 100;
      inventoryArray[3] = inventory[0].metal;
      inventoryArray[4] = inventory[0].coal;
      inventoryArray[5] = inventory[0].energy;
      inventoryArray[6] = inventory[0].coin;
      inventoryArray[7] = inventory[0].gold;
      // inventoryArray[8] = inventory[0].freePop;
      // inventoryArray[9] = inventory[0].totalPop;
      inventoryArray[8] = 100;
      inventoryArray[9] = 100;
      inventoryArray[10] = inventory[0].timeSpent;
      // inventoryArray[11] = inventory[0].level;
      inventoryArray[11] = 8;

      console.log("inventoryArray = ", inventoryArray);

      //  - - - - - - PLAYER BUILDINGS - - - - - -
      const mapBuildingArray: any[] = [];
      playerBuildings.map((elem: any, key: number) => {
        mapBuildingArray[key] = [];
        mapBuildingArray[key].blockY = elem.blockY;
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
      const staticResources: any = await getStaticResources(land[0].biomeId);
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
      playerArray["landId" as any] = land[0].id;
      playerArray["id" as any] = land[0].fk_userid;
      playerArray["biomeId" as any] = land[0].biomeId;

      //  - - - - - - DATA IN ARRAYS - - - - - - END

      dispatch({
        type: "set_gameSession",
        player: playerArray,
        fullMap: fullMapArray,
        actions: playerActions,
        inventory: inventoryArray,
        playerBuilding: mapBuildingArray,
        staticBuildings: fixBuildVal,
        staticResources: fixResVal,
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

  const updateHarvestActions = React.useCallback(
    async (
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
          currArr[posY][posX].harvestDelay = 1000;
        } else {
          currArr[posY] = [];
          currArr[posY][posX] = [];
          currArr[posY][posX].uid = uid;
          currArr[posY][posX].status = status;
          currArr[posY][posX].harvestStartTime = time;
          currArr[posY][posX].harvestDelay = 1000;
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

  const executeHarvest = React.useCallback(
    (
      _posX: number,
      _posY: number,
      _state: number,
      _status: number,
      _inventory: any[]
    ) => {
      // Update land block
      const _map = state.fullMap;
      console.log("state.fullMap", state.fullMap);
      console.log("_map", _map);
      // console.log('_map block', _map[_posY])
      // _map[_posY][_posX].state = _state;

      // update harvestingArr
      const currArr = state.harvestActions;
      if (currArr && currArr[_posY] != undefined) {
        if (!currArr[_posY][_posX]) currArr[_posY][_posX] = [];
        currArr[_posY][_posX].status = _status;
        currArr[_posY][_posX].harvestStartTime = Date.now();
        currArr[_posY][_posX].harvestDelay = 1000;
      } else {
        currArr[_posY] = [];
        currArr[_posY][_posX] = [];
        currArr[_posY][_posX].status = _status;
        currArr[_posY][_posX].harvestStartTime = Date.now();
        currArr[_posY][_posX].harvestDelay = 1000;
      }

      dispatch({
        type: "set_executeHarvest",
        map: _map,
        inventory: _inventory,
        harvestingArr: currArr,
      });
    },
    []
  );

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
        initPlayer,
        initGameSession,
        addAction,
        updateInventory,
        updateHarvestActions,
        updateMapBlock,
        executeHarvest,
      }}
    >
      {props.children}
    </NewStateContext.Provider>
  );
};

export default NewStateContext;
