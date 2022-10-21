import { IStarknetWindowObject } from "@starknet-react/core";
import React, { useReducer, useEffect, useState, useCallback } from "react";
import { GetBlockResponse } from "starknet";
import { revComposeD } from "../utils/land";
import { fillStaticBuildings, fillStaticResources } from "../utils/static";
import { getStaticBuildings, getStaticResources } from "../api/static";
import { incomingComposeD, incomingCompose } from "../utils/building";
import { BuildDelay, HarvestDelay } from "../utils/constant";
import { bulkUpdateActions, updateIncomingInventories } from "../api/player";

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
  staticResources: any[]; // static data resources spawned
  staticBuildings: any[]; // static data buildings
  timeSpent: number; // ! to delete
  wallet: any; // starknet
  player: any[]; // player information (uid, landId, tokenId)
  fullMap: any[]; // fullMap array
  inventory: any[]; // player inventory (resources, level, timeSpent)
  playerBuilding: any[]; // player array of buildings
  counters: any[]; // player counters (resources spawned, total buildings, inactive / active buildings, last building uid)
  payloadActions: any[]; // actions array to be sent onchain
  initPlayer: (wallet: IStarknetWindowObject) => void;
  initGameSession: (
    inventory: any,
    land: any,
    playerActions: any,
    playerBuildings: [],
    account: string,
    userId: string
  ) => void;
  addAction: (action: any) => void;
  updateActions: (actionArray: any[]) => void;
  updateInventory: (inventory: any[]) => void;
  updatePlayerBuilding: (_playerBuilding: any[]) => void;
  // Harvest actions
  // TODO check l'utilité des deux
  incomingArray: any[]; // incoming harvest actions
  incomingActions: any[]; // incoming actions overall
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
  updateTransactions: (transactions: any[]) => void;
  removeTransaction: (transaction_hash: string) => void;
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
  addAction: (value) => {},
  updateActions: (actionArray) => {},
  updateInventory: (inventory) => {},
  updatePlayerBuilding: (_playerBuilding) => {},
  // Harvest actions
  incomingActions: [],
  updateIncomingActions: (infraType, posX, posY, uid, time, status) => {},
  updateMapBlock: (_map) => {},
  transactions: [],
  updateTransactions: (tx) => {},
  removeTransaction: (transaction_hash) => {},
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
  transactions: any[];
}

interface SetPayloadAction {
  type: "set_payloadAction";
  action: any;
}

interface SetPayloadActions {
  type: "set_payloadActions";
  actionArray: any[];
}
interface SetTransactions {
  type: "set_transactions";
  transactions: any[];
}

interface SetInventory {
  type: "set_inventory";
  inventory: any[];
}
interface SetPlayerBuildings {
  type: "set_playerBuilding";
  playerBuilding: any[];
}
interface SetIncomingAction {
  type: "set_incomingAction";
  incomingArr: any[];
}
interface SetFullMap {
  type: "set_fullMap";
  map: any[];
}

// interface SetExecuteHarvest {
//   type: "set_executeHarvest";
//   inventory: any[];
//   map: any[];
//   harvestingArr: any[];
// }

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
  | SetIncomingAction
  | SetFullMap
  | SetPayloadActions
  | SetTransactions;
// | SetExecuteHarvest;

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
        transactions: action.transactions,
      };
    }
    case "set_payloadAction": {
      const currentPayload = state.payloadActions;
      console.log("state.payloadActions", state.payloadActions);
      currentPayload.push(action.action);
      console.log("current payload", currentPayload);
      return {
        ...state,
        payloadActions: currentPayload,
      };
    }
    case "set_payloadActions": {
      return {
        ...state,
        payloadActions: action.actionArray,
      };
    }
    case "set_transactions": {
      return {
        ...state,
        transactions: action.transactions,
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
    case "set_incomingAction": {
      console.log("current payload harvest", action.incomingArr);
      return {
        ...state,
        incomingActions: action.incomingArr,
      };
    }
    case "set_fullMap": {
      return {
        ...state,
        fullMap: action.map,
      };
    }
    // case "set_executeHarvest": {
    //   console.log("actions", action);
    //   return {
    //     ...state,
    //     inventory: action.inventory,
    //     fullMap: action.map,
    //     harvestActions: action.harvestingArr,
    //   };
    // }
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
            // console.log("new block", newBlock);
            // console.log("transactions array", state.transactions);
            // console.log(
            //   "payload actions in context before",
            //   state.payloadActions
            // );

            state.transactions.map((ongoing: any) => {
              var tx = newBlock.transactions.filter((transaction: any) => {
                return transaction.transaction_hash == ongoing.transaction_hash;
              });
              console.log("tx", tx);
              if (tx.length > 0) {
                // console.log("Tx found in validated block", tx);

                // update status in transactions array
                ongoing.code = "ACCEPTED_ON_L2";

                // Update payloadActions
                var bulkUpdate: any[] = [];
                state.payloadActions.map((action: any, index: number) => {
                  if (action.txHash === ongoing.transaction_hash) {
                    action.validated = true;
                    action.status = "ACCEPTED_ON_L2";
                    bulkUpdate.push(state.payloadActions[index]);
                    state.payloadActions.splice(index, 1);
                  }
                });
                // console.log("bulkUpdate", bulkUpdate);
                if (bulkUpdate.length > 0)
                  bulkUpdateActions(state.player, bulkUpdate);

                // Update DB
                // console.log("payload actions in context", state.payloadActions);
              }
            });
            // console.log("transactions after map", state.transactions);
            // console.log("payload actions after map", state.payloadActions);

            // TODO call functions when block is updated
            // TODO show notif based on transactions array (when value equals to ACCEPTED_ON_L2)
            return newBlock;
          });
        })
        .catch((error: any) => {
          console.log("failed fetching block", error);
        })
        .finally(() => setLoading(false));
    }
  }, [
    setBlock,
    state.wallet,
    setLoading,
    state.payloadActions,
    state.transactions,
  ]);

  useEffect(() => {
    setLoading(true);

    // Fetch block immediately
    fetchBlock();

    const intervalId = setInterval(() => {
      fetchBlock();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchBlock]);

  const addAction = React.useCallback((value: any) => {
    console.log("action received", value);
    dispatch({
      type: "set_payloadAction",
      action: value,
    });
  }, []);

  const updateActions = React.useCallback((actionArray: any[]) => {
    console.log("action payload received", actionArray);
    dispatch({
      type: "set_payloadActions",
      actionArray: actionArray,
    });
  }, []);

  const updateTransactions = React.useCallback((txArray: any[]) => {
    console.log("transactions received", txArray);
    dispatch({
      type: "set_transactions",
      transactions: txArray,
    });
  }, []);

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

      const value = revComposeD(land.fullMap, account);
      console.log("fullMapArray = ", value.tempArray);

      //const composition = ComposeD(fullMapArray);

      // const fullMapArray = revComposeD(land.fullMap);
      //console.log("fullMapArray = ", fullMapArray);

      //  - - - - - - INVENTORY - - - - - -
      const inventoryArray: any[] = [];
      inventoryArray[0] = inventory[0].wood;
      inventoryArray[1] = inventory[0].rock;
      inventoryArray[2] = inventory[0].food;
      inventoryArray[3] = inventory[0].metal;
      inventoryArray[4] = inventory[0].coal;
      inventoryArray[5] = inventory[0].energy;
      inventoryArray[6] = inventory[0].coin;
      inventoryArray[7] = inventory[0].gold;
      inventoryArray[8] = inventory[0].freePop;
      inventoryArray[9] = inventory[0].totalPop;
      inventoryArray[10] = inventory[0].timeSpent;
      inventoryArray[11] = inventory[0].level;
      // inventoryArray[0] = 22;
      // inventoryArray[1] = 16;
      // inventoryArray[2] = 14;
      // inventoryArray[11] = 9;

      console.log("inventoryArray = ", inventoryArray);

      //  - - - - - - PLAYER BUILDINGS - - - - - -
      const mapBuildingArray: any[] = [];
      var lastUID = 0;
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
        if (elem.gameUid > lastUID) lastUID = elem.gameUid;
        if (elem.fk_buildingid == 1 && elem.decay == 0) {
          console.log("elem", elem);
          value.tempArray[elem.blockY][elem.blockX].status = 2;
        }
      });

      console.log("gameUid", lastUID);
      console.log("mapBuildingArray = ", mapBuildingArray);
      console.log("value.tempArray", value.tempArray);

      //  - - - - - - STATIC BUILDINGS - - - - - -
      const staticBuildings: any = await getStaticBuildings();
      console.log("static buildings", staticBuildings);

      const fixBuildVal: any[] = fillStaticBuildings(staticBuildings);
      console.log("fixBuildVal = ", fixBuildVal);

      //  - - - - - - STATIC RESOURCES - - - - - -
      const staticResources: any = await getStaticResources(land.biomeId);
      const fixResVal: any[] = fillStaticResources(staticResources);
      console.log("fixResVal = ", fixResVal);

      //  - - - - - - COUNTERS - - - - - -

      const buildingCounter = mapBuildingArray.length;
      console.log("buildingCounter", buildingCounter);

      var counters: any[] = value.counters;
      counters["buildings" as any] = buildingCounter;
      counters["uid" as any] = lastUID;

      //  - - - - - - PLAYER ARRAY - - - - - -

      const playerArray: any[] = [];
      playerArray["landId" as any] = land.id;
      playerArray["tokenId" as any] = land.tokenId;
      playerArray["id" as any] = userId;
      playerArray["biomeId" as any] = land.biomeId;
      playerArray["claimRegister" as any] = land.claimRegister || 0;
      console.log("playerArray", playerArray);

      //  - - - - - - INCOMING HARVESTS - - - - - -

      // Build incoming Array and update if action finished
      if (inventory[0].incomingInventories == null) {
        var incomingArray: any[] = [];
      } else {
        console.log(
          "inventory[0].incomingInventories",
          inventory[0].incomingInventories
        );
        var time = Date.now();
        var incomingArray: any[] = incomingComposeD(
          inventory[0].incomingInventories,
          time
        );
        var incomingArrStr = incomingCompose(incomingArray);
        let _updateArr = updateIncomingInventories(playerArray, incomingArrStr);
      }

      //  - - - - - - ONGOING TX - - - - - -

      var transactions: any[] = [];
      var ongoingTx = land.player_actions.filter((action: any) => {
        return action.status == "TRANSACTION_RECEIVED";
      });
      if (ongoingTx && ongoingTx.length > 0) {
        ongoingTx.map((tx: any) => {
          transactions.push({
            code: tx.status,
            transaction_hash: tx.txHash,
          });
        });
      }
      console.log("transactions in newGameContext", transactions);
      console.log("playerActions in newGameContext", playerActions);

      dispatch({
        type: "set_gameSession",
        player: playerArray,
        fullMap: value.tempArray,
        actions: playerActions,
        inventory: inventoryArray,
        playerBuilding: mapBuildingArray,
        staticBuildings: fixBuildVal,
        staticResources: fixResVal,
        incomingArray: incomingArray,
        counters: counters,
        transactions: transactions,
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
        state.incomingActions &&
        (status == 1 || status == 0)
      ) {
        const currArr = state.incomingActions;

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
          type: "set_incomingAction",
          incomingArr: currArr,
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

  const removeTransaction = React.useCallback((transaction_hash: string) => {
    const index = state.transactions
      .map(function (e) {
        return e.transaction_hash;
      })
      .indexOf(transaction_hash);

    let _transactions = state.transactions;

    if (_transactions[index].code == "TRANSACTION_RECEIVED") {
      _transactions[index].show = false;
    } else if (
      _transactions[index].code == "ACCEPTED_ON_L2" ||
      _transactions[index].code == "REJECTED"
    ) {
      _transactions.splice(index, 1);
    }
    dispatch({
      type: "set_transactions",
      transactions: _transactions,
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
        incomingActions: state.incomingActions,
        incomingArray: state.incomingArray,
        initPlayer,
        initGameSession,
        addAction,
        updateActions,
        updateInventory,
        updateIncomingActions,
        updateMapBlock,
        transactions: state.transactions,
        updateTransactions,
        removeTransaction,
      }}
    >
      {props.children}
    </NewStateContext.Provider>
  );
};

export default NewStateContext;
