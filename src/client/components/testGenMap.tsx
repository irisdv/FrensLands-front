import {
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
} from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useTestContract } from "../hooks/test";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";

export function TestGenMap() {
  const { account } = useStarknet();
  const [watch, setWatch] = useState(true);
  const [generating, setGenerating] = useState(true);
  const [ground, setGround] = useState<Number[]>([]);
  const table: any[] = [];

  const { contract: test } = useTestContract();

  const {
    data: dataTest,
    loading: loadingTest,
    invoke: fillGroundInvoke,
  } = useStarknetInvoke({
    contract: test,
    method: "fill_all_ground",
  });

  const genTableGround = () => {
    // Build array
    var i = 0;
    var j = 0;
    var w = 0;
    while (i < 40) {
      j = 0;
      while (j < 16) {
        table[w] = Math.floor(Math.random() * 3 + 1);
        j++;
        w++;
      }
      i++;
    }
    console.log("table", table);
  };

  const fillGround = () => {
    console.log("invoking GenGround", Date.now());
    fillGroundInvoke({
      args: [uint256.bnToUint256(1), table],
      metadata: { method: "fill_all_ground", message: "Gen Map" },
    });
    setGenerating(true);
  };

  const { data: testResult } = useStarknetCall({
    contract: test,
    method: "get_all_ground",
    args: [uint256.bnToUint256(1)],
    options: { watch },
  });

  const testValue = useMemo(() => {
    console.log("testResult", testResult);
    if (testResult && testResult.length > 0) {
      if (ground.length == 0) {
        console.log("testResult", testResult);
        console.log("timestamp change block", Date.now());

        // Fill array with values fetched
        let new_table: Number[] = [];
        testResult[0].forEach((element: any) => {
          var elem_toNumber = toBN(element);
          new_table.push(elem_toNumber.toNumber());
        });
        console.log("new_table filled", new_table);
        setGround(new_table);
        return { ground: new_table };
      } else {
        console.log("ground", ground);
      }

      return { ground: ground };
    }
  }, [testResult]);

  //   useEffect(() => {
  //     if (dataTest) console.log("dataDice", dataTest);
  //     console.log("loadingTest tx", loadingTest);
  //   }, [dataTest, loadingTest]);

  if (!account) {
    return null;
  }

  return (
    <>
      <div>
        <button onClick={() => genTableGround()}>
          Générer le tableau des grounds
        </button>
        <button onClick={() => fillGround()}>Fill ground onchain</button>
      </div>
    </>
  );
}
