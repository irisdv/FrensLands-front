import { useStarknet, useStarknetInvoke } from "@starknet-react/core";
import React, { useMemo, useState, useEffect } from "react";
import { useWorldsContract } from "../../hooks/contracts/worlds";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";

export function MintMap() {
  const [watch, setWatch] = useState(true);
  const { contract: worlds } = useWorldsContract();
  const [loading, setLoading] = useState(true);

  const {
    data: dataWorlds,
    loading: loadingWorlds,
    invoke: StartGameInvoke,
  } = useStarknetInvoke({
    contract: worlds,
    method: "start_game",
  });

  // Keep track of ids in DB ?

  const startGame = () => {
    console.log("invoking mintMaps", Date.now());
    StartGameInvoke({
      args: [uint256.bnToUint256(1)],
      metadata: {
        method: "start_game",
        message: "Starting game",
      },
    });
    setLoading(true);
  };

  useEffect(() => {
    if (loading) {
      console.log("en train de minter la map");
    } else {
      console.log("minting done");
      console.log("loadingWorlds", loadingWorlds);
      console.log("data", dataWorlds);
    }
  }, [loading]);

  return (
    <>
      <div>
        <button onClick={() => startGame()}>Start Game</button>
      </div>
    </>
  );
}
