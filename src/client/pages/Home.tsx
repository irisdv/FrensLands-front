import React, { useMemo, useEffect } from "react";
import { useStarknet, InjectedConnector } from "@starknet-react/core";
import { ConnectWallet } from "../components/ConnectWallet";
import { TestGenMap } from "../components/testGenMap";
import { TransactionList } from "../components/TransactionList";

import { GetBuildingCount } from "../components/Buildings/GetBuildingCount";
import { BuildBuildings } from "../components/Buildings/BuildBuildings";
import { GetBuildings } from "../components/Buildings/GetBuildings";

export default function Home() {
  // const { account } = useStarknet();
  // const { available, connect, disconnect } = useConnectors();
  const { account, connect, connectors } = useStarknet();
  const injected = useMemo(() => new InjectedConnector(), []);

  console.log("account", account);

  return (
    <>
      <div className="flex justify-center">
        <div
          id="menuBar"
          className="relative flex jutify-center items-center px-5"
        >
          <div className="flex jutify-center px-2">
            <div id="menuGold"></div>
            <div className="items-center">test</div>
          </div>
        </div>
      </div>
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
