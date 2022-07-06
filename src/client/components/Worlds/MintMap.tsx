import { useStarknet, useStarknetInvoke } from "@starknet-react/core";
import React, { useMemo, useState, useEffect } from "react";
import { useWorldsContract } from "../../hooks/worlds";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";

export function MintMap() {
  const [watch, setWatch] = useState(true);
  const { contract: worlds } = useWorldsContract();
  const [minting, setMinting] = useState(true);

  const {
    data: dataWorlds,
    loading: loadingWorlds,
    invoke: MintMapInvoke,
  } = useStarknetInvoke({
    contract: worlds,
    method: "get_map",
  });

  // Keep track of ids in DB ?

  const mintMap = () => {
    console.log("invoking mintMaps", Date.now());
    MintMapInvoke({
      args: [uint256.bnToUint256(1)],
      metadata: {
        method: "get_map",
        message: "Minting Maps",
      },
    });
    setMinting(true);
  };

  useEffect(() => {
    if (minting) {
      console.log("en train de minter la map");
    } else {
      console.log("minting done");
      console.log("loadingWorlds", loadingWorlds);
      console.log("data", dataWorlds);
    }
  }, [minting]);

  return (
    <>
      <div>
        <button onClick={() => mintMap()}>Mint Map</button>
      </div>
    </>
  );
}
