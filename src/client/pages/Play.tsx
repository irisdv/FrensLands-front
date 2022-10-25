import React, { useEffect, useState, useMemo } from "react";
import { Scene } from "../components/r3f/Scene";
import { MenuBar } from "../components/GameUI/MenuBar";
import { BottomBar } from "../components/GameUI/BottomBar";
import { BuildingFrame } from "../components/GameUI/BuildingFrame";
import { Achievements } from "../components/GameUI/Achievements";
import { useLocation, useNavigate } from "react-router-dom";
import { useNewGameContext } from "../hooks/useNewGameContext";
import { getStarknet } from "get-starknet";
import { useSelectContext } from "../hooks/useSelectContext";
import getPlayer, { getLandInformation } from "../api/player";
import { useFLContract } from "../hooks/contracts/frenslands";
import { number } from "starknet";

export default function Play() {
  const {
    wallet,
    player,
    initPlayer,
    initGameSession,
    fullMap,
    inventory,
    counters,
    payloadActions,
  } = useNewGameContext();
  const { initSettings } = useSelectContext();
  const { state } = useLocation();
  const { landId } = state;
  const navigate = useNavigate();
  const [textArrRef, setTextArrRef] = useState<any[]>([]);
  const [isInit, setIsInit] = useState(false);
  const frenslandsContract = useFLContract();

  const fullMapValue = useMemo(() => {
    console.log("fullMap in Play.tsx", fullMap);
    return fullMap;
  }, [fullMap]);

  const compareFullMap = async (_wallet: any, localFullMap: any) => {
    const _localFullMap = localFullMap.split("|");
    console.log("_local full map", _localFullMap);
    console.log("landId", landId);
    _wallet.account
      .callContract(
        {
          contractAddress: frenslandsContract.address.toLowerCase(),
          entrypoint: "get_map_array",
          calldata: [number.toFelt(landId)],
        },
        { blockIdentifier: "pending" }
      )
      .then((res: any) => {
        const _updatedArr: any = [];
        if (res && res.result) {
          res.result.map((elem: any) => {
            if (Number(elem) != 640) _updatedArr.push(Number(elem).toString());
          });
        }
        // enlever la première valeur de l'array car == taille de l'array
        console.log("result fullMap of player", res);
        console.log("_updatedArr_updatedArr", _updatedArr);
        if (
          _updatedArr.length === _localFullMap.length &&
          _updatedArr.every(function (value: any, index: any) {
            return value === _localFullMap[index];
          })
        ) {
          console.log("same arrays");
        } else {
          console.log("not same array");
        }
        return res;
      })
      .catch((error: any) => {
        console.log("error while fetching player fullMap", error);
      });

    _wallet.account
      .callContract(
        {
          contractAddress: frenslandsContract.address.toLowerCase(),
          entrypoint: "get_all_buildings_data",
          calldata: [number.toFelt(landId)],
        },
        { blockIdentifier: "pending" }
      )
      .then((res: any) => {
        console.log("array of buildings", res);
      });

    return "";
  };

  useEffect(() => {
    if (!wallet && !isInit && landId) {
      const _wallet = getStarknet();
      _wallet.enable().then((data: any) => {
        if (_wallet.isConnected) {
          initPlayer(_wallet);

          getPlayer(_wallet.account.address)
            .then((data) => {
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
                  land.inventories &&
                  land.player_actions &&
                  land.player_buildings
                ) {
                  // Compare data with chain
                  // compareFullMap(_wallet, land.fullMap).then((res: any) => {
                  //   console.log("res", res);
                  // });
                  //  ! TODO update db names
                  initGameSession(
                    land.inventories,
                    land,
                    land.player_actions,
                    land.player_buildings as [],
                    data.account,
                    data.id
                  );
                  setIsInit(true);
                }
              });
            })
            .catch((error: any) => {
              if (error && error.code == "PGRST301") navigate("/");
            });
        } else {
          navigate("/");
        }
      });
    }
  }, [wallet]);

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

  return (
    <>
      {inventory &&
      fullMapValue &&
      player.biomeId &&
      fullMapValue.length > 0 ? (
        <>
          <MenuBar payloadActions={payloadActions} />
          <Achievements level={inventory[11]} />
          <div style={{ height: "100vh", width: "100vw", zIndex: "0" }}>
            <Scene
              mapArray={fullMap}
              textArrRef={textArrRef}
              worldType={player.biomeId}
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
