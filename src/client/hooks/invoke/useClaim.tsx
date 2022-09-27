import { useStarknet } from "@starknet-react/core";
import { useCallback } from "react";
import { AddTransactionResponse, uint256 } from "starknet";
import { useNotifTransactionManager } from "../../providers/transactions";
import { useResourcesContract } from "../contracts/resources";
import { useGameContext } from "../useGameContext";

export default function useClaim() {
  const { account } = useStarknet();
  const { contract } = useResourcesContract();

  const { addTransaction } = useNotifTransactionManager();
  const { nonce, updateNonce } = useGameContext();

  return useCallback(
    async (tokenId: number, nonce: string) => {
      if (contract == null || !account) {
        throw new Error("Missing Dependencies");
      }

      if (!tokenId || tokenId == 0) {
        throw new Error("Missing Arguments");
      }

      return await contract
        .invoke("claim", [uint256.bnToUint256(tokenId)], { nonce })
        .then((tx: AddTransactionResponse) => {
          console.log("Transaction hash: ", tx.transaction_hash);

          addTransaction({
            status: tx.code,
            transactionHash: tx.transaction_hash,
            address: account,
            metadata: {
              method: "claim_resources",
              message: "Claim daily resource",
            },
          });

          return tx.transaction_hash;
        })
        .catch((e) => {
          console.error(e);
          return 0;
        });
    },
    [account, addTransaction, contract]
  );
}
