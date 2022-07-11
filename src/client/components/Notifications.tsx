import React, { useMemo } from "react";
import { useStarknet, InjectedConnector, useStarknetTransactionManager } from "@starknet-react/core";
import { MintMap } from "./Worlds/MintMap";

export function Notifications( transaction : any) {
  const { account, connect, connectors, disconnect } = useStarknet();
  const injected = useMemo(() => new InjectedConnector(), []);

    console.log('transaction in Notifications components', transaction)
    let status;
    if (transaction.status === "TRANSACTION_RECEIVED"
        || transaction.status === "RECEIVED" || transaction.status === "PENDING")
        status = "Pending...";
    else if (transaction.status === "REJECTED")
        status = "Rejected.";
    else if (transaction.status === "ACCEPTED_ON_L1" || transaction.status === "ACCEPTED_ON_L2")
        status = "Accepted";

  return (
    <div>
        <div>{transaction.metadata.message}... <div>{status}</div></div>
    </div>
  );
}
