import React, {
    useReducer,
    useEffect,
    useState,
    useCallback,
    useContext,
    Fragment,
    ReactFragment,
  } from "react";
  import * as starknet from "starknet";
  import { defaultProvider, number, uint256 } from "starknet";
  import { toBN } from "starknet/dist/utils/number";
  import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256'
  import { BuildingFrame } from "../components/GameUI/BuildingFrame";
  
  import { useBuildingsContract } from "../hooks/contracts/buildings";
  import { useWorldsContract } from "../hooks/contracts/worlds";
  import { useResourcesContract } from "../hooks/contracts/resources";
  import { useFrensCoinsContract } from "../hooks/contracts/frenscoins";
  import { useMapsContract } from "../hooks/contracts/maps";
  import { useERC1155Contract } from "../hooks/contracts/erc1155";
  import { useStarknet } from "@starknet-react/core";
  import { GetBlockResponse } from 'starknet'
  
  
  export interface IFrame {
    id?: number;
    unique_id?: string;
    level?: number;
    posX?: any;
    posY?: any;
    selected?: any;
  }
  
  export interface IPopUp {
    id?: number; // id of bat_type
    unique_id?: string;
    type?: number;
    posX?: any;
    posY?: any;
    pop?: number;
  }
  
  export interface ISelectState {
    showFrame?: boolean;
    frameData?: IFrame;
    updateBuildingFrame: (show: boolean, data: {}) => void;
    sound?: boolean
    updateSound: (val : boolean) => void;
    tutorial?: boolean
    updateTutorial: (val : boolean) => void;
  }
  
  export const SelectState: ISelectState = {
    showFrame: false,
    frameData: undefined,
    updateBuildingFrame: (show, data) => {},
    sound: true,
    updateSound: (val) => {},
    tutorial: true,
    updateTutorial: (val) => {},
  };
  
  const SelectContext = React.createContext(SelectState);
  
  interface SetError {
    type: "set_error";
    error: Error;
  }
  
  interface SetShowFrame {
    type: "set_showFrame";
    showFrame?: boolean;
    frameData?: IFrame;
    buildingSelected?: number;
  }

  interface SetSound {
    type: "set_sound";
    sound?: boolean
  }

  interface SetTutorial {
    type: "set_tutorial";
    tutorial?: boolean
  }
  
  type Action =
    | SetShowFrame
    | SetSound
    | SetTutorial
    | SetError;
  
  function reducer(state: ISelectState, action: Action): ISelectState {
    switch (action.type) {
      case "set_showFrame": {
        return { ...state, 
          showFrame: action.showFrame, 
          frameData: action.frameData,
        };
      }
      case "set_sound": {
        return { ...state, 
          sound: action.sound
        };
      }
      case "set_tutorial": {
        return { ...state, 
          tutorial: action.tutorial
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
  
  
  export const SelectStateProvider: React.FC<
    React.PropsWithChildren<{ children: any }>
  > = (props: React.PropsWithChildren<{ children: any }>): React.ReactElement => {  
    const [state, dispatch] = useReducer(reducer, SelectState);

    const updateBuildingFrame = React.useCallback((show: boolean, data: {}) => {
        dispatch({
          type: "set_showFrame",
          showFrame: show,
          frameData: data
        });
      },
      []
    );

    const updateSound = React.useCallback((val: boolean) => {
      dispatch({
        type: "set_sound",
        sound: val,
      });
    },
    []
  );

  const updateTutorial = React.useCallback((val: boolean) => {
    dispatch({
      type: "set_tutorial",
      tutorial: val,
    });
  },
  []
);

    return (
      <SelectContext.Provider
        value={{
          frameData: state.frameData,
          showFrame: state.showFrame,
          updateBuildingFrame,
          sound: state.sound,
          updateSound,
          tutorial: state.tutorial,
          updateTutorial
        }}
      >
        {props.children}
      </SelectContext.Provider>
    );
  };
  
  export default SelectContext;
  