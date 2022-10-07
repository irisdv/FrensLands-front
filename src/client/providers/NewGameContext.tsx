import { IStarknetWindowObject } from "get-starknet";
import React, { useReducer, useEffect, useState, useCallback } from "react";
import * as starknet from "starknet";
import uint256, { AccountInterface } from "starknet";

export interface ILand {
  id: number;
  biomeId: number;
  fullMap: string;
}

export interface IInventory {
  wood: number;
  rock: number;
  food: number;
  metal: number;
  coal: number;
  energy: number;
  coin: number;
  totalPop: number;
  freePop: number;
  timeSpent: number;
  level: number;
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
    inventory: IInventory,
    land: ILand,
    playerActions: [],
    playerBuildings: []
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

    console.log("compMap", compMapSplit);

    while (i < compMapSplit.length) {
      if (x > 40) {
        y++;
        tempArray[y] = [];
        x = 0;
      }

      tempArray[y][x] = [];
      tempArray[y][x].resType = parseInt(compMapSplit[i][0]);
      tempArray[y][x].type = parseInt(compMapSplit[i][1] + compMapSplit[i][2]);
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

      x++;
      i++;
    }

    console.log("tempArray", tempArray);

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
      let tempUID: string = "0";
      let state: any = 0;
      let fertility: number = 99;
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
        fertility = 0;
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
        fullMap.toString() +
        parseInt(
          infraType.toString() +
            resType.toString() +
            type.toString() +
            tempUID.toString() +
            state.toString() +
            fertility.toString()
        ) +
        "|";

      i++;
    }

    console.log("fullMap", fullMap);
    return fullMap;
  };

  const getStaticResources = async () => {
    await fetch(`http://localhost:3001/api/static_resources_spawned`, {
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      return await response.json();
    });
    // .then(async (data) => {
    //   console.log("static resources spawned retrieved", data);
    //   let response = await data;
    //   return response;
    // });
  };

  const getStaticBuildings = () => {
    return fetch(`http://localhost:3001/api/static_buildings`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("static buildings retrieved", data);
        return data;
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const initGameSession = React.useCallback(
    async (
      inventory: IInventory,
      land: ILand,
      playerActions: [],
      playerBuildings: []
    ) => {
      console.log("inventory received", inventory.wood);
      console.log("playerBuildings", playerBuildings);

      // for (const key in inventory) {
      //   console.log(`${key}: ${inventory[key]}`);
      // }

      revComposeD(
        "10300112199|10300112199|10300112199|10300112199|10300112199"
      );

      generateFullMap();

      let staticBuildings: any = await getStaticBuildings();

      // .then((res) => {
      //   staticBuildings = res;
      //   return staticBuildings;
      //   // Object.keys(staticBuildings)
      // })
      console.log("staticBuildings", staticBuildings);

      // const keys = Object.keys(staticBuildings);

      Object.keys(staticBuildings).map((key: any) => {
        console.log("building", staticBuildings[key]);
      });

      // for (const i in staticBuildings) {
      //   console.log(staticBuildings[i]);
      // }
      // keys.forEach((key, index) => {

      //   console.log(`${key}: ${staticBuildings[key] as any}`);
      // });

      // getStaticResources();

      //   TODO : transform land.fullMap into the correct array format

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
