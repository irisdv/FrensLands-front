import React, { useEffect, useState, useMemo } from "react";
import Scene from "../three/Scene";
import { useStarknet, useStarknetCall } from "@starknet-react/core";
import { useGameContext } from "../hooks/useGameContext";
import { useSelectContext } from "../hooks/useSelectContext";
import { useBuildingsContract } from "../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { BottomBar } from "../components/GameUI/BottomBar";

export default function Game() {
  const { account } = useStarknet();
  const { contract: building } = useBuildingsContract();
  const [render, setRender] = useState(true);
  const [watch, setWatch] = useState(true);

  // if (account) {
  // const { address, buildingCount, setAddress, updateBuildings } =
  //   useGameContext();
  // // }

  const { data: counterBuildingsResult } = useStarknetCall({
    contract: building,
    method: "get_building_count",
    args: [uint256.bnToUint256(1)],
    options: { watch },
  });

  const counterBuildingsValue = useMemo(() => {
    if (counterBuildingsResult && counterBuildingsResult.length > 0) {
      var elem = toBN(counterBuildingsResult[0]);
      var newCounter = elem.toNumber();

      // updateBuildings(newCounter);

      return { counter: newCounter };
    }
  }, [counterBuildingsResult]);

  return (
    <>
      {render ? (
        <>
          <div className="relative">
            <Scene {...useGameContext()} {...useSelectContext()} />
          </div>
        </>
      ) : (
        <p>Loading socket</p>
      )}
    </>
  );
}
