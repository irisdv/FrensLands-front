import { useStarknet } from "@starknet-react/core";
import React, { useCallback } from "react";
import { uint256, InvokeFunctionResponse } from "starknet";
// AddTransactionResponse
import { useNotifTransactionManager } from "../../providers/transactions";
import { useFLContract } from "../contracts/frenslands";

export default function useStartGame() {
  // const { account } = useStarknet();
  const { contract } = useFLContract();

  const { addTransaction } = useNotifTransactionManager();

  return useCallback(
    async (wallet: any, tokenId: number, biomeId: number, nonce: string) => {
      if (contract == null) {
        throw new Error("Missing Dependencies");
      }

      if (tokenId == null || tokenId == 0) {
        console.log("tokenId in if", tokenId);
        throw new Error("Wrong tokenId");
      }

      return await contract
        .invoke("start_game", [uint256.bnToUint256(tokenId), biomeId], {
          nonce,
          maxFee: 1618293576158800,
        })
        // .then((tx: AddTransactionResponse) => {
        .then((tx: InvokeFunctionResponse) => {
          console.log("Transaction hash: ", tx);

          // addTransaction({
          //   status: tx.status,
          //   transactionHash: tx.transaction_hash,
          //   address: wallet.account.address,
          //   metadata: {
          //     method: "start_game",
          //     message: "Initialiazing a game",
          //   },
          // });

          return tx.transaction_hash;
        })
        .catch((e) => {
          console.error(e);
          return 0;
        });
    },
    [addTransaction, contract]
  );
}
