import {
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
} from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";

export function InitializeBuildings() {
  const { account } = useStarknet();
  const [watch, setWatch] = useState(true);
  const [generating, setGenerating] = useState(true);

  const buildingTypes = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22,
  ];
  const buildingCosts = [
    1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5,
    5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10,
    5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1,
    10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5, 1, 10, 5, 5,
  ];
  //   ID_ressource, qty_resource, qty_gold, qty_energy
  const dailyCosts = [
    1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1,
    3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3,
    5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5,
    5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5,
  ];

  const dailyHarvest = [
    1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1,
    3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3,
    5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5,
    5, 1, 3, 5, 5, 1, 3, 5, 5, 1, 3, 5, 5,
  ];

  const buildingPops = [
    2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2,
    5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5,
  ];

  const { contract: buildings } = useBuildingsContract();

  const {
    data: dataTest,
    loading: loadingTest,
    invoke: initializeBuildingInvoke,
  } = useStarknetInvoke({
    contract: buildings,
    method: "initialize_global_data",
  });

  const initializeBuildings = () => {
    console.log("invoking initializeBuildings", Date.now());
    initializeBuildingInvoke({
      args: [
        buildingTypes,
        1,
        buildingCosts,
        dailyCosts,
        dailyHarvest,
        buildingPops,
      ],
      metadata: {
        method: "initialize_global_data",
        message: "Gen buildings data",
      },
    });
    setGenerating(true);
  };

  return (
    <>
      <button onClick={() => initializeBuildings()}>
        Initialize buildings
      </button>
    </>
  );
}
