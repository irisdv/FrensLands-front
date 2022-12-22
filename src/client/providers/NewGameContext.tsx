import React, { useReducer, useEffect, useState, useCallback } from "react";
import { GetBlockResponse } from "starknet";
import { fillStaticBuildings, fillStaticResources } from "../utils/static";
import { initCounters, composeCycleRegister } from "../utils/building";
import { BuildDelay, HarvestDelay } from "../utils/constant";
import { bulkUpdateActions, fuelProdEffective } from "../api/player";
import { IStarknetWindowObject } from "get-starknet";
import { allResources } from "../data/resources";
import { allBuildings } from "../data/buildings";

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
  player: any; // player information (uid, landId, tokenId)
  fullMap: any[]; // fullMap array
  inventory: any[]; // player inventory (resources, level, timeSpent)
  playerBuilding: any[]; // player array of buildings
  counters: any[]; // player counters (resources spawned, total buildings, inactive / active buildings, last building uid)
  payloadActions: any[]; // actions array to be sent onchain
  cycleRegister: any[];
  initPlayer: (wallet: IStarknetWindowObject) => void;
  initGameSession: (landId: number) => void;
  addAction: (action: any) => void;
  updateActions: (actionArray: any[]) => void;
  updateInventory: (inventory: any[]) => void;
  updatePlayerBuildingEntry: (_playerBuilding: any[]) => void;
  updatePlayerBuildings: (_playerBuilding: any[]) => void;
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
  updateCycleRegister: (cycleRegister: any[]) => void;
  updateCounters: (counters: any[]) => void;
  updateClaimRegister: (claimRegister: string) => void;
}

export const NewGameState: INewGameState = {
  staticResources: [],
  staticBuildings: [],
  timeSpent: 0,
  wallet: null,
  player: [],
  fullMap: [],
  inventory: [],
  playerBuilding: [],
  counters: [],
  payloadActions: [],
  incomingArray: [],
  cycleRegister: [],
  initPlayer: (wallet) => {},
  initGameSession: (landId) => {},
  addAction: (value) => {},
  updateActions: (actionArray) => {},
  updateInventory: (inventory) => {},
  updatePlayerBuildingEntry: (_playerBuilding) => {},
  updatePlayerBuildings: (_playerBuilding) => {},
  // Harvest actions
  incomingActions: [],
  updateIncomingActions: (infraType, posX, posY, uid, time, status) => {},
  updateMapBlock: (_map) => {},
  transactions: [],
  updateTransactions: (tx) => {},
  removeTransaction: (transaction_hash) => {},
  updateCycleRegister: (cycleRegister) => {},
  updateCounters: (counters) => {},
  updateClaimRegister: (claimRegister) => {},
};

const NewStateContext = React.createContext(NewGameState);

interface SetStarknet {
  type: "set_starknet";
  wallet: IStarknetWindowObject;
}
interface SetPlayer {
  type: "set_player";
  player: any[];
}

// Setup player session
interface SetGameSession {
  type: "set_gameSession";
  address?: string;
  player: any[];
  fullMap?: any[];
  actions?: any[];
  playerBuilding?: any[];
  inventory?: any[];
  staticResources: any[];
  staticBuildings: any[];
  counters?: any[];
  incomingArray?: any[];
  transactions?: any[];
  cycleRegister?: any[];
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
interface SetPlayerBuilding {
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

interface SetCycleRegister {
  type: "set_cycleRegister";
  cycleRegister: any[];
}

interface SetCounters {
  type: "set_counters";
  counters: any[];
}

interface SetError {
  type: "set_error";
  error: Error;
}

type Action =
  | SetPlayer
  | SetStarknet
  | SetGameSession
  | SetError
  | SetPayloadAction
  | SetInventory
  | SetPlayerBuilding
  | SetIncomingAction
  | SetFullMap
  | SetPayloadActions
  | SetCycleRegister
  | SetCounters
  | SetTransactions;

function reducer(state: INewGameState, action: Action): INewGameState {
  switch (action.type) {
    case "set_starknet": {
      return {
        ...state,
        wallet: action.wallet,
      };
    }
    case "set_player": {
      return {
        ...state,
        player: action.player,
      };
    }
    case "set_gameSession": {
      return {
        ...state,
        player: action.player,
        // fullMap: action.fullMap,
        // payloadActions: action.actions,
        // inventory: action.inventory,
        // playerBuilding: action.playerBuilding,
        staticBuildings: action.staticBuildings,
        staticResources: action.staticResources,
        // counters: action.counters,
        // incomingArray: action.incomingArray,
        // transactions: action.transactions,
        // cycleRegister: action.cycleRegister,
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
      console.log("updating playerBuilding", action.playerBuilding);
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
    case "set_cycleRegister": {
      return {
        ...state,
        cycleRegister: action.cycleRegister,
      };
    }
    case "set_counters": {
      return {
        ...state,
        counters: action.counters,
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
  const [block, setBlock] = useState<GetBlockResponse | undefined>(undefined);
  const [isInit, setIsInit] = useState(false);
  const [loading, setLoading] = useState<boolean | undefined>(undefined);

  const {
    playerBuilding,
    transactions,
    payloadActions,
    fullMap,
    player,
    counters,
    cycleRegister,
  } = state;

  useEffect(() => {
    if (state.wallet && isInit && transactions && transactions.length > 0) {
      const _rejectedTx: any[] = [];
      transactions.map((transaction: any) => {
        if (transaction.code == "TRANSACTION_RECEIVED") {
          state.wallet.account
            .getTransactionReceipt(transaction.transaction_hash as string)
            .then((res: any) => {
              console.log("getTransactionReceipt", res);
              if (res.status == "REJECTED") {
                transaction.code = "REJECTED";
                payloadActions.map((action: any) => {
                  if (action.txHash == transaction.transaction_hash) {
                    action.status = "REJECTED";
                    _rejectedTx.push(action);
                  }
                });
              }
            });
        }
      });
      if (_rejectedTx && _rejectedTx.length > 0) {
        const _update = bulkUpdateActions(player, payloadActions);
        updateActions(payloadActions);
      }
    }
  }, [state.wallet, isInit, transactions]);

  useEffect(() => {
    if (
      block != null &&
      playerBuilding &&
      cycleRegister &&
      !isInit &&
      (player.claimRegister || player.claimRegister == 0)
    ) {
      const currentBlock = block.block_number;
      let lastClaimedBlock: number;
      if (player.claimRegister == 0) {
        lastClaimedBlock = 0;
      } else {
        const _last = player.claimRegister.split("|");
        lastClaimedBlock = parseInt(_last[_last.length - 1]);
      }

      Object.keys(cycleRegister).forEach((gameUid: any) => {
        cycleRegister[gameUid].map((fuelData: any) => {
          console.log("fuelData", fuelData);
          const blockStart = fuelData[0];
          const blockEnd = fuelData[1];

          if (blockStart > lastClaimedBlock) {
            // Rien n'a été claim dans ce fuel

            // Check par rapport au current block où on en est
            if (blockEnd <= currentBlock) {
              //
              playerBuilding[gameUid].activeCycles += blockEnd - blockStart;
            } else {
              // une partie seulement du fuel est passée
              const _activeCycles = currentBlock - blockStart;
              console.log("_activeCycles", _activeCycles);
              playerBuilding[gameUid].activeCycles += _activeCycles;
              playerBuilding[gameUid].incomingCycles += blockEnd - currentBlock;
              console.log("blockEnd - _activeCycles", blockEnd - currentBlock);
            }
          } else {
            if (blockEnd > lastClaimedBlock) {
              // Une partie n'a pas été claimed
              const _remainingCycles = blockEnd - lastClaimedBlock;
              if (blockEnd <= currentBlock) {
                // tout est déjà passé
                playerBuilding[gameUid].activeCycles += _remainingCycles;
              } else {
                // une partie seulement
                const _activeCycles = currentBlock - lastClaimedBlock;
                playerBuilding[gameUid].activeCycles += _activeCycles;
                playerBuilding[gameUid].incomingCycles +=
                  blockEnd - currentBlock;
              }
            }
          }
        });
      });

      // Init counters
      const { incomingInventory, inactive, active, nbBlocksClaimable } =
        initCounters(playerBuilding, state.staticBuildings);
      counters["incomingInventory" as any] = incomingInventory;
      counters["inactive" as any] = inactive;
      counters["active" as any] = active;
      counters["blockClaimable" as any] = nbBlocksClaimable;
      console.log("counter", counters);
      setIsInit(true);
    }
  }, [block, player, playerBuilding, counters]);

  const fetchBlock = useCallback(() => {
    if (state.wallet) {
      state.wallet.account
        .getBlock()
        .then((newBlock: any) => {
          setBlock((oldBlock) => {
            if (oldBlock?.block_hash === newBlock.block_hash) {
              return oldBlock;
            }

            // Update incoming & active cycles of each building
            playerBuilding.map((building: any) => {
              if (building.incomingCycles > 0) {
                building.incomingCycles -= 1;
                building.activeCycles += 1;

                // update active inactive counters
                if (building.incomingCycles == 0) {
                  counters["inactive" as any] += 1;
                  counters["active" as any] -= 1;
                }

                // update incomingInventories & blockClaimable in counters
                for (let i = 0; i < 8; i++) {
                  counters["incomingInventory" as any][i] +=
                    state.staticBuildings[building.type - 1].production[i];
                }
                counters["blockClaimable" as any] += 1;
              }
            });

            // Loop through ongoing transactions to check if it was validated
            transactions.map((ongoing: any) => {
              const tx = newBlock.transactions.filter((transaction: any) => {
                return transaction.transaction_hash == ongoing.transaction_hash;
              });
              if (tx.length > 0) {
                console.log("Tx accepted onchain", tx);

                // update status in transactions array to fire notification
                ongoing.code = "ACCEPTED_ON_L2";
                ongoing.show = true;

                // Update payloadActions included in this tx
                const bulkUpdate: any[] = [];
                payloadActions.map((action: any, index: number) => {
                  if (action.txHash === ongoing.transaction_hash) {
                    // console.log('same', action.entrypoint)

                    action.validated = true;
                    action.status = "ACCEPTED_ON_L2";
                    bulkUpdate.push(action);

                    // Cas action build
                    if (action.entrypoint == "build") {
                      // Increase incoming cycles by 1 in context
                      const calldata = action.calldata.split("|");
                      const gameId =
                        fullMap[parseInt(calldata[3])][parseInt(calldata[2])]
                          .id;

                      if (
                        fullMap[parseInt(calldata[3])][parseInt(calldata[2])]
                          .type > 3
                      ) {
                        playerBuilding[gameId].incomingCycles += 1;
                        cycleRegister[gameId] = [];
                        cycleRegister[gameId].push([
                          newBlock.block_number,
                          newBlock.block_number + 1,
                        ]);

                        // update counters
                        counters["inactive" as any] -= 1;
                        counters["active" as any] += 1;
                      }
                    } else if (
                      action.entrypoint == "fuel_building_production"
                    ) {
                      // console.log('entrypoint FUEL BUILDING PRODUCTION')
                      // Cas action fuel building production
                      const calldata = action.calldata.split("|");
                      const gameId =
                        fullMap[parseInt(calldata[3])][parseInt(calldata[2])]
                          .id;
                      // console.log('playerBuilding[gameId].incomingCycles', playerBuilding[gameId].incomingCycles)
                      // console.log('cycleRegister', cycleRegister)
                      const _lastRegister =
                        cycleRegister[gameId][cycleRegister[gameId].length - 1];
                      // console.log('_lastRegister', _lastRegister)
                      if (_lastRegister[1] < newBlock.block_number) {
                        // Update cycleRegister and playerBuilding incoming cycles
                        cycleRegister[gameId].push([
                          newBlock.block_number,
                          newBlock.block_number + parseInt(calldata[4]),
                        ]);
                      } else {
                        cycleRegister[gameId].push([
                          _lastRegister[1],
                          _lastRegister[1] + parseInt(calldata[4]),
                        ]);
                      }
                      if (playerBuilding[gameId].incomingCycles == 0) {
                        counters["inactive" as any] -= 1;
                        counters["active" as any] += 1;
                      }
                      playerBuilding[gameId].incomingCycles += parseInt(
                        calldata[4]
                      );
                    }
                  }
                });

                let cycleRegisterStr: any = composeCycleRegister(cycleRegister);
                if (player.cycleRegister !== cycleRegisterStr) {
                  player.cycleRegister = cycleRegisterStr;
                } else {
                  cycleRegisterStr = 0;
                }

                const _updateAfterValidated = fuelProdEffective(
                  player,
                  bulkUpdate,
                  cycleRegisterStr
                );

                const payloadActionsFiltered = payloadActions.filter(
                  (elem: any) => {
                    return elem.txHash != ongoing.transaction_hash;
                  }
                );
                console.log("payloadActionsFiltered", payloadActionsFiltered);
                // Update values in context w/ dispatch
                updateActions(payloadActionsFiltered);
                updateTransactions(transactions);
                updatePlayerBuildings(playerBuilding);
                updateCycleRegister(cycleRegister);
                updateCounters(counters);
              }
            });

            // TODO handle tx rejected
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
    payloadActions,
    player,
    playerBuilding,
    transactions,
    fullMap,
    counters,
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

  const addAction = React.useCallback(
    (value: any) => {
      dispatch({
        type: "set_payloadAction",
        action: value,
      });
    },
    [dispatch]
  );

  const updateActions = React.useCallback(
    (actionArray: any[]) => {
      dispatch({
        type: "set_payloadActions",
        actionArray,
      });
    },
    [dispatch, payloadActions]
  );

  const updateTransactions = React.useCallback(
    (txArray: any[]) => {
      console.log("transactions received", txArray);
      dispatch({
        type: "set_transactions",
        transactions: txArray,
      });
    },
    [dispatch, transactions]
  );

  const initPlayer = React.useCallback(
    (wallet: IStarknetWindowObject) => {
      dispatch({
        type: "set_starknet",
        wallet,
      });
    },
    [dispatch]
  );

  const initGameSession = React.useCallback(
    async (tokenId: number) => {
      //  - - - - - - STATIC BUILDINGS - - - - - -
      const staticBuildings = allBuildings;
      const fixBuildVal: any[] = fillStaticBuildings(staticBuildings);
      console.log("fixBuildVal = ", fixBuildVal);

      //  - - - - - - STATIC RESOURCES - - - - - -
      const biomeId =
        tokenId <= 50
          ? 1
          : tokenId <= 100
          ? 2
          : tokenId <= 150
          ? 3
          : tokenId <= 200
          ? 4
          : 5;
      const staticResources = allResources.filter(
        (res) => res.biomeId == biomeId
      );
      const fixResVal: any[] = fillStaticResources(staticResources);
      console.log("fixResVal = ", fixResVal);
      //  - - - - - - PLAYER ARRAY - - - - - -

      const playerArray: any = [];
      // playerArray.landId = land.id;
      playerArray.tokenId = tokenId;
      // playerArray.id = userId;
      playerArray.biomeId = biomeId;
      // playerArray.cycleRegister = land.cycleRegister || ""; // String buildingGameUid-blockStart-blockEnd | ...
      // playerArray.claimRegister = land.claimRegister || 0; // String avec blockNb|blockNb
      playerArray.cycleRegister = "";
      playerArray.claimRegister = 0;
      console.log("playerArray", playerArray);

      //  - - - - - - ONGOING TX - - - - - -

      // const transactions: any[] = [];
      // const ongoingTx = land.player_actions.filter((action: any) => {
      //   return action.status == "TRANSACTION_RECEIVED";
      // });
      // const txArr: any = [];
      // if (ongoingTx && ongoingTx.length > 0) {
      //   ongoingTx.map((tx: any) => {
      //     if (!txArr[tx.txHash]) {
      //       transactions.push({
      //         code: tx.status,
      //         transaction_hash: tx.txHash,
      //       });
      //       txArr[tx.txHash] = [];
      //     }
      //   });
      // }

      // ----- FUEL + CLAIM initialization ----

      dispatch({
        type: "set_gameSession",
        player: playerArray,
        // fullMap: map,
        // actions: playerActions,
        // inventory: inventory,
        // playerBuilding: mapBuildingArray,
        staticBuildings: fixBuildVal,
        staticResources: fixResVal,
        // incomingArray,
        // counters,
        // transactions,
        // cycleRegister: register,
      });
    },
    [dispatch, transactions]
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
    [dispatch]
  );

  const updateMapBlock = React.useCallback(
    (_map: any[]) => {
      dispatch({
        type: "set_fullMap",
        map: _map,
      });
    },
    [dispatch]
  );

  // Send new entry of building to update
  const updatePlayerBuildingEntry = React.useCallback(
    (_playerBuilding: any) => {
      const _filteredArr = playerBuilding.filter((elem) => {
        return elem.gameUid != _playerBuilding.gameUid;
      });
      _filteredArr[_playerBuilding.gameUid] = _playerBuilding;
      dispatch({
        type: "set_playerBuilding",
        playerBuilding: _filteredArr,
      });
    },
    [dispatch, playerBuilding]
  );

  const updatePlayerBuildings = React.useCallback(
    (_playerBuildings: any) => {
      dispatch({
        type: "set_playerBuilding",
        playerBuilding: _playerBuildings,
      });
    },
    [dispatch, playerBuilding]
  );

  const removeTransaction = React.useCallback(
    (transaction_hash: string) => {
      const index = state.transactions
        .map(function (e) {
          return e.transaction_hash;
        })
        .indexOf(transaction_hash);

      const _transactions = state.transactions;

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
    },
    [state, state.transactions]
  );

  const updateCycleRegister = React.useCallback(
    (cycleRegister: any[]) => {
      dispatch({
        type: "set_cycleRegister",
        cycleRegister,
      });
    },
    [dispatch, state, cycleRegister]
  );

  const updateCounters = React.useCallback(
    (counters: any[]) => {
      dispatch({
        type: "set_counters",
        counters,
      });
    },
    [dispatch, state, counters]
  );

  const updateClaimRegister = React.useCallback(
    (claimRegister: string) => {
      player.claimRegister = claimRegister;
      dispatch({
        type: "set_player",
        player,
      });
    },
    [dispatch, player]
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
        updatePlayerBuildingEntry,
        updatePlayerBuildings,
        playerBuilding: state.playerBuilding,
        counters: state.counters,
        payloadActions: state.payloadActions,
        incomingActions: state.incomingActions,
        incomingArray: state.incomingArray,
        cycleRegister: state.cycleRegister,
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
        updateCycleRegister,
        updateCounters,
        updateClaimRegister,
      }}
    >
      {props.children}
    </NewStateContext.Provider>
  );
};

export default NewStateContext;
