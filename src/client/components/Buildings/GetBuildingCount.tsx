import { useStarknet, useStarknetCall } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";

export function GetBuildingCount() {
  const [watch, setWatch] = useState(true);
  const { contract: building } = useBuildingsContract();

  const { data: counterBuildingsResult } = useStarknetCall({
    contract: building,
    method: "get_building_count",
    args: [uint256.bnToUint256(1)],
    options: { watch },
  });

  const counterBuildingsValue = useMemo(() => {
    console.log("counterBuildingsResult", counterBuildingsResult);
    if (counterBuildingsResult && counterBuildingsResult.length > 0) {
      var elem = toBN(counterBuildingsResult[0]);
      var newCounter = elem.toNumber();

      console.log("new counter", newCounter);

      return { counter: newCounter };
    }
  }, [counterBuildingsResult]);

  return (
    <>
      <div>
        Number of buildings built :{" "}
        {counterBuildingsValue && counterBuildingsValue.counter}
      </div>
    </>
  );
}
