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

import { useMapsContract } from "../hooks/maps";
import { transaction, uint256 } from "starknet";
import { useGameContext } from "../hooks/useGameContext";
import { useWorldsContract } from "../hooks/worlds";
import { ConnectWallet } from "../components/ConnectWallet";

export default function Home() {
  // const { account } = useStarknet();
  // const { available, connect, disconnect } = useConnectors();
  let navigate = useNavigate();
  const { account, connect, connectors, disconnect } = useStarknet();
  const injected = useMemo(() => new InjectedConnector(), []);
  const [minting, setMinting] = useState(false);
  const [settingUp, setSettingUp] = useState(false)
  const { transactions } = useStarknetTransactionManager()

  const [watch, setWatch] = useState(true);
  const { contract: worlds } = useWorldsContract();
  const { contract: maps } = useMapsContract();

  const { setAddress, updateTokenId, address, tokenId } = useGameContext();

  console.log('transactions', transactions)

  useEffect(() => {
    console.log('useEffet 1')
    if (account && !address) {
      setAddress(account);
      updateTokenId(account);
      console.log('1')
    }
  }, [account, address])

  useEffect(() => {
    console.log('useEffet 2')
    if (account && !tokenId) {
      updateTokenId(account);
      console.log('2')
    }
  }, [account, tokenId])

  useEffect(() => {
    console.log('Setting up game')
    if (account && !tokenId) {
      updateTokenId(account);
      console.log('2')
    }
  }, [transaction])

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

  // DEBUG : enlever les arguments 
  const mintMap = () => {
    console.log("invoking mintingMap", Date.now());
    getMapInvoke({
      args: [
        "0x01cab2703e4813d008149a72a7fc238bb790c76546ee79199d5767bd7ffa9b9c",
        "0x05975fef9b94e841a78e9826a95415874a476b04b8836eb8149a5cafdaef4fe3"
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
    console.log('startingGame')
    // if (tokenId) {
      startGameInvoke({
        args: [
          uint256.bnToUint256(1),
          "0x05975fef9b94e841a78e9826a95415874a476b04b8836eb8149a5cafdaef4fe3",
          "0x04e8653b61e068c01e95f4df9e7504b6c71f2937e2bf00ec6734f4b2d33c13e0",
          "0x06b1c1299bc6c4ecf71246f6580c0e36bee5ac53f3fa016706ef5c093183dde3"
        ],
        metadata: {
          method: "start_game",
          message: "Starting a game of Frens Lands",
        },
      });
      setSettingUp(true)
    // }
  }

  console.log("account", account);
  console.log("dataStartGame", dataGetMap);
  console.log("startGameInvoke", loadingGetMap);

  return (
    <>
      <div className="backgroundImg relative pixelated">

          <img className="absolute m-auto pixelated" src="resources/front/UI_MainScreenPlanet.png" 
          style={{width : "640px", height: "640px", marginTop: '40px', marginLeft: "320px"}} />

          <div className="text-white">gm {account}</div>

      <p className="text-white">My balance NFT: {BalanceNFTValue && BalanceNFTValue.NFTbalance}</p>
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

      <ConnectWallet/>

      {BalanceNFTValue && BalanceNFTValue.NFTbalance == 0 &&
      <button className="pixelated btnMint" onClick={() => mintMap()}></button>
      }
      {BalanceNFTValue && BalanceNFTValue.NFTbalance == 1 &&
      <button className="pixelated btnPlay" onClick={() => startGame()}></button>
    }

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
