import { useStarknet } from "@starknet-react/core";
import { useCallback } from "react";
// import { AddTransactionResponse, uint256 } from "starknet";
import { useNotifTransactionManager } from "../../providers/transactions";
import { useERC1155Contract } from "../contracts/erc1155";
import { useResourcesContract } from "../contracts/resources";

export default function useApprove() {
  const { account } = useStarknet();
  const { contract } = useERC1155Contract();
  const { contract: resources } = useResourcesContract();

  const { addTransaction } = useNotifTransactionManager();

  return useCallback(
    async (nonce: string) => {
      if (contract == null || !account) {
        throw new Error("Missing Dependencies");
      }

      // return await contract
      //   .invoke("setApprovalForAll", [resources?.address, 1])
      //   .then((tx: AddTransactionResponse) => {
      //     console.log("Transaction hash: ", tx.transaction_hash);

      //     addTransaction({
      //       status: tx.code,
      //       transactionHash: tx.transaction_hash,
      //       address: account,
      //       metadata: {
      //         method: "approve",
      //         message: "Approve Buildings contract",
      //       },
      //     });

      //     return tx.transaction_hash;
      //   })
      //   .catch((e) => {
      //     console.error(e);
      //     return 0;
      //   });
    },
    [account, addTransaction, contract]
  );
}
