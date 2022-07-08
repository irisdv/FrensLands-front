import React, { useMemo, useEffect } from "react";
import { useStarknet, InjectedConnector } from "@starknet-react/core";
import { ConnectWallet } from "../components/ConnectWallet";
import { TestGenMap } from "../components/testGenMap";
import { TransactionList } from "../components/TransactionList";

import { GetBuildingCount } from "../components/Buildings/GetBuildingCount";
import { BuildBuildings } from "../components/Buildings/BuildBuildings";
import { GetBuildings } from "../components/Buildings/GetBuildings";
import { Link } from "react-router-dom";
import { MenuBar } from "../components/GameUI/MenuBar";

export default function Home() {
  // const { account } = useStarknet();
  // const { available, connect, disconnect } = useConnectors();
  const { account, connect, connectors } = useStarknet();
  const injected = useMemo(() => new InjectedConnector(), []);

  console.log("account", account);

  return (
    <>
      <MenuBar />
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
              <div className="fontHPxl-sm">320</div>
              <div className="smallGold mb-3" style={{}}></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div className="fontHPxl-sm">320</div>
              <div className="smallGold mb-3"></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div className="fontHPxl-sm">320</div>
              <div className="smallGold mb-3"></div>
            </div>
          </div>
        </div>
        {/* Add dynamic data */}
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "60px" }}
        >
          <div className="flex flex-row justify-center inline-block relative">
            <div
              className="font04B text-center mx-auto"
              style={{
                width: "56px",
              }}
            >
              Image
            </div>
            <div
              className="font04B text-center mx-auto"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "61px",
              }}
            >
              Security
            </div>
            <div
              className="font04B mx-auto text-center"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "51px",
              }}
            >
              1{/* level */}
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "49px",
              }}
            >
              2 x 2
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "50px",
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
            height: "80px",
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
          style={{ height: "40px", paddingTop: "8px" }}
        >
          <div className="flex flex-row justify-center inline-block">
            {/* Case button  */}
            <div style={{ width: "160px", paddingTop: "10px" }}>
              <a>
                <div className="btnUpgrade"></div>
              </a>
            </div>
            <div
              className="relative flex jutify-center items-center inline-block"
              style={{ width: "60px", paddingTop: "10px" }}
            >
              <div className="flex flex-row justify-center inline-block relative">
                <div className="fontHPxl-sm">320</div>
                <div className="smallGold mb-3" style={{}}></div>
              </div>
              <div className="flex flex-row justify-center inline-block relative">
                <div className="fontHPxl-sm">320</div>
                <div className="smallGold mb-3"></div>
              </div>
              <div className="flex flex-row justify-center inline-block relative">
                <div className="fontHPxl-sm">320</div>
                <div className="smallGold mb-3"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="grid grid-cols-2"
          style={{ height: "20px", marginLeft: "160px" }}
        >
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ width: "60px", paddingTop: "10px" }}
          >
            <div className="flex flex-row justify-center inline-block relative">
              <div className="fontHPxl-sm">320</div>
              <div className="smallGold mb-3" style={{}}></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div className="fontHPxl-sm">320</div>
              <div className="smallGold mb-3"></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div className="fontHPxl-sm">320</div>
              <div className="smallGold mb-3"></div>
            </div>
          </div>
        </div>
        <div
          className="grid grid-cols-2"
          style={{ height: "20px", marginLeft: "160px" }}
        >
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ width: "60px", paddingTop: "10px" }}
          >
            <div className="flex flex-row justify-center inline-block relative">
              <div className="fontHPxl-sm">320</div>
              <div className="smallGold mb-3" style={{}}></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div className="fontHPxl-sm">320</div>
              <div className="smallGold mb-3"></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div className="fontHPxl-sm">320</div>
              <div className="smallGold mb-3"></div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />
      <p>Page Homepage</p>
      <div>
        <ConnectWallet />
      </div>
      <div>gm {account}</div>
      <TestGenMap />
      <GetBuildingCount />
      <BuildBuildings />
      <h2>Recent Transactions</h2>
      <TransactionList />

      <div>
        <h2>Liste of Maps</h2>
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
          <img
            className="w-full"
            src="/img/card-top.jpg"
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Frens Lands 1</div>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
          </div>
          {/* <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #photography
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #travel
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #winter
            </span>
          </div> */}
        </div>
      </div>
    </>
  );
}
