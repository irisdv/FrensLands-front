import React, { useEffect, useState, useMemo } from "react";
import { useStarknet } from "@starknet-react/core";
import useInGameContext from "../hooks/useInGameContext";
import DB from '../db.json';
import { Scene } from '../components/r3f/Scene'
import { MenuBar } from "../components/GameUI/MenuBar";
import { BottomBar } from "../components/GameUI/BottomBar";
import { BuildingFrame } from "../components/GameUI/BuildingFrame";
import { SelectStateProvider } from "../providers/SelectContext";
import { BuildingStateProvider } from "../providers/BuildingContext";
import { useGameContext } from "../hooks/useGameContext";
import { Achievements } from "../components/GameUI/Achievements";

export default function Play() {
  const { account } = useStarknet();
  const { setAddress, updateTokenId, tokenId, fetchMapType } = useGameContext();
  const [render, setRender] = useState(true);
  const [worldType, setWorldType] = useState(-1)

  const { mapArray } = useInGameContext()

  const rightBuildingType : any[] = [0, 1, 179, 15, 3, 10, 5, 8, 7, 6, 59, 11, 9, 12, 13, 60, 52, 58, 61, 4, 20, 14, 49, 57, 100]
  const [textArrRef, setTextArrRef] = useState<any[]>([])
  const [UBlockIDs, setUBlockIDs] = useState(0);
  // var validatedBlockArray : any[]= [];

  const [buildingCounters, setBuildingCounters] = useState<any[]>([])
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (account) {
      setAddress(account as string);
    }
  }, [account])

  useEffect(() => {
    if (account && !tokenId) {
      updateTokenId(account);
    }
  }, [account, tokenId])

  useEffect(() => {
    if (tokenId) {
      // @ts-ignore
      setWorldType(DB.metadata[tokenId].type)
    }
  }, [tokenId])

  useEffect(() => {
    var x = 0;
    var y = 15;
    var value = 1;
    let textArrRefTemp : any[] = []

    while (y >= 0)
    {
        textArrRefTemp[y] = [];
        while (x < 16)
        {
            textArrRefTemp[y][x] = value;
            x++;
            value++;
        }
        x = 0;
        y--;
    }
    setTextArrRef(textArrRefTemp)
  }, [])

  const frontBlockArray = useMemo(() => {
    if (mapArray && Object.keys(mapArray).length > 0) {
      var frontArray: any[] = [];
      console.log('mapArray received', mapArray)
      // Decompose array
      var indexI = 1;
      var indexJ = 1;
      var i = 0;
      var buildingIDs = 0;

      var counters : any[] = []

      while (indexI < 17)
      {
        // validatedBlockArray[indexI] = [];
        frontArray[indexI] = [];

        while (indexJ < 41)
        {
          // validatedBlockArray[indexI][indexJ] = decompose(mapArray[i]);

          frontArray[indexI][indexJ] = decompose(mapArray[i]);
          // frontArray[indexI][indexJ][4] = i;
          if (frontArray[indexI][indexJ][4] != 0) buildingIDs++;

          if (frontArray[indexI][indexJ] && frontArray[indexI][indexJ][3] && frontArray[indexI][indexJ][3] > 0) {
            let currCounter = 0;
            if (counters[frontArray[indexI][indexJ][3]] > 0) currCounter = counters[frontArray[indexI][indexJ][3]]

            if (frontArray[indexI][indexJ][3] == 2 || frontArray[indexI][indexJ][3] == 3 || frontArray[indexI][indexJ][3] == 20) {
              counters[frontArray[indexI][indexJ][3]] = currCounter + (4 - frontArray[indexI][indexJ][7])
            } else {
              counters[frontArray[indexI][indexJ][3]] = currCounter + 1
            }
          }

          indexJ++;
          i++;
        }
        indexJ = 1;
        indexI++;
        }
        setUBlockIDs(buildingIDs)
        // console.log('building counters', counters)
        setBuildingCounters(counters)

        // Calculate level 
        if (frontArray[8][20][7] == 2)  setLevel(2)
        if (counters[4] && counters[4] > 0 && counters[16] && counters[16] > 0) setLevel(3)
        if (counters[21] && counters[21] > 0) setLevel(4)
        if (counters[8] && counters[7] && counters[8] > 0 && counters [7] > 0) setLevel(5)
        if (counters[9] && counters[11] && counters[9] > 0 && counters[11] > 0) setLevel(6)
        if (counters[22] && counters[22] > 0) setLevel(7)
        if (counters[5] && counters[5] > 0) setLevel(8)

        return { frontArray }
    }
  }, [mapArray])

  function decompose(elem: any)
  {
    var tempDecomp : any[] = [];

    if (elem.length < 16)
    {
        tempDecomp[0] = parseInt(elem[0]);                      //[pos:x]
        tempDecomp[1] = parseInt(elem[1] + elem[2]);            //[pos:y]
        tempDecomp[2] = parseInt(elem[3]);                      //[mat type]
        tempDecomp[3] = parseInt(elem[4] + elem[5]);            //[ress or bat type]  + 900 pour avoir 999 max
        tempDecomp[4] = parseInt(elem[6] + elem[7] + elem[8]);  //[UNIQUE ID]
        tempDecomp[5] = parseInt(elem[9] + elem[10]);           //[health]
        tempDecomp[6] = parseInt(elem[11] + elem[12]);          //[quantity ress or pop + 900 pour avoir 999 ???
        tempDecomp[7] = parseInt(elem[13]);                     //[current level]
        tempDecomp[8] = parseInt(elem[14]);                     //[size]
        tempDecomp[9] = 0;                                      //[random ID]
        tempDecomp[10] = 1                                      // Local: Status of building (1 = built, 0 = en construction)
        tempDecomp[11] = []                                     // last tx hash
    }
    else
    {
        tempDecomp[0] = parseInt(elem[0] + elem[1]);            //[pos:x]
        tempDecomp[1] = parseInt(elem[2] + elem[3]);            //[pos:y]
        tempDecomp[2] = parseInt(elem[4]);                      //[mat type]
        tempDecomp[3] = parseInt(elem[5] + elem[6]);            //[ress or bat type]
        tempDecomp[4] = parseInt(elem[7] + elem[8] + elem[9]);  //[UNIQUE ID]
        tempDecomp[5] = parseInt(elem[10] + elem[11]);          //[health]
        tempDecomp[6] = parseInt(elem[12] + elem[13]);          //[quantity ress or pop]
        tempDecomp[7] = parseInt(elem[14]);                     //[current level]
        tempDecomp[8] = parseInt(elem[15]);                     //[activity index or number of days active]
        tempDecomp[9] = 0;                                      //[random ID]
        tempDecomp[10] = 1                                      // Local : Status of building (1 = built, 0 = en construction)
        tempDecomp[11] = []                                     // last tx hash
    }

    if (tempDecomp[3] == 2 || tempDecomp[3] == 3)
    {
      tempDecomp[9] = parseInt((Math.random() * (3 - 1) + 1).toFixed(0));
    }

    // if (tempDecomp[4] == 0) // DEBUG CONDITION WITH "ANTI 0"
    // {
    //   tempDecomp[3] = 0;
    // }

    return (tempDecomp);
  }

  return (
    <>
      {frontBlockArray?.frontArray && Object.keys(frontBlockArray.frontArray).length > 0 ? (
        <>
        <BuildingStateProvider>
          <SelectStateProvider>
            <MenuBar />
            <Achievements level={level} />
            <div style={{ height: "100vh", width: "100vw", zIndex: "0" }}>
              {frontBlockArray && Object.keys(frontBlockArray).length > 0 &&
                worldType != null && worldType != -1 &&
                  <Scene
                    mapArray={frontBlockArray.frontArray}
                    textArrRef={textArrRef}
                    rightBuildingType={rightBuildingType}
                    worldType={worldType}
                    UBlockIDs={UBlockIDs}
                     />
                }
            </div>
            {frontBlockArray && Object.keys(frontBlockArray).length > 0 &&
              <BuildingFrame frontBlockArray={frontBlockArray.frontArray} level={level} />
            }
            <BottomBar level={level} />
          </SelectStateProvider>
          </BuildingStateProvider>
        </>
      ) : (
        <div style={{backgroundColor: "rgb(21, 29, 40)", width: "100vw", height: "100vh"}}>
          <img src="resources/front/LoadingScreen.gif" className="mx-auto my-auto" />
        </div>
      )}
    </>
  );
}
