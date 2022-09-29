import { IStarknetWindowObject } from "get-starknet";
import React, { useReducer, useEffect, useState, useCallback } from "react";
import * as starknet from "starknet";
import uint256, { AccountInterface } from "starknet";

export interface ILand {
  id: number;
  biomeId: number;
  fullMap: string;
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
    inventory: {},
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

  const initGameSession = React.useCallback(
    (inventory: {}, land: ILand, playerActions: [], playerBuildings: []) => {
      console.log("inventory received", inventory);

      //   TODO : transform land.fullMap into the correct array format

      dispatch({
        type: "set_gameSession",
        landId: land.id,
        biomeId: land.biomeId,
        // fullMap: land.fullMap,
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
