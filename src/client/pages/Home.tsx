import React, { useMemo, useEffect } from "react";
import { useStarknet, useConnectors } from "@starknet-react/core";
import { ConnectWallet } from "../components/ConnectWallet";

export default function Home() {
  const { account } = useStarknet();
  const { available, connect, disconnect } = useConnectors();

  return (
    <>
      <p>Page Homepage</p>
      <div>
        <ConnectWallet />
      </div>
      <div>gm {account}</div>
    </>
  );
}
