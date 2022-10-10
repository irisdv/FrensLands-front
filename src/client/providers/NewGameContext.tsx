import { IStarknetWindowObject } from "get-starknet";
import React, { useReducer, useEffect, useState, useCallback } from "react";
import * as starknet from "starknet";
import uint256, { AccountInterface } from "starknet";

import { revComposeD, generateFullMap } from "../utils/land";
import { parsePipeResToArray, parseResToArray } from "../utils/utils";
import { fillStaticBuildings, fillStaticResources } from "../utils/static";
import { getStaticBuildings, getStaticResources } from "../api/static";

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
  landId: number;
  biomeId: number;
  fullMap: any[];
  inventory: any[];
  playerBuilding: any[];
  counterBuilding: number;
  counterRS: any[];
  payloadActions: any[];
  initPlayer: (wallet: IStarknetWindowObject) => void;
  initGameSession: (
    inventory: IInventory,
    land: ILand,
    playerActions: [],
    playerBuildings: IPlayerBuilding
  ) => void;
  addAction: (entrypoint: string, calldata: string) => void;
  updateInventory: (inventory: any[]) => void;
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
  landId: 0,
  biomeId: 0,
  fullMap: [],
  inventory: [],
  playerBuilding: [],
  counterBuilding: 0,
  counterRS: [],
  payloadActions: [],
  initPlayer: (wallet) => {},
  initGameSession: (inventory, land, playerActions, playerBuildings) => {},
  addAction: (entrypoint, calldata) => {},
  updateInventory: (inventory) => {},
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
  landId: number;
  biomeId: number;
  fullMap: any[];
  actions: any[];
  playerBuilding: any[];
  inventory: any[];
  staticResources: any[];
  staticBuildings: any[];
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
        landId: action.landId,
        biomeId: action.biomeId,
        fullMap: action.fullMap,
        payloadActions: action.actions,
        inventory: action.inventory,
        playerBuilding: action.playerBuilding,
        staticBuildings: action.staticBuildings,
        staticResources: action.staticResources,
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
      inventory: IInventory,
      land: ILand,
      playerActions: [],
      playerBuildings: IPlayerBuilding
    ) => {
      // console.log("inventory received = ", inventory);
      // console.log("player land received = ", land);
      // console.log("playerBuildings received = ", playerBuildings);
      // console.log("playerActions received = ", playerActions);

      //  - - - - - - PLAYER LAND - - - - - -
      // let test = generateFullMap();
      // console.log("test", test);

      const fullMapArray = revComposeD(land.fullMap);
      console.log("fullMapArray = ", fullMapArray);

      //  - - - - - - INVENTORY - - - - - -
      const inventoryArray: any[] = [];
      // inventoryArray[0] = inventory.wood;
      // inventoryArray[1] = inventory.rock;
      // inventoryArray[2] = inventory.food;
      inventoryArray[0] = 100;
      inventoryArray[1] = 100;
      inventoryArray[2] = 100;
      inventoryArray[3] = inventory.metal;
      inventoryArray[4] = inventory.coal;
      inventoryArray[5] = inventory.energy;
      inventoryArray[6] = inventory.coin;
      inventoryArray[7] = inventory.gold;
      // inventoryArray[8] = inventory.freePop;
      // inventoryArray[9] = inventory.totalPop;
      inventoryArray[8] = 100;
      inventoryArray[9] = 100;
      inventoryArray[10] = inventory.timeSpent;
      inventoryArray[11] = inventory.level;

      console.log("inventoryArray = ", inventoryArray);

      //  - - - - - - PLAYER BUILDINGS - - - - - -
      let i: number = 0;
      const mapBuildingArray: any[] = [];
      const mapBuildingTemp = Object.values(playerBuildings);

      while (i < mapBuildingTemp.length) {
        mapBuildingArray[i] = [];

        mapBuildingArray[i].blockX = mapBuildingTemp[i].blockX;
        mapBuildingArray[i].blockY = mapBuildingTemp[i].blockY;
        mapBuildingArray[i].posX = mapBuildingTemp[i].posX;
        mapBuildingArray[i].posY = mapBuildingTemp[i].posY;
        mapBuildingArray[i].id = mapBuildingTemp[i].fk_buildingid;
        mapBuildingArray[i].decay = mapBuildingTemp[i].decay;

        i++;
      }
      console.log("mapBuildingArray = ", mapBuildingArray);

      //  - - - - - - STATIC BUILDINGS - - - - - -
      const staticBuildings: any = await getStaticBuildings();
      const fixBuildVal: any[] = fillStaticBuildings(staticBuildings);
      console.log("fixBuildVal = ", fixBuildVal);

      //  - - - - - - STATIC RESOURCES - - - - - -
      const staticResources: any = await getStaticResources();
      const fixResVal: any[] = fillStaticResources(staticResources);
      console.log("fixResVal = ", fixResVal);

      //  - - - - - - HARVEST - - - - - -

      const harvestIncoming: any[] = [];

      //  - - - - - - DATA IN ARRAYS - - - - - - END

      dispatch({
        type: "set_gameSession",
        landId: land.id,
        biomeId: land.biomeId,
        fullMap: fullMapArray,
        actions: playerActions,
        inventory: inventoryArray,
        playerBuilding: mapBuildingArray,
        staticBuildings: fixBuildVal,
        staticResources: fixResVal,
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
        landId: state.landId,
        biomeId: state.biomeId,
        fullMap: state.fullMap,
        inventory: state.inventory,
        playerBuilding: state.playerBuilding,
        counterBuilding: state.counterBuilding,
        counterRS: state.counterRS,
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
