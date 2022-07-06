import {
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
} from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";

export function BuildBuildings() {
  const { account } = useStarknet();
  const [watch, setWatch] = useState(true);
  const [generating, setGenerating] = useState(true);

  const { contract: buildings } = useBuildingsContract();

  const {
    data: dataBuilding,
    loading: loadingBuilding,
    invoke: buildBuildingInvoke,
  } = useStarknetInvoke({
    contract: buildings,
    method: "update",
  });

  const initializeBuildings = () => {
    console.log("invoking updateBuildings", Date.now());
    buildBuildingInvoke({
      args: [uint256.bnToUint256(1), 2, 1, 1, 2],
      metadata: {
        method: "update",
        message: "Update building",
      },
    });
    setGenerating(true);
  };

  return (
    <>
      {/* Args : token_id: { low: 1, high: 0 },
        building_id: 2,
        level: 1,
        position: 1,
        allocated_population: 2, */}
      <button onClick={() => initializeBuildings()}>Build buildings</button>
    </>
  );
}
