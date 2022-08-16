import React, { useEffect, useState, useMemo } from "react";
import Scene from "../three/Scene";
import { useStarknet, useStarknetCall } from "@starknet-react/core";
import useInGameContext from "../hooks/useInGameContext";
import { useSelectContext } from "../hooks/useSelectContext";
import { useBuildingsContract } from "../hooks/contracts/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import useTxGame from "../hooks/useTxGame";

export default function Game() {
  const { account } = useStarknet();
  const { contract: building } = useBuildingsContract();
  const [render, setRender] = useState(true);

  return (
    <>
      {render ? (
        <>
          <div className="relative">
            <Scene {...useInGameContext()} {...useSelectContext()} {...useTxGame()} />
          </div>
        </>
      ) : (
        <p>Loading socket</p>
      )}
    </>
  );
}
