import React, { useMemo } from "react";
// import { useStarknet, useConnectors } from "@starknet-react/core";
import { useStarknet, InjectedConnector } from "@starknet-react/core";
import { MintMap } from "./Worlds/MintMap";

export function ConnectWalletMint() {
  // const { account } = useStarknet();
  // const { available, connect, disconnect } = useConnectors();
  const { account, connect, connectors, disconnect } = useStarknet();
  const injected = useMemo(() => new InjectedConnector(), []);

  const mintMap = () => {
    console.log("mintingMap");
  };

  if (account) {
    return (
      <>
        <div onClick={() => mintMap()} className="btnMint"></div>
      </>
    );
  }

  return (
    <div>
      {connectors.map((connector) =>
        connector.available() ? (
          <div
            key={connector.id()}
            onClick={() => connect(connector)}
            className="btnConnect"
          ></div>
        ) : null
      )}
    </div>
  );
}
