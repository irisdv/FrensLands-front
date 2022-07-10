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


export interface IFrame {
  id?: string;
  type?: number;
  posX?: any;
  poxY?: any;
}

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
  frameData?: IFrame;
  updateBuildingFrame: (show: boolean, data: {}) => void;
  farmResource: (id: any, data: {}) => void;
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
  farmResource: (id, data) => {},
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

interface SetShowFrame {
  type: "set_showFrame";
  showFrame?: boolean;
  frameData?: IFrame;
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
  // | SetFrameData
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
    // case "set_frameData": {
    //   return { ...state, frameData: action.frameData };
    // }
    case "set_showFrame": {
      return { ...state, showFrame: action.showFrame, frameData: action.frameData };
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

const arrayIds = {
  0: 0,
  1: 1,
  179: 2,
  15: 3,
  3: 4,
  10: 5,
  5: 6,
  8: 7,
  7: 8,
  6: 9,
  59: 10,
  11: 11,
  9: 12,
  12: 13,
  13: 14,
  60: 15,
  52: 16,
  58: 17,
  61: 18,
  4: 19,
  20: 20,
  14:21,
  49: 22,
  57: 23,
  100: 24
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
    if (maps && account && state.address) {
      console.log('account context', account)
      try {
        _token_id = await maps.call("tokenOfOwnerByIndex", [
            state.address, uint256.bnToUint256(0)
        ]);
      console.log('tokenOfOwnerByIndex result', uint256.uint256ToBN(_token_id[0]).toNumber())
      dispatch({
        type: "set_tokenId",
        tokenId: uint256.uint256ToBN(_token_id[0]).toString(),
      });
      } catch (e) {
        console.warn("Error when retrieving tokenOwner by Index ");
        console.warn(e);
      }
    }
  }, [state.address]);

  const refreshPopulation = React.useCallback(async (resources : any) => {
    let _newPopulation : any;
    try {
      _newPopulation = await resources.call("get_population", [
        uint256.bnToUint256(1)
      ]);      
      dispatch({
        type: "set_population",
        populationBusy: toBN(_newPopulation[0][1]).toNumber(),
        populationFree: toBN(_newPopulation[0][0]).toNumber()
      });
      } catch (e) {
        console.warn("Error when retrieving get_population in M02_Resources");
        console.warn(e);
      }
  }, [state.address]);

  const refreshResources = React.useCallback(async (erc1155 : any) => {
    let _erc1155Balance : any;
    if (state.address) {
        try {
          _erc1155Balance = await erc1155.call("balanceOfBatch", [
            [
              state.address,
              state.address, 
              state.address, 
              state.address, 
              state.address,
              state.address,
              state.address
            ],
            [uint256.bnToUint256(0), uint256.bnToUint256(1), uint256.bnToUint256(2), uint256.bnToUint256(3), uint256.bnToUint256(5), uint256.bnToUint256(6), uint256.bnToUint256(8)]
          ]);
          console.log('_erc1155Balance', uint256.uint256ToBN(_erc1155Balance[0][1]).toNumber())
          dispatch({
            type: "set_erc1155Res",
            wood: uint256.uint256ToBN(_erc1155Balance[0][1]).toNumber(),
            rock: uint256.uint256ToBN(_erc1155Balance[0][2]).toNumber(),
            meat: uint256.uint256ToBN(_erc1155Balance[0][3]).toNumber(),
            cereal: uint256.uint256ToBN(_erc1155Balance[0][4]).toNumber(),
            metal: uint256.uint256ToBN(_erc1155Balance[0][5]).toNumber(),
            coal: uint256.uint256ToBN(_erc1155Balance[0][6]).toNumber(),
          });
        } catch (e) {
          console.warn("Error when retrieving resources ");
          console.warn(e);
        }
      }
  }, [state.address]);

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
    if (state.address) {
        try {
          _frensCoinsBalance = await coins.call("balanceOf", [
            state.address,
          ]);
          console.log('_frensCoinsBalance', uint256.uint256ToBN(_frensCoinsBalance[0]).toNumber())
          dispatch({
            type: "set_frensCoins",
            frensCoins: uint256.uint256ToBN(_frensCoinsBalance[0]).toNumber()
          });
        } catch (e) {
          console.warn("Error when retrieving balance of coins");
          console.warn(e);
        }
      }
      }, [state.address]);

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
    }, [state.address]);

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

  const updateBuildingFrame = React.useCallback((show: boolean, data: {}) => {
      console.log('in context', data)
      // TODO : update l'id qu'on reçoit
      dispatch({
        type: "set_showFrame",
        showFrame: show,
        frameData: data,
      });
      // dispatch({
      //   type: "set_frameData",
      //   frameData: data,
      // });
    },
    []
  );

  const farmResource = React.useCallback(async (building_unique_id: any, data: {}) => {
      const { contract: resources } = useResourcesContract();
      console.log('in context farming resources with id ', building_unique_id)
      // let _farm_tx;
      // if (resources && state.address) {
      //   try {
      //     // tokenId (uint), building_unique_id, 
      //     _farm_tx = await resources.invoke("farm", [
      //       uint256.bnToUint256(0),
      //       building_unique_id,
      //       "0x05e10dc2d99756ff7e339912a8723ecb9c596e8ecd4f3c3a9d03eb06096b153f",
      //       "0x072c5b060c922f01383d432624fa389bf8b087013b9702b669c484857d23eea1",
      //       "0x0574fe8bbe799ce7583ef1aefe4c6cf1135dc21c092471982e56b038355f8249",
      //       "0x04e8653b61e068c01e95f4df9e7504b6c71f2937e2bf00ec6734f4b2d33c13e0"
      //     ]);
      //     console.log('_farm_tx', _farm_tx)
      //     // dispatch({
      //     //   type: "set_lastBlock",
      //     //   blockGame: toBN(_lastestBlock).toString()
      //     // });
      //   } catch (e) {
      //     console.warn("Error when retrieving get_latest_block in M02_Resources");
      //     console.warn(e);
      //   }
      // }
      // Send tx from there
      // dispatch({
      //   type: "set_showFrame",
      //   showFrame: show,
      //   frameData: data,
      // });
      // dispatch({
      //   type: "set_frameData",
      //   frameData: data,
      // });
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
        farmResource,
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
};

export default StateContext;