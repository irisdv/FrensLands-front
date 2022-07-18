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
  import { List } from 'immutable'
  
  export interface BuildingManagerState {
    buildings: List<IBuilding>,
  }

  export interface IBuilding {
    id?: number;
    unique_id?: number;
    type_id?: string;
    posX?: any;
    posY?: any;
    status?: any; // en cours, construit
  }
  
  export interface IBuildingState {
    buildingList?: IBuilding[];
    addBuilding: (data: {}) => void;
  }
  
  export const BuildingState: IBuildingState = {
    buildingList: [],
    addBuilding: (data) => {}
  };
  
  const BuildingContext = React.createContext(BuildingState);
  
  interface SetError {
    type: "set_error";
    error: Error;
  }
  
  interface AddBuilding {
    type: "add_building";
    buildingItem: {data: IBuilding}
  }
  
  type Action =
    | AddBuilding
    | SetError;
  
  function reducer(state: BuildingManagerState, action: Action): BuildingManagerState {
    switch (action.type) {
      case "add_building": {

        const { data } = action.buildingItem
        return {
            ...state,
            buildings: state.buildings?.push(data)
          }
      }
      case "set_error": {
        throw new Error(`Unhandled action type: ${action.type}`);
      }
      default: {
        return state;
      }
    }
  }
  
  
  export const BuildingStateProvider: React.FC<
    React.PropsWithChildren<{ children: any }>
  > = (props: React.PropsWithChildren<{ children: any }>): React.ReactElement => {
    // const [timer, setTimer] = useState(Date.now());
    // const { contract: building } = useBuildingsContract();
    // const { contract: worlds } = useWorldsContract();
    // const { contract: resources } = useResourcesContract();
    // const { contract: erc1155 } = useERC1155Contract();
    // const { contract: coins } = useFrensCoinsContract();
    // const { contract: maps } = useMapsContract();
  
    // const [state, dispatch] = useReducer(reducer, BuildingState);
    const [state, dispatch] = useReducer(reducer, {
        buildings: List<IBuilding>(),
      })
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

    const addBuilding = React.useCallback((data: IBuilding) => {
      console.log('in dispatch building', data)
        dispatch({
          type: "add_building",
          buildingItem: {data: data}
        });
      },
      []
    );

  
    return (
      <BuildingContext.Provider
        value={{
            buildingList: state.buildings.toArray(),
            addBuilding
        }}
      >
        {props.children}
      </BuildingContext.Provider>
    );
  };
  
  export default BuildingContext;
  