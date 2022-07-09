import React, { useMemo, useEffect, useState } from "react";
import {
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
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
import { uint256 } from "starknet";
import { useGameContext } from "../hooks/useGameContext";
import { useWorldsContract } from "../hooks/worlds";
import { ConnectWallet } from "../components/ConnectWallet";

export default function Home() {
  // const { account } = useStarknet();
  // const { available, connect, disconnect } = useConnectors();
  const { account, connect, connectors, disconnect } = useStarknet();
  const injected = useMemo(() => new InjectedConnector(), []);
  const [minting, setMinting] = useState(false);
  let navigate = useNavigate();

  const [watch, setWatch] = useState(true);
  const { contract: worlds } = useWorldsContract();
  const { contract: maps } = useMapsContract();

  const { updateTokenId } = useGameContext();

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

      // Call updateTokenId()

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
        "0x0250e9ece43985c06a98398f99748b1cc07d181a28ffa25a77c72f14fd4dd4c2",
        "0x05a3753f79d6c6c3700c3652a3eaa00bb431ea21b0c155ba8883d130634ab001"
      ],
      metadata: {
        method: "get_map",
        message: "Mint Frens Lands map",
      },
    });
    setMinting(true);
  };

  const startGame = () => {
    console.log('startingGame')
    startGameInvoke({
      args: [
        "0x05a3753f79d6c6c3700c3652a3eaa00bb431ea21b0c155ba8883d130634ab001",
        "0x00ad6ce9bad182f1154847ad1c0a7d0e4b903747ecec5fd19b1c15e5f08e2825",
        "0x058ecb92d757b11cd3a42e68043071211b583196504e5773c483858767d08ea2"
      ],
      metadata: {
        method: "start_game",
        message: "Starting a game of Frens Lands",
      },
    });
    setMinting(true);
  }

  console.log("account", account);
  console.log("dataStartGame", dataGetMap);
  console.log("startGameInvoke", loadingGetMap);

  return (
    <>
      <p>My balance NFT: {BalanceNFTValue && BalanceNFTValue.NFTbalance}</p>

      <ConnectWallet/>

      {BalanceNFTValue && BalanceNFTValue.NFTbalance == 0 &&
      <button className="btnMint" onClick={() => mintMap()}></button>
      }
      {BalanceNFTValue && BalanceNFTValue.NFTbalance == 1 &&
      <button className="btnPlay" onClick={() => startGame()}></button>
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

      <div>gm {account}</div>
      {/* <GetBuildingCount />
      <BuildBuildings /> */}
      <h2>Recent Transactions</h2>
      <TransactionList />
    </>
  );
}
