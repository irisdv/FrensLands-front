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
    type?: number;
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
    test: string;

    // Select building to
    // buildEvent: (type_id: number) => void;
    // buildingSelected: number;
    // showPopUp
    // popUpData
    // mapType
  }
  
  export const SelectState: ISelectState = {
    showFrame: false,
    frameData: undefined,
    updateBuildingFrame: (show, data) => {},
    test: "test"
    // buildEvent: (type_id) => {},
    // buildingSelected: 0
  };
  
  const SelectContext = React.createContext(SelectState);
  const DispatchContext = React.createContext({});
  
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
  
  type Action =
    | SetShowFrame
    | SetError;
  
  function reducer(state: ISelectState, action: Action): ISelectState {
    switch (action.type) {
    //   case "set_frameData": {
    //     return { ...state, frameData: action.frameData };
    //   }
      case "set_showFrame": {
        return { ...state, 
          showFrame: action.showFrame, 
          frameData: action.frameData,
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
    const [timer, setTimer] = useState(Date.now());
    const { contract: building } = useBuildingsContract();
    const { contract: worlds } = useWorldsContract();
    const { contract: resources } = useResourcesContract();
    const { contract: erc1155 } = useERC1155Contract();
    const { contract: coins } = useFrensCoinsContract();
    const { contract: maps } = useMapsContract();
  
    const [state, dispatch] = useReducer(reducer, SelectState);
    // const value = React.useMemo(() => [state, dispatch], [state])
  
    // const buildEvent = React.useCallback((type : number) => {
    //   console.log('dispatching building selected ', type)
    //   // dispatch({
    //   //   type: "set_buildingSelected",
    //   //   buildingSelected: type as number
    //   // });
    //   if (state.buildingSelected != type) {
    //     console.log('dispatching building selected ', type)
    //     dispatch({
    //       type: "set_buildingSelected",
    //       buildingSelected: type as number
    //     });
    //   }
    // }, []);

    const updateBuildingFrame = React.useCallback((show: boolean, data: {}) => {
        dispatch({
          type: "set_showFrame",
          showFrame: show,
          frameData: data
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
          test: state.test
          // buildEvent,
          // buildingSelected: state.buildingSelected,
        }}
      >
        {props.children}
      </SelectContext.Provider>
    );
  };
  
  export default SelectContext;
  