import React, { useEffect, useState, useMemo } from "react";
// import { useStarknet } from '@starknet-react/core'
import useInGameContext from "../hooks/useInGameContext";
import { Scene } from "../components/r3f/Scene";
import { MenuBar } from "../components/GameUI/MenuBar";
import { BottomBar } from "../components/GameUI/BottomBar";
import { BuildingFrame } from "../components/GameUI/BuildingFrame";
// import { SelectStateProvider } from "../providers/SelectContext";
// import { BuildingStateProvider } from "../providers/BuildingContext";
import { useGameContext } from "../hooks/useGameContext";
import { Achievements } from "../components/GameUI/Achievements";
import { useLocation, useNavigate } from "react-router-dom";
import { allMetadata } from "../data/metadata";
import { useNewGameContext } from "../hooks/useNewGameContext";
import { getStarknet } from "@starknet/get-starknet";
import { useSelectContext } from "../hooks/useSelectContext";
import getPlayer, { getLandInformation } from "../api/player";
// import { showErrorMessage, showSuccessMessage } from "../helpers/ExceptionUtils";

export default function Play() {
  const { address, setAddress, updateTokenId, tokenId, fetchMapType } =
    useGameContext();
  // * new game context
  const {
    wallet,
    player,
    initPlayer,
    initGameSession,
    fullMap,
    inventory,
    staticBuildings,
    staticResources,
    counters,
    updateActions,
    payloadActions,
    transactions,
  } = useNewGameContext();
  const { initSettings } = useSelectContext();
  const { state } = useLocation();
  const { landId } = state;
  const navigate = useNavigate();

  const [worldType, setWorldType] = useState(-1);

  const { mapArray } = useInGameContext();
  const rightBuildingType: any[] = [
    0, 1, 179, 15, 3, 10, 5, 8, 7, 6, 59, 11, 9, 12, 13, 60, 36, 58, 61, 4, 20,
    14, 33, 57, 100, 20, 24, 183,
  ];
  // Big building type
  // const rightBuildingType : any[] = [0, 81, 179, 15, 83, 114, 105, 89, 90, 91, 108, 85, 86, 87, 88, 109, 104, 102, 45, 84, 20, 93, 97, 107, 100, 148, 146, 184]
  // XL Cow farm = 45 ou 99
  // Vegetable farm = 42 ou 102
  // Wheat farm = 36 ou 103 ou 104
  const [textArrRef, setTextArrRef] = useState<any[]>([]);
  const [UBlockIDs, setUBlockIDs] = useState(0);
  const [buildingCounters, setBuildingCounters] = useState<any[]>([]);
  const [level, setLevel] = useState(1);

  const fullMapValue = useMemo(() => {
    console.log("fullMap in Play.tsx", fullMap);
    return fullMap;
  }, [fullMap]);

  useEffect(() => {
    if (!wallet) {
      const _wallet = getStarknet();
      _wallet.enable().then((data: any) => {
        console.log("_wallet", _wallet);
        if (_wallet.isConnected) {
          initPlayer(_wallet);
          setAddress(_wallet.account.address); // ! ancien game context

          getPlayer(_wallet.account.address).then((data) => {
            console.log("data", data);
            if (data) {
              initSettings({
                zoom: data.invZoom,
                tutorial: data.tutorial,
                sound: data.sound,
              });
            }
            getLandInformation(landId).then((land: any) => {
              console.log("data land received", land);
              if (
                data &&
                land &&
                land.inventories_duplicate &&
                land.player_actions &&
                land.player_buildings_duplicate
              ) {
                //  ! TODO update db names
                initGameSession(
                  land.inventories_duplicate,
                  land,
                  land.player_actions,
                  land.player_buildings_duplicate as [],
                  data.account,
                  data.id
                );
              }
            });
          });
        } else {
          navigate("/");
        }
      });
    }
  }, [wallet]);

  useEffect(() => {
    if (address && !tokenId) {
      updateTokenId(address);
    }
  }, [address, tokenId]);

  useEffect(() => {
    if (tokenId) {
      const _metadata = allMetadata.filter((res) => res.id == tokenId);
      setWorldType(_metadata[0].biome);
    }
  }, [tokenId]);

  useEffect(() => {
    let x = 0;
    let y = 15;
    let value = 1;
    const textArrRefTemp: any[] = [];

    while (y >= 0) {
      textArrRefTemp[y] = [];
      while (x < 16) {
        textArrRefTemp[y][x] = value;
        x++;
        value++;
      }
      x = 0;
      y--;
    }
    setTextArrRef(textArrRefTemp);
  }, []);

  // useEffect(() => {
  //   if (transactions && transactions.length > 0) {
  //     transactions.forEach((transaction : any) => {
  //       console.log('transaction', transaction)
  //       try{
  //         showSuccessMessage("Nicely done", "You did very well");
  //       }catch(e){
  //         showErrorMessage("Something exploded", "Better luck next time");
  //       }
  //     })
  //   }
  // }, [transactions])

  // const frontBlockArray = useMemo(() => {
  //   if (mapArray != null && Object.keys(mapArray).length > 0) {
  //     const frontArray: any[] = [];
  //     // console.log("mapArray received", mapArray);
  //     // Decompose array
  //     let indexI = 1;
  //     let indexJ = 1;
  //     let i = 0;
  //     let buildingIDs = 0;

  //     const counters: any[] = [];

  //     while (indexI < 17) {
  //       // validatedBlockArray[indexI] = [];
  //       frontArray[indexI] = [];

  //       while (indexJ < 41) {
  //         // validatedBlockArray[indexI][indexJ] = decompose(mapArray[i]);

  //         frontArray[indexI][indexJ] = decompose(mapArray[i]);
  //         // frontArray[indexI][indexJ][4] = i;
  //         if (frontArray[indexI][indexJ][4] != 0) buildingIDs++;

  //         if (
  //           frontArray[indexI][indexJ] &&
  //           frontArray[indexI][indexJ][3] &&
  //           frontArray[indexI][indexJ][3] > 0
  //         ) {
  //           let currCounter = 0;
  //           if (counters[frontArray[indexI][indexJ][3]] > 0) {
  //             currCounter = counters[frontArray[indexI][indexJ][3]];
  //           }

  //           if (
  //             frontArray[indexI][indexJ][3] == 2 ||
  //             frontArray[indexI][indexJ][3] == 3 ||
  //             frontArray[indexI][indexJ][3] == 20
  //           ) {
  //             counters[frontArray[indexI][indexJ][3]] =
  //               currCounter + (4 - frontArray[indexI][indexJ][7]);
  //           } else {
  //             counters[frontArray[indexI][indexJ][3]] = currCounter + 1;
  //           }
  //         }

  //         indexJ++;
  //         i++;
  //       }
  //       indexJ = 1;
  //       indexI++;
  //     }
  //     setUBlockIDs(buildingIDs);
  //     // console.log('building counters', counters)
  //     setBuildingCounters(counters);

  //     // Calculate level
  //     if (frontArray[8][20][7] == 2) setLevel(2);
  //     if (counters[4] && counters[4] > 0 && counters[16] && counters[16] > 0) {
  //       setLevel(3);
  //     }
  //     if (counters[21] && counters[21] > 0) setLevel(4);
  //     if (counters[8] && counters[7] && counters[8] > 0 && counters[7] > 0) {
  //       setLevel(5);
  //     }
  //     if (counters[9] && counters[11] && counters[9] > 0 && counters[11] > 0) {
  //       setLevel(6);
  //     }
  //     if (counters[22] && counters[22] > 0) setLevel(7);
  //     if (counters[5] && counters[5] > 0) setLevel(8);
  //     if (
  //       counters[4] > 0 &&
  //       counters[5] > 0 &&
  //       counters[6] > 0 &&
  //       counters[7] > 0 &&
  //       counters[8] > 0 &&
  //       counters[9] > 0 &&
  //       counters[10] > 0 &&
  //       counters[11] > 0 &&
  //       counters[12] > 0 &&
  //       counters[13] > 0 &&
  //       counters[14] > 0 &&
  //       counters[15] > 0 &&
  //       counters[16] > 0 &&
  //       counters[17] > 0 &&
  //       counters[18] > 0 &&
  //       counters[19] > 0 &&
  //       counters[21] > 0 &&
  //       counters[22] > 0 &&
  //       counters[23] > 0 &&
  //       counters[24] > 0 &&
  //       counters[25] > 0 &&
  //       counters[26] > 0
  //     ) {
  //       setLevel(9);
  //     }

  //     return { frontArray };
  //   }
  // }, [mapArray]);

  // function decompose(elem: any) {
  //   const tempDecomp: any[] = [];

  //   if (elem.length < 16) {
  //     tempDecomp[0] = parseInt(elem[0]); // [pos:x]
  //     tempDecomp[1] = parseInt(elem[1] + elem[2]); // [pos:y]
  //     tempDecomp[2] = parseInt(elem[3]); // [mat type]
  //     tempDecomp[3] = parseInt(elem[4] + elem[5]); // [ress or bat type]  + 900 pour avoir 999 max
  //     tempDecomp[4] = parseInt(elem[6] + elem[7] + elem[8]); // [UNIQUE ID]
  //     tempDecomp[5] = parseInt(elem[9] + elem[10]); // [health]
  //     tempDecomp[6] = parseInt(elem[11] + elem[12]); // [quantity ress or pop + 900 pour avoir 999 ???
  //     tempDecomp[7] = parseInt(elem[13]); // [current level]
  //     tempDecomp[8] = parseInt(elem[14]); // [size]
  //     tempDecomp[9] = 0; // [random ID]
  //     tempDecomp[10] = 1; // Local: Status of building (1 = built, 0 = en construction)
  //     tempDecomp[11] = []; // last tx hash
  //   } else {
  //     tempDecomp[0] = parseInt(elem[0] + elem[1]); // [pos:x]
  //     tempDecomp[1] = parseInt(elem[2] + elem[3]); // [pos:y]
  //     tempDecomp[2] = parseInt(elem[4]); // [mat type]
  //     tempDecomp[3] = parseInt(elem[5] + elem[6]); // [ress or bat type]
  //     tempDecomp[4] = parseInt(elem[7] + elem[8] + elem[9]); // [UNIQUE ID]
  //     tempDecomp[5] = parseInt(elem[10] + elem[11]); // [health]
  //     tempDecomp[6] = parseInt(elem[12] + elem[13]); // [quantity ress or pop]
  //     tempDecomp[7] = parseInt(elem[14]); // [current level]
  //     tempDecomp[8] = parseInt(elem[15]); // [activity index or number of days active]
  //     tempDecomp[9] = 0; // [random ID]
  //     tempDecomp[10] = 1; // Local : Status of building (1 = built, 0 = en construction // 1= not harvested, 0 = currently harvested)
  //     tempDecomp[11] = []; // last tx hash
  //   }

  //   if (tempDecomp[3] == 2 || tempDecomp[3] == 3) {
  //     tempDecomp[9] = parseInt((Math.random() * (3 - 1) + 1).toFixed(0));
  //   }

  //   // if (tempDecomp[4] == 0) // DEBUG CONDITION WITH "ANTI 0"
  //   // {
  //   //   tempDecomp[3] = 0;
  //   // }

  //   return tempDecomp;
  // }

  return (
    <>
      {inventory &&
      fullMapValue &&
      player["biomeId" as any] &&
      fullMapValue.length > 0 ? (
        <>
          <MenuBar payloadActions={payloadActions} />
          <Achievements level={inventory[11]} />
          <div style={{ height: "100vh", width: "100vw", zIndex: "0" }}>
            <Scene
              mapArray={fullMap}
              textArrRef={textArrRef}
              rightBuildingType={rightBuildingType}
              worldType={player["biomeId" as any]}
              // TODO add last buildingIds in counters array
              UBlockIDs={counters["buildings" as any]}
            />
          </div>
          <BuildingFrame frontBlockArray={fullMap} level={inventory[11]} />
          <BottomBar level={inventory[11]} />
        </>
      ) : (
        <div
          style={{
            backgroundColor: "rgb(21, 29, 40)",
            width: "100vw",
            height: "100vh",
          }}
        >
          <img
            src="resources/front/LoadingScreen.gif"
            className="mx-auto my-auto"
          />
        </div>
      )}
    </>
  );
}
