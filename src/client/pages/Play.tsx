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
  composeFromIndexer,
  initMapArr,
} from "../utils/land";
import { allBuildings } from "../data/buildings";
import { fillStaticBuildings } from "../utils/static";
import { initCounters } from "../utils/building";
import { useLazyQuery, useQuery } from "@apollo/client";
import UI_Frames from "../style/resources/front/Ui_Frames3.svg";
import { BUILDINGS_QUERY, MAP_QUERY, RESET_QUERY } from "../api/queries";

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
    transactions,
    updateActions,
    addAction,
  } = useNewGameContext();
  const { initSettings } = useSelectContext();
  const { state } = useLocation();
  const { landId, wasInit } = state;
  const navigate = useNavigate();
  const [textArrRef, setTextArrRef] = useState<any[]>([]);
  const [isInit, setIsInit] = useState(false);
  const frenslandsContract = useFLContract();
  const [needReset, setNeedReset] = useState(false);
  const [isInReset, setIsInReset] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [
    getBuildings,
    { loading: loadingBuilding, data: dataBuilding, error: errorBuilding },
  ] = useLazyQuery(BUILDINGS_QUERY);
  const [getLand, { loading: loadingLand, data: dataLand, error: errorLand }] =
    useLazyQuery(MAP_QUERY);

  const {
    loading,
    error,
    data: resetData,
  } = useQuery(RESET_QUERY, {
    variables: {
      landId: ("0x" + landId.toString(16).padStart(64, "0")) as HexValue,
      limit: 50,
      skip: 0,
    },
    pollInterval: 500,
  });

  const fullMapValue = useMemo(() => {
    return fullMap;
  }, [fullMap]);

  const checkResets = () => {
    let _needReset = true;
    console.log("resetData fetched", resetData);
    if (typeof resetData !== "undefined" && resetData.reset.length === 0)
      return false;
    typeof resetData !== "undefined" &&
      resetData.reset.length > 0 &&
      resetData.reset.forEach((ev: any) => {
        const desiredTime = new Date("2022-12-26 15:00:00");
        const date = new Date(ev.timestamp);
        if (date > desiredTime) _needReset = false;
      });
    console.log("needReset", _needReset);
    return _needReset;
  };

  useEffect(() => {
    if (loading === false) setHasLoaded(true);
  });

  useEffect(() => {
    if (needReset && isInReset && transactions.length > 0) {
      const _check = checkResets();
      if (!_check) {
        setIsInReset(false);
        setNeedReset(false);
        navigate("/play");
      }
    }
  }, [needReset, isInReset, transactions, resetData]);

  const neverInit = (_wallet: any) => {
    const _inventory = [];
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

    const _fullMap = initMapArr(_wallet.account.address);

    const _buildings: any[] = [];
    _buildings[1] = [];
    _buildings[1].activeCycles = 0;
    _buildings[1].decay = 100;
    _buildings[1].gameUid = 1;
    _buildings[1].incomingCycles = 0;
    _buildings[1].lastFuel = 0;
    _buildings[1].posX = 20;
    _buildings[1].posY = 8;
    _buildings[1].type = 1;

    const _counters = [];
    _counters["uid" as any] = 1;
    _counters["incomingInventory" as any] = [];
    _counters["inactive" as any] = 0;
    _counters["active" as any] = 0;
    _counters["blockClaimable" as any] = 0;
    _counters[1] = [];
    _counters[2] = [];

    return { _inventory, _fullMap, _buildings, _counters };
  };

  const fetchLandInfo = async (wallet: any, landId: number) => {
    const mapFetched = await getLand({
      variables: {
        landId: ("0x" + landId.toString(16).padStart(64, "0")) as HexValue,
      },
    });
    const { res: _mapComp, counters } = composeFromIndexer(
      mapFetched.data.getLand[0].map,
      wallet.account.address
    );
    console.log("map fetched", _mapComp);

    // Fetch buildings state from indexed on-chain data
    let skip = 0;
    const limit = 10;
    let needFetch = true;
    const playerBuildingsFetched: any = [];
    while (needFetch) {
      const fetchBuilding = await getBuildings({
        variables: {
          landId: ("0x" + landId.toString(16).padStart(64, "0")) as HexValue,
          skip,
          limit,
        },
      });
      playerBuildingsFetched.push(...fetchBuilding.data.getBuildingsState);
      if (fetchBuilding.data.getBuildingsState.length < limit) {
        needFetch = false;
      } else {
        skip += limit;
      }
    }

    const playerBuildings: any = [];
    let lastUID = 0;
    const blockNb = await wallet.account.getBlock();
    playerBuildingsFetched &&
      playerBuildingsFetched.length > 0 &&
      playerBuildingsFetched.map(async (building: any) => {
        const id = Number(building.buildingUid);
        let activeCycles = Number(building.activeCycles);
        let incomingCycles = Number(building.incomingCycles);
        const lastFuel = Number(building.lastFuel);
        if (incomingCycles > 0) {
          if (lastFuel + incomingCycles < blockNb.block_number) {
            activeCycles += incomingCycles;
            incomingCycles = 0;
          } else {
            const fuelPassed = blockNb.block_number - lastFuel;
            activeCycles += fuelPassed;
            incomingCycles -= fuelPassed;
          }
        }

        playerBuildings[id] = {
          type: Number(building.buildingTypeId),
          posX: Number(building.posX),
          posY: Number(building.posY),
          activeCycles,
          incomingCycles,
          lastFuel,
          gameUid: id,
          decay: Number(building?.decay),
        };
        if (id > lastUID) lastUID = id;
      });
    console.log("from indexer buildings", playerBuildings);

    const { incomingInventory, inactive, active, nbBlocksClaimable } =
      initCounters(playerBuildings, fillStaticBuildings(allBuildings));

    counters["uid" as any] = lastUID;
    counters["incomingInventory" as any] = incomingInventory;
    counters["inactive" as any] = inactive;
    counters["active" as any] = active;
    counters["blockClaimable" as any] = nbBlocksClaimable;

    console.log("counters", counters);

    const _inventory = await wallet.account.callContract({
      contractAddress: frenslandsContract.address,
      entrypoint: "get_balance_all",
      calldata: [number.toFelt(landId)],
    });

    const _pop = await wallet.account.callContract({
      contractAddress: frenslandsContract.address,
      entrypoint: "get_pop",
      calldata: [number.toFelt(landId)],
    });

    // build inventory and update
    _inventory.result.splice(0, 1);
    for (let i = 0; i < 7; i++) {
      inventory[i] = Number(_inventory.result[i]);
    }
    inventory[7] = 0;
    inventory[8] = Number(_pop.result[2]);
    inventory[9] = Number(_pop.result[1]);
    inventory[10] = 0;
    inventory[11] = calculatePlayerLevel(playerBuildings, counters);
    console.log("inventory", inventory);

    return { _mapComp, counters, playerBuildings, inventory };
  };

  useEffect(() => {
    if (!wallet && !isInit && landId && hasLoaded) {
      const _wallet = getStarknet();
      _wallet.enable().then((data: any) => {
        if (_wallet.isConnected) {
          initPlayer(_wallet);
          initGameSession(landId);

          // Check if land was Reset before fixing contract bug
          let res = checkResets();
          if (!res) {
            setNeedReset(false);
            if (wasInit) {
              fetchLandInfo(_wallet, landId).then((res) => {
                updateMapBlock(res._mapComp);
                updateCounters(res.counters);
                updatePlayerBuildings(res.playerBuildings);
                updateInventory(res.inventory);
                setIsInit(true);
              });
            } else {
              const { _inventory, _fullMap, _buildings, _counters } =
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
              setIsInit(true);
            }
          } else {
            setNeedReset(true);
          }
          const settings = JSON.parse(
            localStorage.getItem("settings") as string
          );
          console.log("settings", settings);
          initSettings({
            zoom:
              settings &&
              typeof settings === "object" &&
              typeof settings.zoom !== "undefined"
                ? settings.zoom
                : true,
            tutorial:
              settings &&
              typeof settings === "object" &&
              typeof settings.tutorial !== "undefined"
                ? settings.tutorial
                : true,
            sound: true,
          });
        } else {
          navigate("/");
        }
      });
    }
  }, [wallet, landId, dataBuilding, dataLand, loading, hasLoaded]);

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

  const sendResetTx = async () => {
    wallet.account
      .execute({
        contractAddress: frenslandsContract.address.toLowerCase(),
        entrypoint: "reinit_game",
        calldata: [number.toFelt(landId), 0],
      })
      .then((response: any) => {
        response.show = true;
        response.entrypoint = "reinit_game";
        transactions.push(response);

        payloadActions.push({
          entrypoint: "reinit_game",
          calldata: landId + "|0",
          status: response.code,
          txHash: response.transaction_hash,
        });
        updateActions(payloadActions);

        // Update in localStorage
        let ongoingTx = JSON.parse(localStorage.getItem("ongoingTx") as string);
        if (!ongoingTx) ongoingTx = [];
        ongoingTx.push({
          ...response,
          time: Date.now(),
        });
        localStorage.setItem("ongoingTx", JSON.stringify(ongoingTx));
        setIsInReset(true);
      });
  };

  if (loading) return <p>Loading...</p>;

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
      {needReset && (
        <div
          className="flex justify-center selectDisable absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="parentNotifBug">
            <div
              className="popUpNotifsTxCart pixelated fontHPxl-sm"
              style={{
                zIndex: 1,
                borderImage: `url(data:image/svg+xml;base64,${btoa(
                  UI_Frames
                )}) 18 fill stretch`,
                textAlign: "center",
              }}
            >
              <p>
                We had to update the contracts to fix a bug. Please reset your
                land to continue playing. This action will reset the state of
                your land.
              </p>

              <br />
              {needReset && !isInReset && (
                <div style={{ overflowY: "auto", height: "310px" }}>
                  <div
                    className="btnCustom pixelated relative"
                    onClick={async () => await sendResetTx()}
                  >
                    <p
                      className="relative fontHpxl_JuicyXL"
                      style={{ marginTop: "47px" }}
                    >
                      Send TX
                    </p>
                  </div>
                </div>
              )}
              {needReset && isInReset && (
                <p>
                  Transaction ongoing...
                  <br />
                  You'll be redirected to the game once the transaction is
                  accepted.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
