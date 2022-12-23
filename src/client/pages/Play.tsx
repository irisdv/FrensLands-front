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
import { useFLContract } from "../hooks/contracts/frenslands";
import { number } from "starknet";
import {
  calculatePlayerLevel,
  composeFromChain,
  initMapArr,
} from "../utils/land";
import { allBuildings } from "../data/buildings";
import { fillStaticBuildings } from "../utils/static";
import { initCounters } from "../utils/building";

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
    updateInventory,
    updateMapBlock,
    updateCounters,
    updatePlayerBuildings,
    addAction,
  } = useNewGameContext();
  const { initSettings } = useSelectContext();
  const { state } = useLocation();
  const { landId, wasInit, bCounter } = state;
  const navigate = useNavigate();
  const [textArrRef, setTextArrRef] = useState<any[]>([]);
  const [isInit, setIsInit] = useState(false);
  const frenslandsContract = useFLContract();

  const fullMapValue = useMemo(() => {
    console.log("fullMap in Play.tsx", fullMap);
    return fullMap;
  }, [fullMap]);

  const neverInit = (_wallet: any) => {
    let _inventory = [];
    _inventory[0] = 0;
    _inventory[1] = 0;
    _inventory[2] = 20;
    _inventory[3] = 0;
    _inventory[4] = 0;
    _inventory[5] = 0;
    _inventory[6] = 0;
    _inventory[7] = 0;
    _inventory[8] = 1;
    _inventory[9] = 1;
    _inventory[10] = 0;
    _inventory[11] = 1;
    console.log(_inventory);

    let _fullMap = initMapArr(_wallet.account.address);

    let _buildings = [];
    _buildings[1] = {
      activeCycles: 0,
      decay: 100,
      gameUid: 1,
      incomingCycles: 0,
      lastFuel: 0,
      posX: 20,
      posY: 8,
      type: 1,
    };

    let _counters = [];
    _counters["uid" as any] = 1;
    _counters["incomingInventory" as any] = [];
    _counters["inactive" as any] = 0;
    _counters["active" as any] = 0;
    _counters["blockClaimable" as any] = 0;
    _counters[1] = [];
    _counters[2] = [];

    return { _inventory, _fullMap, _buildings, _counters };
  };

  const getMap = async (wallet: any, landId: number) => {
    let _map = await wallet.account.callContract({
      contractAddress: frenslandsContract.address,
      entrypoint: "get_map_array",
      calldata: [number.toFelt(landId)],
    });
    _map.result.splice(0, 1);
    console.log("_map", _map.result);
    let { res: _mapComp, counters } = composeFromChain(
      _map.result,
      wallet.account.address
    );
    console.log("_mapComp", _mapComp);

    let _cabinDecay = await wallet.account.callContract({
      contractAddress: frenslandsContract.address,
      entrypoint: "get_building_decay",
      calldata: [number.toFelt(landId), number.toFelt(1)],
    });
    console.log("_cabinDecay", Number(_cabinDecay.result[0]));

    let playerBuildings: any = [];
    let lastUID = 0;

    if (bCounter > 1) {
      let _buildings = await wallet.account.callContract({
        contractAddress: frenslandsContract.address,
        entrypoint: "get_all_buildings_data",
        calldata: [number.toFelt(landId)],
      });
      console.log("_buildings", _buildings);

      _buildings.result.splice(0, 1);
      const blockNb = await wallet.account.getBlock();

      for (let i = 0; i < _buildings.result.length; i += 6) {
        let id = Number(_buildings.result[i]);
        let pos_start = Number(_buildings.result[i + 2]).toString();
        let activeCycles = Number(_buildings.result[i + 3]);
        let incomingCycles = Number(_buildings.result[i + 4]);
        let lastFuel = Number(_buildings.result[i + 5]);

        if (incomingCycles > 0) {
          if (lastFuel + incomingCycles < blockNb.block_number) {
            // tout le fuel est passé
            activeCycles += incomingCycles;
            incomingCycles = 0;
          } else {
            // seulement une partie du fuel est passé
            let fuelPassed = blockNb.block_number - lastFuel;
            activeCycles += fuelPassed;
            incomingCycles -= fuelPassed;
          }
        }

        playerBuildings[id] = {
          type: Number(_buildings.result[i + 1]),
          posX: Number(pos_start[0] + pos_start[1]),
          posY: Number(pos_start[2] + pos_start[3]),
          activeCycles: activeCycles,
          incomingCycles: incomingCycles,
          lastFuel: lastFuel,
          gameUid: Number(_buildings.result[i]),
          decay: Number(
            _buildings.result[i + 1] === 1 ? Number(_cabinDecay.result[0]) : 0
          ),
        };
        if (id > lastUID) lastUID = id;
      }
      console.log("playerBuildings", playerBuildings);
    } else {
      playerBuildings[1] = {
        activeCycles: 0,
        decay: Number(_cabinDecay.result[0]),
        gameUid: 1,
        incomingCycles: 0,
        lastFuel: 0,
        posX: 20,
        posY: 8,
        type: 1,
      };
      lastUID = 1;
    }

    const { incomingInventory, inactive, active, nbBlocksClaimable } =
      initCounters(playerBuildings, fillStaticBuildings(allBuildings));

    counters["uid" as any] = lastUID;
    counters["incomingInventory" as any] = incomingInventory;
    counters["inactive" as any] = inactive;
    counters["active" as any] = active;
    counters["blockClaimable" as any] = nbBlocksClaimable;

    console.log("counters", counters);

    let _inventory = await wallet.account.callContract({
      contractAddress: frenslandsContract.address,
      entrypoint: "get_balance_all",
      calldata: [number.toFelt(landId)],
    });

    let _pop = await wallet.account.callContract({
      contractAddress: frenslandsContract.address,
      entrypoint: "get_pop",
      calldata: [number.toFelt(landId)],
    });

    // build inventory and update
    _inventory.result.splice(0, 1);
    for (let i = 0; i < 7; i++) {
      inventory[i] = Number(_inventory.result[i]);
    }
    inventory[8] = Number(_pop.result[2]);
    inventory[9] = Number(_pop.result[1]);
    inventory[10] = 0;
    inventory[11] = calculatePlayerLevel(playerBuildings, counters);
    console.log("inventory", inventory);

    return { _mapComp, counters, playerBuildings, inventory };
  };

  useEffect(() => {
    if (!wallet && !isInit && landId) {
      const _wallet = getStarknet();
      _wallet.enable().then((data: any) => {
        if (_wallet.isConnected) {
          initPlayer(_wallet);
          initGameSession(landId);

          if (wasInit) {
            getMap(_wallet, landId).then((res) => {
              updateMapBlock(res._mapComp);
              updateCounters(res.counters);
              updatePlayerBuildings(res.playerBuildings);
              updateInventory(res.inventory);
            });
          } else {
            let { _inventory, _fullMap, _buildings, _counters } =
              neverInit(_wallet);
            updateMapBlock(_fullMap);
            updateCounters(_counters);
            updatePlayerBuildings(_buildings);
            updateInventory(_inventory);
            addAction({
              entrypoint: "start_game",
              calldata: landId + "|0",
              status: "",
              txHash: "",
              validated: false,
            });
          }
          const settings = JSON.parse(
            localStorage.getItem("settings") as string
          );
          console.log("settings", settings);
          initSettings({
            zoom: settings.zoom === undefined ? true : settings.zoom,
            tutorial:
              settings.tutorial === undefined ? true : settings.tutorial,
            sound: settings.sound === undefined ? true : settings.sound,
          });
          setIsInit(true);
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
      {inventory && fullMapValue && fullMapValue.length > 0 ? (
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
