import { useStarknet } from "@starknet-react/core";
import { useCallback } from "react";
// import { AddTransactionResponse, uint256 } from "starknet";
import { useNotifTransactionManager } from "../../providers/transactions";
// import { useTestContract } from "../test";

export default function useTest() {
  const { account } = useStarknet();
  // const { contract } = useTestContract();

  const { addTransaction } = useNotifTransactionManager();

  return useCallback(async () => {
    // if (contract == null || !account) {
    //   throw new Error("Missing Dependencies");
    // }
    // return await contract
    //   .invoke("harvest", [1])
    //   .then((tx: AddTransactionResponse) => {
    //     console.log("Transaction hash: ", tx.transaction_hash);
    //     addTransaction({
    //       status: tx.code,
    //       transactionHash: tx.transaction_hash,
    //       address: account,
    //       metadata: {
    //         method: "harvest",
    //         message: "Mint Frens Lands map",
    //       },
    //     });
    //     return tx.transaction_hash;
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //   });
  }, [account, addTransaction]);
}
