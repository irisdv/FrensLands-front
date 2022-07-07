import React, {
  useReducer,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import * as starknet from "starknet";
import { defaultProvider, number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";

import { useBuildingsContract } from "../hooks/buildings";

export interface IGameState {
  address?: string | undefined;
  tokenId?: string;
  buildingCount?: number;
  mapArray?: any[];
  updateBuildings: (t: number) => void;
  setAddress: (addr: string) => void;
  //   currentTrack: number;
}

export const GameState: IGameState = {
  address: undefined,
  tokenId: "test",
  buildingCount: undefined,
  mapArray: [],
  updateBuildings: () => {},
  setAddress: () => {},
};

let gameCtx: any = null;

// export const defaultState: IGameState = {
//   getAudioContext: () => {
//     if (gameCtx === null) {
//       // @ts-ignore
//       gameCtx = new (window.GameContext || window.webkitGameContext)({
//         latencyHint: "playback",
//         sampleRate: 44100,
//       });
//     }
//     return gameCtx;
//   },
//   //   currentTrack: -1,
// };

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

type Action =
  | SetAccount
  | SetTokenId
  | SetBuildingCount
  | SetMapArray
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
    case "set_error": {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
    default: {
      return state;
    }
  }
}

// export const AppStateProvider = ({ children : React.ReactNode}) => {
export const AppStateProvider: React.FC<
  React.PropsWithChildren<{ children: any }>
> = (props: React.PropsWithChildren<{ children: any }>): React.ReactElement => {
  const [timer, setTimer] = useState(Date.now());
  const { contract: building } = useBuildingsContract();

  //   const [GameStateContextState] = useState({
  //     address: "",
  //     tokenId: "",
  //     buildingCount: 0,
  //     mapArray: [],
  //   });
  //   const [addr, setAddr] = useState("");

  const [state, dispatch] = useReducer(reducer, GameState);
  //   const { tokenId, buildingCount, mapArray } = state;

  useEffect(() => {
    const tid = setTimeout(() => {
      setTimer(Date.now());
    }, 5000);
    return () => {
      clearTimeout(tid);
    };
  }, []);

  const updateBuildings = React.useCallback((t: number) => {
    console.log("in function updateBuilding dispatch", t);
    dispatch({
      type: "set_buildingCount",
      buildingCount: t,
    });
  }, []);

  const setAddress = React.useCallback((addr: string) => {
    console.log("in function updateAddress dispatch", addr);
    dispatch({
      type: "set_account",
      address: addr,
    });
  }, []);

  return (
    <StateContext.Provider
      value={{
        // ...GameStateContextState,
        address: state.address,
        tokenId: state.tokenId,
        buildingCount: state.buildingCount,
        mapArray: state.mapArray,
        updateBuildings,
        setAddress,
      }}
      //   value={state}
    >
      {/* <DispatchContext.Provider value={dispatch}> */}
      {props.children}
      {/* </DispatchContext.Provider> */}
    </StateContext.Provider>
  );
};

// export const useState = () => {
//   const context = React.useContext(StateContext);

//   if (context === undefined) {
//     throw new Error("useState must be used within a AppStateProvider");
//   }

//   return context;
// };

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
