import { useStarknet, useStarknetCall } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";

// import { BuildingFrame } from "./BuildingFrame";

export function BottomBar() {
  const { address } = useGameContext();

  const showBuildingFrame = () => {};

  return (
    <>
      <div className="absolute" style={{ bottom: "0px", right: "0px" }}>
        <div className="flex flex-row justify-center inline-block">
          <div
            className="btnBottom pixelated"
            onClick={() => showBuildingFrame()}
          ></div>
          <div className="btnBottom pixelated"></div>
          <div className="btnBottom pixelated"></div>
          <div className="btnBottom pixelated"></div>
        </div>
      </div>
    </>
  );
}
