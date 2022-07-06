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
    </>
  );
}
