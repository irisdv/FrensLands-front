import { useStarknet, useStarknetCall } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";

export function GetBuildings() {
  const [watch, setWatch] = useState(true);
  const { contract: building } = useBuildingsContract();

  const { data: buildingIdsResult } = useStarknetCall({
    contract: building,
    method: "get_all_building_ids",
    args: [uint256.bnToUint256(1)],
    options: { watch },
  });

  const buildingIdsValue = useMemo(() => {
    console.log("counterBuildingsResult", buildingIdsResult);
    if (buildingIdsResult && buildingIdsResult.length > 0) {
      var elem = toBN(buildingIdsResult[0]);
      var buildingIds = elem.toNumber();

      console.log("Array of buildingIds", buildingIds);

      return { buildingIds: buildingIds };
    }
  }, [buildingIdsResult]);

  return (
    <>
      <div>
        Building Ids : {buildingIdsValue && buildingIdsValue.buildingIds}
      </div>
    </>
  );
}
