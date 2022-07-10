import React, { useMemo, useEffect, useState } from "react";
import {
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
  useStarknetTransactionManager,
  InjectedConnector,
} from "@starknet-react/core";
import { ConnectWalletMint } from "../components/ConnectWalletMint";
import { TestGenMap } from "../components/testGenMap";
import { TransactionList } from "../components/TransactionList";
import { toBN } from "starknet/dist/utils/number";
import { Link, useNavigate } from "react-router-dom";

import { GetBuildingCount } from "../components/Buildings/GetBuildingCount";
import { BuildBuildings } from "../components/Buildings/BuildBuildings";
import { GetBuildings } from "../components/Buildings/GetBuildings";
import { MenuBar } from "../components/GameUI/MenuBar";
import { ConnectWallet } from "../components/ConnectWallet";

import { transaction, uint256 } from "starknet";

import { useMapsContract } from "../hooks/maps";
import { useWorldsContract } from "../hooks/worlds";
import { useResourcesContract } from "../hooks/resources";
import { useERC1155Contract } from "../hooks/erc1155";
import { useFrensCoinsContract } from "../hooks/frenscoins";
import { useMinterContract } from "../hooks/minter";

import { useGameContext } from "../hooks/useGameContext";

export default function Home() {
  // const { account } = useStarknet();
  // const { available, connect, disconnect } = useConnectors();
  let navigate = useNavigate();
  const { account, connect, connectors, disconnect } = useStarknet();
  const injected = useMemo(() => new InjectedConnector(), []);
  const [minting, setMinting] = useState(false);
  const [settingUp, setSettingUp] = useState("")
  const { transactions } = useStarknetTransactionManager()

  const [watch, setWatch] = useState(true);
  const { contract: worlds } = useWorldsContract();
  const { contract: maps } = useMapsContract();
  const { contract: resources } = useResourcesContract();
  const { contract: erc1155 } = useERC1155Contract();
  const { contract: frenscoins } = useFrensCoinsContract();
  const { contract: minter } = useMinterContract();

  const { setAddress, updateTokenId, address, tokenId, frensCoins } = useGameContext();

  // console.log('transactions', transactions)
  // console.log('address front', address)

  useEffect(() => {
    if (account) {
      setAddress(account as string);
      // updateTokenId(account);
    }
  }, [account])

  useEffect(() => {
    if (account && !tokenId) {
      updateTokenId(account);
    }
  }, [account, tokenId])

  // useEffect(() => {
    
  // }, [transaction])

  // UseEffect transactions 

  const { data: fetchBalanceNFTResult } = useStarknetCall({
    contract: maps,
    method: "balanceOf",
    args: [account],
    options: { watch },
  });

  const BalanceNFTValue = useMemo(() => {
    console.log("BalanceNFTResult", fetchBalanceNFTResult);
    if (fetchBalanceNFTResult && fetchBalanceNFTResult.length > 0) {
      var elem = uint256.uint256ToBN(fetchBalanceNFTResult[0]);
      console.log("elem", elem);
      var balance = elem.toNumber();

      console.log("Balance NFT value test", balance);

      if (balance == 1 && account) updateTokenId(account)

      return { NFTbalance: balance };
    }
  }, [fetchBalanceNFTResult]);

  const {
    data: dataGetMap,
    loading: loadingGetMap,
    invoke: getMapInvoke,
  } = useStarknetInvoke({
    contract: worlds,
    method: "get_map",
  });

  const {
    data: dataStartGame,
    loading: loadingStartGame,
    invoke: startGameInvoke,
  } = useStarknetInvoke({
    contract: worlds,
    method: "start_game",
  });

  const mintMap = () => {
    console.log("invoking mintingMap", Date.now());
    getMapInvoke({
      args: [
        minter?.address,
        maps?.address
      ],
      metadata: {
        method: "get_map",
        message: "Mint Frens Lands map",
      },
    });
    const transactionStatus = useStarknetTransactionManager();
    setMinting(true);
  };

  const startGame = () => {
    console.log('startingGam invoke')
    if (tokenId) {
      startGameInvoke({
        args: [
          uint256.bnToUint256(1),
          maps?.address,
          frenscoins?.address,
         resources?.address
        ],
        metadata: {
          method: "start_game",
          message: "Starting a game of Frens Lands",
        },
      });
      if (dataStartGame) setSettingUp(dataStartGame)
    } else {
      console.log('Missing tokenId')
    }
  }

  console.log('balance NFT', BalanceNFTValue && BalanceNFTValue.NFTbalance)

  return (
    <>
      <div className="backgroundImg relative pixelated">

      <img className="absolute pixelated" src="resources/front/UI_MainScreenPlanet.png" 
          style={{width : "640px", height: "640px", marginTop: '40px', marginLeft: "320px"}} />

          {/* <p className="text-white">My balance NFT: {BalanceNFTValue && BalanceNFTValue.NFTbalance}</p> */}
          <div>
            {/* {
              transactions.map(transaction => {
                <div>
                <p key={transaction.transactionHash}>
                  hash : {transaction.transactionHash} 
                  // return <Notif key={transaction.transactionHash} transaction={transaction} />
                </p>
              </div>
              })
            } */}
          </div>
          {account && BalanceNFTValue && BalanceNFTValue.NFTbalance == 0 &&
            <img className="absolute" src="resources/maps/FrensLand_NFTs_V2.png" style={{height: "256px", width: "256px", marginLeft: "512px", marginTop: "128px"}} />
          }

         <div style={{height: "128px", width: "128px", marginTop: "256px", marginLeft: "576px"}} className="absolute"> 
              {account && 
                BalanceNFTValue && BalanceNFTValue.NFTbalance == 0 &&
                <div>
                  <button className="pixelated btnMint" onClick={() => mintMap()} style={{marginLeft: "-36px", marginTop: "120px"}}></button>
                </div>
              }
              {account && BalanceNFTValue && BalanceNFTValue.NFTbalance == 1 &&
                  <>
                    {/* Check que le game est started */}
                    <button className="pixelated btnPlay" onClick={() => startGame()}></button>

                    {/* <button className="pixelated btnPlay" onClick={() => navigate("/game")}></button> */}
                  </>
              }
              {!account &&
                <ConnectWallet/>
              }
          </div>


      {/* {account && (
        <div>
          <button
            onClick={() => {
              navigate("/game");
            }}
          >
            Play game
          </button>
        </div>
      )} */}
      {/* <div> */}
        {/* <h2>Liste of Maps</h2> */}
        {/* <div className="p-5 grid md:grid-cols-2">
          <div className="p-5">
            <div className="max-w-lg rounded overflow-hidden shadow-lg">
              <img
                className="w-full"
                src="/resources/front/test.png"
                alt="Frens Lands #1"
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Frens Lands #1</div>
                <p className="text-gray-700 text-base">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Voluptatibus quia, nulla! Maiores et perferendis eaque,
                  exercitationem praesentium nihil.
                </p>
              </div>
              <div className="text-center">
                <div>
                  {!account &&
                    connectors.map((connector) =>
                      connector.available() ? (
                        <div
                          key={connector.id()}
                          onClick={() => connect(connector)}
                          className="btnConnect"
                        ></div>
                      ) : null
                    )}
                  {account && (
                    <button className="" onClick={() => mintMap()}>
                      Mint a map
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="max-w-lg rounded overflow-hidden shadow-lg">
              <img
                className="w-full"
                src="/resources/front/test.png"
                alt="Frens Lands #1"
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Frens Lands #1</div>
                <p className="text-gray-700 text-base">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Voluptatibus quia, nulla! Maiores et perferendis eaque,
                  exercitationem praesentium nihil.
                </p>
              </div>
              <div className="text-center">
                <div>
                  {!account &&
                    connectors.map((connector) =>
                      connector.available() ? (
                        <div
                          key={connector.id()}
                          onClick={() => connect(connector)}
                          className="btnConnect"
                        ></div>
                      ) : null
                    )}
                  {account && "connected"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      </div>
      {/* </div> */}
    </>
  );
}
