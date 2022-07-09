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

  const mintMap = () => {
    console.log("invoking mintingMap", Date.now());
    getMapInvoke({
      args: [uint256.bnToUint256(2)],
      metadata: {
        method: "get_map",
        message: "Mint Frens Lands map",
      },
    });
    setMinting(true);
  };

  console.log("account", account);
  console.log("dataGetMap", dataGetMap);
  console.log("loadingGetMap", loadingGetMap);

  return (
    <>
      <p>balance NFT: {BalanceNFTValue && BalanceNFTValue.NFTbalance}</p>

      {account && (
        <div>
          <button
            onClick={() => {
              navigate("/game");
            }}
          >
            Play game
          </button>
        </div>
      )}
      <div>
        {/* <h2>Liste of Maps</h2> */}
        <div className="p-5 grid md:grid-cols-2">
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
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />

      <h2>Building Frame data model</h2>
      <div className="relative buildingFrame">
        <div
          className="grid grid-cols-2 inline-block"
          style={{ height: "20px" }}
        >
          {/* TODO: Dynamic choice of title */}
          <div
            className="font8BITWonder uppercase text-center"
            style={{ height: "20px" }}
          >
            Police Station
          </div>
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ paddingLeft: "8px" }}
          >
            {/* TODO: dynamic choice of className for icons + dynamic data */}
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-9px", left: "20px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-34px", left: "23px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-9px", left: "68px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-34px", left: "70px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-9px", left: "117px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-34px", left: "119px" }}
              ></div>
            </div>
          </div>
        </div>
        {/* Add dynamic data */}
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "85px" }}
        >
          <div className="flex flex-row justify-center inline-block relative">
            <div
              className="font04B text-center mx-auto"
              style={{
                width: "68px",
              }}
            >
              Image
            </div>
            <div
              className="font04B text-center mx-auto"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "85px",
              }}
            >
              Security
            </div>
            <div
              className="font04B mx-auto text-center"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "67px",
              }}
            >
              1{/* level */}
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "65px",
              }}
            >
              2 x 2
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "64px",
              }}
            >
              34,37
            </div>
          </div>
        </div>
        {/* Add dynamic data */}
        <div
          className="font04B"
          style={{
            height: "109px",
            fontSize: "13px",
            paddingLeft: "9px",
            paddingTop: "6px",
          }}
        >
          description
        </div>
        {/* If too build :  btn Build left w/ required resources : red if not enough resources, green if ok
            If already built : btn centered Upgrade
        */}
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "45px", paddingTop: "8px" }}
        >
          <div className="flex flex-row justify-center inline-block">
            {/* Case button  */}
            <div style={{ width: "206px", paddingTop: "10px" }}>
              <a>
                <div className="btnUpgrade"></div>
              </a>
            </div>
            <div
              className="relative flex jutify-center items-center inline-block"
              style={{ width: "60px", height: "80px", paddingTop: "10px" }}
            >
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: "absolute", top: "-15px", left: "0px" }}
                >
                  320
                </div>
                <div
                  className="smallGold mb-3"
                  style={{ position: "absolute", top: "-39px", left: "3px" }}
                ></div>
              </div>
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: "absolute", top: "-15px", left: "50px" }}
                >
                  320
                </div>
                <div
                  className="smallGold mb-3"
                  style={{ position: "absolute", top: "-39px", left: "52px" }}
                ></div>
              </div>
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: "absolute", top: "-15px", left: "95px" }}
                >
                  320
                </div>
                <div
                  className="smallGold mb-3"
                  style={{ position: "absolute", top: "-39px", left: "97px" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="grid grid-cols-2"
          style={{ height: "30px", marginLeft: "205px" }}
        >
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ width: "60px", paddingTop: "10px" }}
          >
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "0px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "3px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "50px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "52px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "95px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "97px" }}
              ></div>
            </div>
          </div>
        </div>
        <div
          className="grid grid-cols-2"
          style={{ height: "30px", marginLeft: "205px" }}
        >
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ width: "60px", paddingTop: "10px" }}
          >
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "0px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "3px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "50px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "52px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "95px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "97px" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />
      <p>Page Homepage</p>
      <div></div>
      <div>gm {account}</div>
      <TestGenMap />
      <GetBuildingCount />
      <BuildBuildings />
      <h2>Recent Transactions</h2>
      <TransactionList />
    </>
  );
}
