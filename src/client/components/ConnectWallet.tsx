import React from "react";
import { useStarknet, useConnectors } from "@starknet-react/core";

export function ConnectWallet() {
  const { account } = useStarknet();
  const { available, connect, disconnect } = useConnectors();

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
      {available.map((connector) => (
        <button key={connector.id()} onClick={() => connect(connector)} className="relative mx-auto btnPlay pixelated" style={{marginTop: '300px'}}>
          {/* {`Connect ${connector.name()}`} */}
        </button>
      ))}
    </div>
  );
}
