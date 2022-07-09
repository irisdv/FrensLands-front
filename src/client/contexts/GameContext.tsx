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

import { useBuildingsContract } from "../hooks/buildings";
import { useWorldsContract } from "../hooks/worlds";
import { useResourcesContract } from "../hooks/resources";
import { useFrensCoinsContract } from "../hooks/frenscoins";
import { useERC1155Contract } from "../hooks/erc1155";

export interface IResources {
  energy: number;
  frensCoins: number;
  wood: number;
  rock: number;
  meat: number;
  cereal: number;
  metal: number;
  coal: number;
}

export interface IGameState {
  address?: string | undefined;
  tokenId?: string;
  buildingCount?: number;
  mapArray?: any[];
  energy?: number;
  frensCoins?: number;
  wood?: number;
  rock?: number;
  meat?: number;
  cereal?: number;
  metal?: number;
  coal?: number;
  updateBuildings: (t: number) => void;
  setAddress: (addr: string) => void;
  updateTokenId: (id: string) => void;
  // updateResources: () => void;
  showFrame?: boolean;
  frameData?: any;
  updateBuildingFrame: (show: boolean, data: []) => void;
}

export const GameState: IGameState = {
  address: undefined,
  tokenId: "test",
  buildingCount: undefined,
  mapArray: [],
  energy: 0,
  frensCoins: 0,
  wood: 0,
  rock: 0,
  meat: 0,
  cereal: 0,
  metal: 0,
  coal: 0,
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

interface SetEnergy {
  type: "set_energy";
  energy?: number;
}
interface SetFrensCoins {
  type: "set_frensCoins";
  frensCoins?: number;
}

type Action =
  | SetAccount
  | SetTokenId
  | SetBuildingCount
  | SetMapArray
  | SetFrameData
  | SetShowFrame
  | SetEnergy
  | SetFrensCoins
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
    case "set_energy": {
      return { ...state, energy: action.energy };
    }
    case "set_frensCoins": {
      return { ...state, frensCoins: action.frensCoins };
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
  const { contract: worlds } = useWorldsContract();
  const { contract: resources } = useResourcesContract();
  const { contract: erc1155 } = useERC1155Contract();
  const { contract: coins } = useFrensCoinsContract();

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
    if (starknet && worlds
      // DEBUG
      // && state.tokenId
      ) {
      setTimeout(async () => {
        // Check token_id of user
        let _mapArray : any[] = [];
        try {
          var elem = await worlds.call("get_map_array", [
            uint256.bnToUint256(1),
          ]);
          var i = 0
          elem.forEach((_map) => {
            while (i < 640) {
              var elem = toBN(_map[i])
              _mapArray.push(elem.toString())
              i++;
            }
          })
          dispatch({
            type: "set_mapArray",
            mapArray: _mapArray,
          });
        } catch (e) {
          console.warn("Error when retrieving get_map_array in M01_Worlds");
          console.warn(e);
        }
      }, 0);
    }
    if (starknet && resources 
            // DEBUG
      // && state.tokenId
      ) {
        setTimeout(async () => {
          // DEBUG tokenId to replace
          let _energyLevel : any;
          try {
            _energyLevel = await resources.call("get_energy_level", [
              uint256.bnToUint256(1),
            ]);
            var elem = toBN(_energyLevel)
            var newEnergy = elem.toNumber()
            dispatch({
              type: "set_energy",
              energy: newEnergy as number
            });
          } catch (e) {
            console.warn("Error when retrieving get_energy_level in M02_Resources");
            console.warn(e);
          }
        }, 0);
      }
  if (starknet && coins 
        // DEBUG
      // && state.tokenId
      ) {
    setTimeout(async () => {
      // DEBUG address of owner to replace : account
      let _frensCoinsBalance : any;
      try {
        _frensCoinsBalance = await coins.call("balanceOf", [
          "0x5ca2e445295db7170103e222d1bde7e04dc550e47f54d753526d6d4a11ee03a",
        ]);
        var elem = toBN(_frensCoinsBalance)
        var newBalance = elem.toNumber()
        console.log('newBalance', newBalance)
        dispatch({
          type: "set_frensCoins",
          frensCoins: newBalance as number
        });
      } catch (e) {
        console.warn("Error when retrieving get_energy_level in M02_Resources");
        console.warn(e);
      }
    }, 0);
  }
  if (starknet && coins 
    // DEBUG
    // && state.tokenId
    ) {
  setTimeout(async () => {
  // DEBUG address of owner to replace : account
    let _erc1155Balance : any;
    try {
      _erc1155Balance = await coins.call("balanceOf", [
        "0x5ca2e445295db7170103e222d1bde7e04dc550e47f54d753526d6d4a11ee03a",
      ]);
      var elem = toBN(_frensCoinsBalance)
      var newBalance = elem.toNumber()
      console.log('newBalance', newBalance)
      dispatch({
        type: "set_frensCoins",
        frensCoins: newBalance as number
      });
    } catch (e) {
      console.warn("Error when retrieving get_energy_level in M02_Resources");
      console.warn(e);
    }
  }, 0);
}
  }, [state.mapArray, state.energy, state.frensCoins, state.]);

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
        energy: state.energy,
        frensCoins: state.frensCoins,
        wood: state.wood,
        rock: state.rock,
        meat: state.meat,
        cereal: state.cereal,
        metal: state.metal,
        coal: state.coal,
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
