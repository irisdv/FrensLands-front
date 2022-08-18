import React, { useReducer, useEffect, useState, useCallback } from "react";
import * as starknet from "starknet";
import { uint256, Account, defaultProvider, stark, KeyPair } from "starknet";
import { toBN } from "starknet/dist/utils/number";
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

export interface Ibuild {
  id?: number;
  pos_start?: number;
  pop?: number;
  status?: number;
}

export interface IPopUp {
  id?: number; // id of bat_type
  unique_id?: string;
  type?: number;
  posX?: any;
  posY?: any;
  pop?: number;
}

export interface IBuildingData {
  active?: [],
  inactive?: []
}

export interface IResources {
  wood?: number;
  rock?: number;
  meat?: number;
  metal?: number;
  coal?: number;
  frensCoins?: number;
  energy?: number;
  populationBusy?: number;
  populationFree?: number;
}

export interface IGameState {
  lastUpdated: string;
  currentBlock: number;
  blockGame?: number;
  loading: boolean;
  address?: string | undefined;
  tokenId?: number;
  mapType?: string;
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
  resources: number[];
  updateBuildings: (t: number) => void;
  setAddress: (addr: string) => void;
  updateTokenId: (id: string) => void;
  fetchMapType: (id: string) => void;
  buildingData?: IBuildingData;
  nonce: string;
  updateNonce: (nonce : string) => void;
  setAccountContract: (account : any) => void;
  accountContract: any;
}

export const GameState: IGameState = {
  lastUpdated: "",
  currentBlock: 0,
  blockGame: 0,
  loading: false,
  address: undefined,
  tokenId: 0,
  mapType: "",
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
  resources : [],
  updateBuildings: () => {},
  setAddress: () => {},
  updateTokenId: () => {},
  fetchMapType: (id) => {},
  buildingData: {"active": [], "inactive": []},
  nonce: '',
  updateNonce: (nonce) => {},
  setAccountContract: (account) => {},
  accountContract: null
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
  tokenId?: number;
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
  buildingSelected?: number;
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
  blockGame?: number;
}

interface SetPopulation {
  type: "set_population";
  populationBusy?: number;
  populationFree?: number
}

interface SetMapType {
  type: "set_mapType";
  mapType?: string;
}
interface SetBuildingData {
  type: "set_buildingData";
  inactive?: [];
  active?: [];
}
interface SetNonce {
  type: "set_nonce";
  nonce: string;
}
interface SetAccountContract {
  type : "set_accountContract";
  accountContract?: any;
  nonce?: string;
}

type Action =
  | SetAccount
  | SetTokenId
  | SetBuildingCount
  | SetMapArray
  | SetShowFrame
  | SetEnergy
  | SetFrensCoins
  | SetERC1155Resources
  | SetLastBlock
  | SetPopulation
  | SetLastUpdatedAt
  | SetMapType
  | SetBuildingData
  | SetNonce
  | SetAccountContract
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
    case "set_buildingData": {
      return { ...state, 
        buildingData: {
          "active" : action.active,
          "inactive": action.inactive
        }
      };
    }
    case "set_energy": {
      let _resources = state.resources
      console.log('state.resources energy', state.resources)
      if (_resources) _resources[11] = action.energy as number
      return { ...state, 
        energy: action.energy,
        resources : _resources
      };
    }
    case "set_frensCoins": {
      let _resources = state.resources
      if (_resources) _resources[10] = action.frensCoins as number
      return { ...state, frensCoins: action.frensCoins, resources : _resources };
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
          resources: [
              0, 
              action.wood as number, 
              action.rock as number,
              action.meat as number,
              0,
              action.cereal as number,
              action.metal as number,
              0,
              action.coal as number
          ]
        };
    }
    case "set_lastBlock": {
      return { ...state, blockGame: action.blockGame };
    }
    case "set_last_updated_at": {
      return {...state, loading: false, lastUpdated: action.blockHash, currentBlock: state.currentBlock}
    }
    case "set_mapType": {
      return {...state, mapType: state.mapType}
    }
    case "set_nonce": {
      console.log('set_nonce', action.nonce)
      return {...state, nonce: action.nonce as string}
    }
    case "set_accountContract": {
      return {...state, 
        accountContract: action.accountContract,
        nonce: action.nonce as string
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
  const value = React.useMemo(() => [state, dispatch], [state])

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
      refreshBuildingData(building)
      dispatch({ type: 'set_last_updated_at', blockHash: block.block_hash, currentBlock: block.block_number })
    }
  }, [block?.block_hash, state.lastUpdated])

  // Refresh on args changed
  useEffect(() => {
    refreshPopulation(resources)
  }, [starknet, state.address, state.tokenId])

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

  useEffect(() => {
    updateTokenId(state.address)
  }, [starknet, state.address])

  useEffect(() => {
    refreshBuildingData(building)
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
      try {
        _token_id = await maps.call("tokenOfOwnerByIndex", [
            state.address, uint256.bnToUint256(0)
        ]);
      console.log('tokenOfOwnerByIndex result', uint256.uint256ToBN(_token_id[0]).toString())
      dispatch({
        type: "set_tokenId",
        tokenId: uint256.uint256ToBN(_token_id[0]).toNumber(),
      });
      refreshPopulation(resources)
      } catch (e) {
        console.warn("Error when retrieving tokenOwner by Index ");
        console.warn(e);
      }
    }
  }, [state.address]);

  const refreshPopulation = React.useCallback(async (resources : any) => {
    let _newPopulation : any;
    if (resources && state.address && state.tokenId) {
      try {
        _newPopulation = await resources.call("get_population", [
          uint256.bnToUint256(state.tokenId)
        ]);
        // console.log("_newPopulation", _newPopulation)
        dispatch({
          type: "set_population",
          populationBusy: toBN(_newPopulation[0][1]).toNumber(),
          populationFree: toBN(_newPopulation[0][0]).toNumber()
        });
        } catch (e) {
          console.warn("Error when retrieving get_population in M02_Resources");
          console.warn(e);
        }
    }
  }, [state.address, state.tokenId]);

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
          dispatch({
            type: "set_erc1155Res",
            wood: uint256.uint256ToBN(_erc1155Balance[0][1]).toNumber(),
            rock: uint256.uint256ToBN(_erc1155Balance[0][2]).toNumber(),
            meat: uint256.uint256ToBN(_erc1155Balance[0][3]).toNumber(),
            cereal: uint256.uint256ToBN(_erc1155Balance[0][4]).toNumber(),
            metal: uint256.uint256ToBN(_erc1155Balance[0][5]).toNumber(),
            coal: uint256.uint256ToBN(_erc1155Balance[0][6]).toNumber()
          });
        } catch (e) {
          console.warn("Error when retrieving resources.");
          console.warn(e);
        }
      }
  }, [state.address]);

  const refreshMapArray = React.useCallback(async (worlds : any) => {
    let _mapArray : any[] = [];
    if (state.tokenId) {
      try {
        var elem = await worlds.call("get_map_array", [
          uint256.bnToUint256(state.tokenId),
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
    }
  }, [state.tokenId]);

  const refreshBalance = React.useCallback(async (coins : any) => {
    let _frensCoinsBalance : any;
    if (state.address) {
        try {
          _frensCoinsBalance = await coins.call("balanceOf", [
            state.address,
          ]);
          // console.log('_frensCoinsBalance', uint256.uint256ToBN(_frensCoinsBalance[0]).toNumber())
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
        if (state.address && state.tokenId) {
          try {
            _energyLevel = await resources.call("get_energy_level", [
              uint256.bnToUint256(state.tokenId),
            ]);
            // console.log('_energyLevel', _energyLevel)
            dispatch({
              type: "set_energy",
              energy: uint256.uint256ToBN(_energyLevel[0]).toNumber()
            });
          } catch (e) {
            console.warn("Error when retrieving get_energy_level in M02_Resources");
            console.warn(e);
          }
        }
    }, [state.address]);

    const refreshBlockGame = React.useCallback(async (resources : any) => {
      let _lastestBlock : any;
      if (state.address && state.tokenId) {
        try {
          _lastestBlock = await resources.call("get_latest_block", [
            uint256.bnToUint256(state.tokenId)
          ]);
          // console.log('_lastestBlock', toBN(_lastestBlock[0]).toString())
          dispatch({
            type: "set_lastBlock",
            blockGame: toBN(_lastestBlock[0]).toNumber()
          });
        } catch (e) {
          console.warn("Error when retrieving get_latest_block in M02_Resources");
          console.warn(e);
        }
      }
    }, [state.address, state.tokenId]);

    const fetchMapType = React.useCallback((type : any) => {
      dispatch({
        type: "set_mapType",
        mapType: type as string
      });
    }, []);

  const refreshBuildingData = React.useCallback(async (building : any) => {
    let _lastestBuildingData : any;
    if (state.address && state.tokenId) {
      try {
        _lastestBuildingData = await building.call("get_all_buildings_data", [
          uint256.bnToUint256(state.tokenId)
        ]);
        console.log('_lastestBuildingData', _lastestBuildingData[0])

        var maxLength = Object.keys(_lastestBuildingData[0]).length
        var i = 0;
        var inactiveBuildings : any[] = [];
        var activeBuildings : any[] = [];
        while (i < maxLength) {
          if (toBN(_lastestBuildingData[0][i + 3]).toNumber() == 0 && (toBN(_lastestBuildingData[0][i]).toNumber() != 1 && toBN(_lastestBuildingData[0][i + 1]).toNumber() != 4 && toBN(_lastestBuildingData[0][i + 1]).toNumber() != 5)) {
            inactiveBuildings[toBN(_lastestBuildingData[0][i]).toNumber()] = []
            inactiveBuildings[toBN(_lastestBuildingData[0][i]).toNumber()]['type'] = toBN(_lastestBuildingData[0][i + 1]).toNumber()
            inactiveBuildings[toBN(_lastestBuildingData[0][i]).toNumber()]['pos_start'] = toBN(_lastestBuildingData[0][i + 2]).toNumber()
            inactiveBuildings[toBN(_lastestBuildingData[0][i]).toNumber()]['recharges'] = toBN(_lastestBuildingData[0][i + 3]).toNumber()
            inactiveBuildings[toBN(_lastestBuildingData[0][i]).toNumber()]['last_claim'] = toBN(_lastestBuildingData[0][i + 4]).toNumber()
          } else if (toBN(_lastestBuildingData[0][i]).toNumber() != 1 && toBN(_lastestBuildingData[0][i + 1]).toNumber() != 4 && toBN(_lastestBuildingData[0][i + 1]).toNumber() != 5) {
            activeBuildings[toBN(_lastestBuildingData[0][i]).toNumber()] = []
            activeBuildings[toBN(_lastestBuildingData[0][i]).toNumber()]['type'] = toBN(_lastestBuildingData[0][i + 1]).toNumber()
            activeBuildings[toBN(_lastestBuildingData[0][i]).toNumber()]['pos_start'] = toBN(_lastestBuildingData[0][i + 2]).toNumber()
            activeBuildings[toBN(_lastestBuildingData[0][i]).toNumber()]['recharges'] = toBN(_lastestBuildingData[0][i + 3]).toNumber()
            activeBuildings[toBN(_lastestBuildingData[0][i]).toNumber()]['last_claim'] = toBN(_lastestBuildingData[0][i + 4]).toNumber()
          }

          i += 5;
        }

        console.log('inactive', inactiveBuildings)
        console.log('active', activeBuildings)

        // Test
        // activeBuildings[201] = []
        // activeBuildings[201]['type'] = 7
        // activeBuildings[201]['pos_start'] = 48
        // activeBuildings[201]['recharges'] = 5
        // activeBuildings[201]['last_claim'] = 200

        // inactiveBuildings[202] = []
        // inactiveBuildings[202]['type'] = 8
        // inactiveBuildings[202]['pos_start'] = 1
        // inactiveBuildings[202]['recharges'] = 0
        // inactiveBuildings[202]['last_claim'] = 200
        // end test

        dispatch({
          type: "set_buildingData",
          active: activeBuildings as [],
          inactive: inactiveBuildings as []
        });
      } catch (e) {
        console.warn("Error when retrieving get_all_buildings_data in M03_Buildings");
        console.warn(e);
      }
    }
  }, [state.address, state.tokenId]);

  const updateNonce = React.useCallback(async (nonce: string) => {
    console.log('state.nonce', nonce)
    if (nonce) {
        console.log('updating nonce to', (parseInt(nonce, 16) + 1).toString(16))
        dispatch({
          type: "set_nonce",
          nonce: "0x" + (parseInt(nonce, 16) + 1).toString(16),
        });
    }
  }, [state.nonce]);

  const setAccountContract = React.useCallback(async (account : any) => {

    let _currNonce;
    if (account) {
      console.log('state.address', account)
      try {
        _currNonce = await account.getNonce()
        console.log('_currNonce', _currNonce)
        // console.log('nonce', "0x" + (parseInt(_currNonce, 16) + 1).toString(16))
        dispatch({
          type: "set_accountContract",
          accountContract: account,
          nonce: _currNonce
        });
      } catch (e) {
        console.warn("Error when retrieving get nonce of account");
        console.warn(e);
      }
    }
  }, [state.address, state.accountContract]);

  return (
    <StateContext.Provider
      value={{
        lastUpdated: state.lastUpdated,
        currentBlock: state.currentBlock,
        blockGame: state.blockGame,
        loading: state.loading,
        address: state.address,
        tokenId: state.tokenId,
        mapType: state.mapType,
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
        resources: state.resources,
        updateBuildings,
        setAddress,
        updateTokenId,
        fetchMapType,
        buildingData: state.buildingData,
        nonce: state.nonce,
        updateNonce,
        accountContract: state.accountContract,
        setAccountContract
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
};

export default StateContext;


// const arrayIds = {
//   0: 0,
//   1: 1,
//   179: 2,
//   15: 3,
//   3: 4,
//   10: 5,
//   5: 6,
//   8: 7,
//   7: 8,
//   6: 9,
//   59: 10,
//   11: 11,
//   9: 12,
//   12: 13,
//   13: 14,
//   60: 15,
//   52: 16,
//   58: 17,
//   61: 18,
//   4: 19,
//   20: 20,
//   14:21,
//   49: 22,
//   57: 23,
//   100: 24
// }