import { useStarknet, useStarknetCall } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";

export function MenuBar() {
  // if (account) {
  const {} = useGameContext();
  // // }
  //   const [watch, setWatch] = useState(true);
  //   const { contract: building } = useBuildingsContract();

  //   const { data: counterBuildingsResult } = useStarknetCall({
  //     contract: building,
  //     method: "get_building_count",
  //     args: [uint256.bnToUint256(1)],
  //     options: { watch },
  //   });

  //   const counterBuildingsValue = useMemo(() => {
  //     console.log("counterBuildingsResult", counterBuildingsResult);
  //     if (counterBuildingsResult && counterBuildingsResult.length > 0) {
  //       var elem = toBN(counterBuildingsResult[0]);
  //       var newCounter = elem.toNumber();

  //       console.log("new counter", newCounter);

  //       return { counter: newCounter };
  //     }
  //   }, [counterBuildingsResult]);

  // Choper les ressources pour chaque Resources ID
  // Donc ID allant de 1 à 5

  //   Gestion du block Number

  return (
    <>
      <div className="absolute">
        <div className="flex flex-row justify-center inline-block">
          <div className="btnHome pixelated" style={{ left: "5px" }}></div>
          <div
            id="menuBar"
            className="relative flex jutify-center items-center inline-block pixelated"
            style={{ fontSize: "16px" }}
          >
            <div
              className="flex jutify-center pl-2 relative"
              style={{ marginTop: "-13px", marginLeft: "50px" }}
            >
              <div id="menuGold" className="pixelated"></div>
              <div
                className="flex items-center fontHPxl pb-1 menuItems pixelated"
                style={{ marginTop: "-2px" }}
              >
                100
              </div>
            </div>
            <div
              className="flex jutify-center relative"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuWood" className="pixelated"></div>
              <div
                className="flex items-center fontHPxl pb-1 menuItems pixelated"
                style={{ marginTop: "-2px" }}
              >
                100
              </div>
            </div>
            <div
              className="flex jutify-center relative"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuRock" className="pixelated"></div>
              <div
                className="flex items-center fontHPxl pb-1 menuItems pixelated"
                style={{ marginTop: "-2px" }}
              >
                100
              </div>
            </div>
            <div
              className="flex jutify-center relative"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuMetal" className="pixelated"></div>
              <div
                className="flex items-center fontHPxl pb-1 menuItems pixelated"
                style={{ marginTop: "-2px" }}
              >
                100
              </div>
            </div>
            <div
              className="flex jutify-center relative"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuCoal" className="pixelated"></div>
              <div
                className="flex items-center fontHPxl pb-1 menuItems pixelated"
                style={{ marginTop: "-2px" }}
              >
                100
              </div>
            </div>
            <div
              className="flex jutify-center relative"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuPop" className="pixelated"></div>
              <div
                className="flex items-center fontHPxl pb-1 menuItems pixelated"
                style={{ marginTop: "-2px" }}
              >
                100
              </div>
            </div>
            <div
              className="flex jutify-center relative"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuMeat" className="pixelated"></div>
              <div
                className="flex items-center fontHPxl pb-1 menuItems pixelated"
                style={{ marginTop: "-2px" }}
              >
                100
              </div>
            </div>
            <div
              className="flex jutify-center relative"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuCereal" className="pixelated"></div>
              <div
                className="flex items-center fontHPxl pb-1 menuItems pixelated"
                style={{ marginTop: "-2px" }}
              >
                100
              </div>
            </div>
            <div
              className="flex jutify-center relative"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuEnergy" className="pixelated"></div>
              <div
                className="flex items-center fontHPxl pb-1 menuItems pixelated"
                style={{ marginTop: "-2px" }}
              >
                100
              </div>
            </div>
          </div>
          <div className="btnRight pixelated"></div>
        </div>
      </div>
    </>
  );
}
