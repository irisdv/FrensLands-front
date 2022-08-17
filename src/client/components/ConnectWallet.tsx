import React from "react";
import { useStarknet, useConnectors, InjectedConnector } from "@starknet-react/core";

export function ConnectWallet() {
  const { account } = useStarknet();
  const { available, connect, disconnect, connectors } = useConnectors();
  
  const manualConnectors = [
    new InjectedConnector({
      options: { id: "argent-x" },
    }),
    new InjectedConnector({ options: { id: "braavos" } }),
  ];


  // if (account) {
  //   return (
  //     <div>
  //       <p>Account: {account}</p>
  //       <button onClick={() => disconnect()}>Disconnect</button>
  //     </div>
  //   );
  // }

  return (
    <div>
      {manualConnectors.map((connector, index) => (
        <button key={index} onClick={() => connect(connector)} className="relative mx-auto btnPlay pixelated" style={{marginTop: '300px'}}>
          {/* {`Connect ${connector.name()}`} */}
        </button>
      ))}
    </div>
  );
}
