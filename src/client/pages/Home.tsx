import React, { useMemo, useEffect } from "react";
import { useStarknet, useConnectors } from "@starknet-react/core";

export default function Home() {
  const { account } = useStarknet();
  const { available, connect, disconnect } = useConnectors();

  return (
    <>
      <p>Page Homepage</p>
      <div>
        {available.map((connector) => (
          <button key={connector.id()} onClick={() => connect(connector)}>
            Connect {connector.name()}
          </button>
        ))}
      </div>
      <div>gm {account}</div>
    </>
  );
}
