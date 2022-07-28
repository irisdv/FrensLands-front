import React, { useMemo } from "react";
// import { useStarknet, useConnectors } from "@starknet-react/core";
import { useStarknet, InjectedConnector } from "@starknet-react/core";

export function ConnectWallet() {
  // const { account } = useStarknet();
  // const { available, connect, disconnect } = useConnectors();
  const { account, connect, connectors, disconnect } = useStarknet();
  const injected = useMemo(() => new InjectedConnector(), []);

  if (account) {
    return (
      <div>
        {/* <p>Account: {account}</p>
        <button onClick={() => disconnect()}>Disconnect</button> */}
      </div>
    );
  }

  return (
    <div>
      {/* {available.map((connector) => (
        <button key={connector.id()} onClick={() => connect(connector)}>
          {`Connect ${connector.name()}`}
        </button>
      ))} */}
      {connectors.map((connector) =>
        connector.available() ? (
          <button className="relative mx-auto btnPlay pixelated" style={{marginTop: '300px'}} key={connector.id()} onClick={() => connect(connector)}>
          </button>
        ) : null
      )}
    </div>
  );
}
