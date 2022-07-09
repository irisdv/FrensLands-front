import { useStarknet, useStarknetCall } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";

// import { BuildingFrame } from "./BuildingFrame";

export function BottomBar() {
  const { address } = useGameContext();
  const [displayNature, setDisplayNature] = useState(false)

  const showBuildingFrame = () => {};

  return (
    <>
      <div className="absolute" style={{ bottom: "60px", right: "0px" }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnCategory pixelated"onClick={() => setDisplayNature(true)}>
            <div className=" pixelated"></div>
          </div>
          <div className="btnCategory pixelated"><div className=" pixelated"></div></div>
          <div className="btnCategory pixelated"><div className=" pixelated"></div></div>
          <div className="btnCategory pixelated"><div className=" pixelated"></div></div>
          <div className="btnCategory pixelated"><div className=" pixelated"></div></div>
        </div>
      </div>
      <div className="absolute" style={{ bottom: "0px", right: "0px" }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnBottom pixelated"onClick={() => setDisplayNature(true)}>
            <div className="menuNature pixelated"></div>
          </div>
          <div className="btnBottom pixelated"><div className="menuSecurity pixelated"></div></div>
          <div className="btnBottom pixelated"><div className="menuEntertainment pixelated"></div></div>
          <div className="btnBottom pixelated"><div className="menuHouse pixelated"></div></div>
          <div className="btnBottom pixelated"><div className="menuShop pixelated"></div></div>
        </div>
      </div>
    </>
  );
}
