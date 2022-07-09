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
import { BuildingFrame } from "../components/GameUI/BuildingFrame";

import { useBuildingsContract } from "../hooks/buildings";
import { useMapsContract } from "../hooks/maps";

export interface IGameState {
  address?: string | undefined;
  tokenId?: string;
  buildingCount?: number;
  mapArray?: any[];
  updateBuildings: (t: number) => void;
  setAddress: (addr: string) => void;
  updateTokenId: (id: string) => void;
  showFrame?: boolean;
  frameData?: any;
  updateBuildingFrame: (show: boolean, data: []) => void;
}

export const GameState: IGameState = {
  address: undefined,
  tokenId: "test",
  buildingCount: undefined,
  mapArray: [],
  updateBuildings: () => {},
  setAddress: () => {},
  updateTokenId: () => {},
  showFrame: false,
  frameData: undefined,
  updateBuildingFrame: (show, data) => {},
};

const StateContext = React.createContext(GameState);
const DispatchContext = React.createContext({});

interface SetAccount {
  type: "set_account";
  address?: string | undefined;
}

interface SetTokenId {
  type: "set_tokenId";
  tokenId?: string;
}

interface SetBuildingCount {
  type: "set_buildingCount";
  buildingCount?: number;
}

interface SetMapArray {
  type: "set_mapArray";
  mapArray?: any[];
}

interface SetError {
  type: "set_error";
  error: Error;
}

interface SetFrameData {
  type: "set_frameData";
  frameData?: any[];
}

interface SetShowFrame {
  type: "set_showFrame";
  showFrame?: boolean;
}

type Action =
  | SetAccount
  | SetTokenId
  | SetBuildingCount
  | SetMapArray
  | SetFrameData
  | SetShowFrame
  | SetError;

function reducer(state: IGameState, action: Action): IGameState {
  switch (action.type) {
    case "set_account": {
      return { ...state, address: action.address };
    }
    case "set_tokenId": {
      return { ...state, tokenId: action.tokenId };
    }
    case "set_buildingCount": {
      return { ...state, buildingCount: action.buildingCount };
    }
    case "set_mapArray": {
      return { ...state, mapArray: action.mapArray };
    }
    case "set_frameData": {
      return { ...state, frameData: action.frameData };
    }
    case "set_showFrame": {
      return { ...state, showFrame: action.showFrame };
    }
    case "set_error": {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
    default: {
      return state;
    }
  }
}

export const AppStateProvider: React.FC<
  React.PropsWithChildren<{ children: any }>
> = (props: React.PropsWithChildren<{ children: any }>): React.ReactElement => {
  const [timer, setTimer] = useState(Date.now());
  const { contract: building } = useBuildingsContract();
  const { contract: maps } = useMapsContract();

  const [state, dispatch] = useReducer(reducer, GameState);
  //   const { tokenId, buildingCount, mapArray } = state;

  // useEffect(() => {
  //   const tid = setTimeout(() => {
  //     setTimer(Date.now());
  //   }, 5000);
  //   return () => {
  //     clearTimeout(tid);
  //   };
  // }, []);

  useEffect(() => {
    if (starknet && maps && state.tokenId) {
      setTimeout(async () => {
        // Check token_id of user
        let _mapArray;
        try {
          _mapArray = await maps.call("get_map_array", [
            // TODO : replace with
            uint256.bnToUint256(state.tokenId as any),
          ]);
          // var elem = toBN(_mapArray[0]);
          // var newMap = elem.toNumber();
          var newMap = _mapArray[0];
          console.log("New Map", newMap);
          dispatch({
            type: "set_mapArray",
            mapArray: newMap,
          });
        } catch (e) {
          console.warn("Error when retrieving total_supply");
          console.warn(e);
        }
      }, 0);
    }
  }, []);

  const updateBuildings = React.useCallback((t: number) => {
    dispatch({
      type: "set_buildingCount",
      buildingCount: t,
    });
  }, []);

  const setAddress = React.useCallback((addr: string) => {
    dispatch({
      type: "set_account",
      address: addr,
    });
  }, []);

  const updateTokenId = React.useCallback((id: any) => {
    dispatch({
      type: "set_tokenId",
      tokenId: id,
    });
  }, []);

  // const showBuildingFrame = (id: any): React.ReactNode => {
  //   console.log("show component, id", id);
  //   console.log("PROPS PROPS");
  //   return (
  //     <>
  //       {/* <React.ReactNode> */}
  //       <BuildingFrame {...id} />
  //       {/* </React.ReactNode> */}
  //     </>
  //   );
  // };

  const updateBuildingFrame = React.useCallback(
    (show: boolean, data: any[]) => {
      dispatch({
        type: "set_showFrame",
        showFrame: show,
      });
      dispatch({
        type: "set_frameData",
        frameData: data,
      });
    },
    []
  );

  return (
    <StateContext.Provider
      value={{
        address: state.address,
        tokenId: state.tokenId,
        buildingCount: state.buildingCount,
        mapArray: state.mapArray,
        frameData: state.frameData,
        showFrame: state.showFrame,
        updateBuildings,
        setAddress,
        updateTokenId,
        updateBuildingFrame,
      }}
    >
      {/* <DispatchContext.Provider value={dispatch}> */}
      {props.children}
      {/* </DispatchContext.Provider> */}
    </StateContext.Provider>
  );
};

// export const useDispatch = () => {
//   const context = React.useContext(DispatchContext);
//   if (context === undefined) {
//     throw new Error("useDispatch must be used within a DispatchProvider");
//   }
// };

export default StateContext;

//   useEffect(() => {
//     // console.log("prop in context", props.address);
//     // console.log("starknet", starknet);
//     // console.log("building", building);
//     // console.log(
//     //   "!fetching(userBalance, ownedTokens)",
//     //   fetching(userBalance, ownedTokens)
//     // );
//     if (
//       starknet &&
//       //   props.address &&
//       building
//       // replace with maps tokens contracts
//       //   !fetching(userBalance, ownedTokens)
//     ) {
//       //   console.log("starknet.account", props.address);
//       //   setTimeout(async () => {
//       //     // Check token_id of user
//       //     let _totalBuilding;
//       //     try {
//       //       _totalBuilding = await building.call("get_building_count", [
//       //         uint256.bnToUint256(1),
//       //       ]);
//       //       // count = await defaultProvider.callContract({
//       //       //   contractAddress: building.address,
//       //       //   entrypoint: "get_building_count",
//       //       //   calldata: [uint256.uint256ToBN({ high: 0, low: 1 })],
//       //       // });
//       //       var elem = toBN(_totalBuilding[0]);
//       //       var newCounter = elem.toNumber();
//       //       console.log("Value Buildings to dispatch", newCounter);
//       //       dispatch({
//       //         type: "set_buildingCount",
//       //         buildingCount: newCounter,
//       //       });
//       //       // setTotalSupply(BigNumber.from(_totalSupply.result[0]));
//       //     } catch (e) {
//       //       console.warn("Error when retrieving total_supply");
//       //       console.warn(e);
//       //     }
//       //   }, 0);
//     }
//   }, [
//     timer,
//     // props.address,
//     //   // starknet,
//     //   // starknet.account,
//     //   // userBalance,
//     //   // setUserBalance,
//     //   // ownedTokens,
//     //   // setOwnedTokens,
//   ]);
