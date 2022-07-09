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
import { useMapsContract } from "../hooks/maps";
import { useERC1155Contract } from "../hooks/erc1155";
import { useStarknet } from "@starknet-react/core";
import { GetBlockResponse } from 'starknet'


export interface IGameState {
  lastUpdated: string;
  currentBlock: number;
  blockGame?: string;
  loading: boolean; 
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
  populationBusy?: number;
  populationFree?: number;
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
  lastUpdated: "",
  currentBlock: 0,
  blockGame: "",
  loading: false, 
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
  populationBusy: 0,
  populationFree: 0,
  // startBlockNumber: "", // start_block_(tokenId)
  updateBuildings: () => {},
  setAddress: () => {},
  updateTokenId: () => {},
  showFrame: false,
  frameData: undefined,
  updateBuildingFrame: (show, data) => {},
};

const StateContext = React.createContext(GameState);
const DispatchContext = React.createContext({});

interface SetLastUpdatedAt {
  type: 'set_last_updated_at';
  blockHash: string;
  currentBlock: number
}

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

interface SetERC1155Resources {
  type: "set_erc1155Res";
  wood?: number;
  rock?: number;
  meat?: number,
  cereal?: number,
  metal?: number,
  coal?: number,
}

interface SetLastBlock {
  type: "set_lastBlock";
  blockGame?: string;
}

interface SetPopulation {
  type: "set_population";
  populationBusy?: number;
  populationFree?: number
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
  | SetERC1155Resources
  | SetLastBlock
  | SetPopulation
  | SetLastUpdatedAt
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
    case "set_population": {
      return { ...state, 
        populationBusy: action.populationBusy, 
        populationFree: action.populationFree 
      };
    }
    case "set_erc1155Res": {
      return { ...state, 
          wood: action.wood,
          rock: action.rock,
          meat: action.meat,
          cereal: action.cereal,
          metal: action.metal,
          coal: action.coal,
        };
    }
    case "set_lastBlock": {
      return { ...state, blockGame: action.blockGame };
    }
    case "set_last_updated_at": {
      return {...state, loading: false, lastUpdated: action.blockHash, currentBlock: state.currentBlock}
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
  const { contract: maps } = useMapsContract();

  const { library } = useStarknet()
  const [block, setBlock] = useState<GetBlockResponse | undefined>(undefined)
  const [loading, setLoading] = useState<boolean | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)

  const [state, dispatch] = useReducer(reducer, GameState);


  const fetchBlock = useCallback(() => {
    if (library) {
      library
        .getBlock()
        .then((newBlock) => {
          setBlock((oldBlock) => {
            if (oldBlock?.block_hash === newBlock.block_hash) {
              return oldBlock
            }
            // Reset error and return new block.
            setError(undefined)
            return newBlock
          })
        })
        .catch(() => {
          setError('failed fetching block')
        })
        .finally(() => setLoading(false))
    }
  }, [library, setLoading, setError, setBlock])

  useEffect(() => {
    // Set to loading on first load
    setLoading(true)

    // Fetch block immediately
    fetchBlock()

    const intervalId = setInterval(() => {
      fetchBlock()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [fetchBlock])

  // Refresh on block change
  useEffect(() => {
    if (block?.block_hash) {
      if (block?.block_hash == state.lastUpdated) return

      console.log('block number', block.block_number)

      refreshPopulation(resources)
      refreshResources(erc1155)
      refreshMapArray(worlds)
      refreshBalance(coins)
      refreshEnergyLevel(resources)
      refreshBlockGame(resources)
      dispatch({ type: 'set_last_updated_at', blockHash: block.block_hash, currentBlock: block.block_number })
    }
  }, [block?.block_hash, state.lastUpdated])

  // Refresh on args changed
  useEffect(() => {
    refreshPopulation(resources)
  }, [state.tokenId, starknet, state.address])

  useEffect(() => {
    refreshResources(erc1155)
  }, [state.tokenId, starknet, state.address])

  useEffect(() => {
    refreshMapArray(worlds)
  }, [state.tokenId, starknet, state.address])

  useEffect(() => {
    refreshBalance(coins)
  }, [state.tokenId, starknet, state.address])

  useEffect(() => {
    refreshEnergyLevel(resources)
  }, [state.tokenId, starknet, state.address])

  useEffect(() => {
    refreshBlockGame(resources)
  }, [state.tokenId, starknet, state.address])

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

  const updateTokenId = React.useCallback(async (account: any) => {
    let _token_id;
    if (maps && account) {
      console.log('account context', account)
      try {
        _token_id = await maps.call("tokenOfOwnerByIndex", [
            account, uint256.bnToUint256(1)
        ]);
      console.log('_token_id', _token_id)
      // var elem = toBN(_erc1155Balance)
      // var newBalance = elem.toNumber()
      // dispatch({
      //   type: "set_tokenId",
      //   tokenId: toBN(_token_id).toString(),
      // });
      } catch (e) {
        console.warn("Error when retrieving tokenOwner by Index ");
        console.warn(e);
      }
    }
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

  const refreshPopulation = React.useCallback(async (resources : any) => {
    let _newPopulation : any;
    try {
      _newPopulation = await resources.call("get_population", [
        uint256.bnToUint256(1)
      ]);
      console.log('_newPopulation', _newPopulation)
      dispatch({
        type: "set_population",
        populationBusy: toBN(_newPopulation[1]).toNumber(),
        populationFree: toBN(_newPopulation[0]).toNumber()
      });
      } catch (e) {
        console.warn("Error when retrieving get_population in M02_Resources");
        console.warn(e);
      }
  }, []);

  const refreshResources = React.useCallback(async (erc1155 : any) => {
    let _erc1155Balance : any;
        try {
          _erc1155Balance = await erc1155.call("balanceOfBatch", [
            [
              "0x5ca2e445295db7170103e222d1bde7e04dc550e47f54d753526d6d4a11ee03a",
              "0x5ca2e445295db7170103e222d1bde7e04dc550e47f54d753526d6d4a11ee03a", 
              "0x5ca2e445295db7170103e222d1bde7e04dc550e47f54d753526d6d4a11ee03a", 
              "0x5ca2e445295db7170103e222d1bde7e04dc550e47f54d753526d6d4a11ee03a", 
              "0x5ca2e445295db7170103e222d1bde7e04dc550e47f54d753526d6d4a11ee03a",
              "0x5ca2e445295db7170103e222d1bde7e04dc550e47f54d753526d6d4a11ee03a",
              "0x5ca2e445295db7170103e222d1bde7e04dc550e47f54d753526d6d4a11ee03a",
              "0x5ca2e445295db7170103e222d1bde7e04dc550e47f54d753526d6d4a11ee03a"
            ],
            [uint256.bnToUint256(0), uint256.bnToUint256(1), uint256.bnToUint256(2), uint256.bnToUint256(3), uint256.bnToUint256(5), uint256.bnToUint256(6), uint256.bnToUint256(8)]
          ]);
          console.log('_erc1155Balance', toBN(_erc1155Balance[0]).toNumber())
          var elem = toBN(_erc1155Balance)
          var newBalance = elem.toNumber()
          console.log('newBalance', newBalance)
          dispatch({
            type: "set_erc1155Res",
            wood: toBN(_erc1155Balance[1]).toNumber(),
            rock: toBN(_erc1155Balance[2]).toNumber(),
            meat: toBN(_erc1155Balance[3]).toNumber(),
            cereal: toBN(_erc1155Balance[5]).toNumber(),
            metal: toBN(_erc1155Balance[6]).toNumber(),
            coal: toBN(_erc1155Balance[8]).toNumber(),
          });
        } catch (e) {
          console.warn("Error when retrieving resources ");
          console.warn(e);
        }
  }, []);

  const refreshMapArray = React.useCallback(async (worlds : any) => {
    let _mapArray : any[] = [];
    try {
      var elem = await worlds.call("get_map_array", [
        uint256.bnToUint256(1),
      ]);
      var i = 0
      elem.forEach((_map : any) => {
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
  }, []);

  const refreshBalance = React.useCallback(async (coins : any) => {
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
      }, []);

    const refreshEnergyLevel = React.useCallback(async (resources : any) => {
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
    }, []);

    const refreshBlockGame = React.useCallback(async (resources : any) => {
      let _lastestBlock : any;
      try {
        _lastestBlock = await resources.call("get_latest_block", [
          uint256.bnToUint256(0)
        ]);
        console.log('_lastestBlock', _lastestBlock)
        dispatch({
          type: "set_lastBlock",
          blockGame: toBN(_lastestBlock).toString()
        });
      } catch (e) {
        console.warn("Error when retrieving get_latest_block in M02_Resources");
        console.warn(e);
      }
    }, []);

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
        lastUpdated: state.lastUpdated,
        currentBlock: state.currentBlock,
        blockGame: state.blockGame,
        loading: state.loading,
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
        populationBusy: state.populationBusy,
        populationFree: state.populationFree,
        coal: state.coal,
        frameData: state.frameData,
        showFrame: state.showFrame,
        updateBuildings,
        setAddress,
        updateTokenId,
        updateBuildingFrame,
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
};

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
