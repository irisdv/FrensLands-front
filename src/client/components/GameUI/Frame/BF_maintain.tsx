import React, { useEffect, useMemo, useState } from "react";
import { destroyAction, fuelProdQuery } from "../../../api/player";
import { useNewGameContext } from "../../../hooks/useNewGameContext";
import { useSelectContext } from "../../../hooks/useSelectContext";
import {
  checkResMaintainMsg,
  destroyBuilding_,
  maintainBuildingPay,
  maintainMax,
} from "../../../utils/building";
import { ComposeD } from "../../../utils/land";
import { buildErrorMsg } from "../../../utils/utils";
import { FrameItem } from "../FrameItem";

export function BF_maintain(props: any) {
  const { uid, typeId, state, posX, posY, staticBuildingsData, inventory } =
    props;
  const { updateBuildingFrame } = useSelectContext();
  const {
    updateInventory,
    fullMap,
    addAction,
    updateMapBlock,
    player,
    playerBuilding,
    updatePlayerBuildings,
    payloadActions,
  } = useNewGameContext();
  // const { tokenId } = useGameContext();

  const [inputFuel, setInputFuel] = useState(1);
  const [canMaintain, setCanMaintain] = useState(1);
  const [msg, setMsg] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [pendingCycles, setPendingCycles] = useState(0);

  useEffect(() => {
    const _canMaintain = checkResMaintainMsg(
      typeId - 1,
      inventory,
      staticBuildingsData,
      inputFuel
    );
    if (_canMaintain.length == 0) {
      setCanMaintain(1);
    } else {
      setCanMaintain(0);
      let _msg = "";
      _msg = buildErrorMsg(_canMaintain, "fuel prod");
      setMsg(_msg);
    }
  }, [])

  const pendingRecharges = useMemo(() => {
    console.log("uid", uid);
    console.log("in use memo pending recharges", payloadActions);
    if (payloadActions && payloadActions.length > 0) {
      const actions = payloadActions.filter((action: any) => {
        return (
          action.entrypoint == "fuel_building_production" &&
          action.calldata.split("|")[2] == posX &&
          action.calldata.split("|")[3] == posY
        );
      });
      console.log("actions filtered", actions);
      if (actions && actions.length > 0) {
        let _pendingCycles = 0;
        actions.map((action: any) => {
          _pendingCycles += parseInt(action.calldata.split("|")[4]);
        });
        setPendingCycles(_pendingCycles);
        console.log("_pendingCycles", _pendingCycles);
      } else {
        setPendingCycles(0);
      }
    }
  }, [payloadActions, uid]);

  const destroyBuilding = async (
    _typeId: number,
    _posX: number,
    _posY: number
  ) => {
    if (player.tokenId) {
      console.log("inventory before destroy", inventory);
      const _inventory = destroyBuilding_(
        _typeId - 1,
        inventory,
        staticBuildingsData
      );
      console.log("inventory after destroy", _inventory);
      updateInventory(_inventory);

      // update buildings array
      console.log("playerBuilding before", playerBuilding);
      const _newPlayerB = playerBuilding.filter(
        (item: any) => item.gameUid !== uid
      );
      console.log("_newPlayerB before", playerBuilding);
      updatePlayerBuildings(_newPlayerB);

      // Update map block
      const _map = fullMap;
      _map[_posY][_posX].state = 0;
      _map[_posY][_posX].infraType = 0;
      _map[_posY][_posX].type = 0;
      _map[_posY][_posX].id = 0;
      updateMapBlock(_map);

      // Send request DB
      const _mapComposed = ComposeD(_map);
      const _destroy = await destroyAction(
        player,
        "destroy_building",
        player.tokenId + "|" + 0 + "|" + _posX + "|" + _posY,
        inventory,
        uid,
        _mapComposed
      );
      // update action in context
      addAction(_destroy[0]);

      updateBuildingFrame(false, {
        infraType: 0,
        type_id: 0,
        state: 0,
        posX: 0,
        posY: 0,
        selected: 0,
        moved: 0,
      });
    } else {
      console.log("Missing tokenId");
    }
  };

  const moveBuilding = (_typeId: number, _posX: number, _posY: number) => {
    console.log("moving building", _typeId);
    if (player.tokenId) {
      updateBuildingFrame(false, {
        infraType: 2,
        typeId: _typeId,
        unique_id: uid,
        state: 1,
        posX: _posX,
        posY: _posY,
        selected: 1,
        moved: 1,
      });
    }
  };

  const fuelProd = async (
    cycles: number,
    type_id: number,
    pos_x: number,
    pos_y: number,
    uniqueId: number
  ) => {
    const _canMaintain = checkResMaintainMsg(
      typeId - 1,
      inventory,
      staticBuildingsData,
      inputFuel
    );
    if (_canMaintain.length == 0 && player.tokenId) {
      setCanMaintain(1);
      const _inventory = maintainBuildingPay(
        type_id - 1,
        inventory,
        staticBuildingsData,
        cycles
      );
      updateInventory(_inventory);
      console.log("inventory updated", _inventory);

      const calldata =
        player.tokenId + "|0|" + pos_x + "|" + pos_y + "|" + cycles;

      const _action = await fuelProdQuery(
        player,
        _inventory,
        "fuel_building_production",
        calldata
      );
      console.log("action", _action[0]);
      addAction(_action[0]);
      setPendingCycles(pendingCycles + cycles);
    } else {
      setCanMaintain(0);
      let _msg = "";
      _msg = buildErrorMsg(_canMaintain, "fuel prod");
      setMsg(_msg);
    }
  };

  const updateInputFuel = () => {
    let _msg = "";
    let fuel = 1;

    if (inputFuel == 1) {
      fuel = 10;
    } else if (inputFuel == 10) {
      fuel = 100;
    } else if (inputFuel == 100) {
      const _max = maintainMax(typeId - 1, inventory, staticBuildingsData);
      fuel = _max as number;
    }

    setInputFuel(fuel);
    const _canMaintain = checkResMaintainMsg(
      typeId - 1,
      inventory,
      staticBuildingsData,
      fuel
    );
    if (_canMaintain.length > 0) {
      setCanMaintain(0);
      _msg = buildErrorMsg(_canMaintain, "fuel prod");
    } else {
      setCanMaintain(1);
    }
    setMsg(_msg);
  };

  return (
    <>
      <div
        id="bFrame"
        className="selectDisable absolute buildingFrameRecharged"
      >
        <div
          className="btnDestroy absolute"
          onClick={async () =>
            await destroyBuilding(typeId as number, posX, posY)
          }
          style={{ right: "135px", bottom: "280px" }}
        ></div>

        <div
          className="btnMove absolute"
          onClick={() => moveBuilding(typeId as number, posX, posY)}
          style={{ right: "185px", bottom: "278px" }}
        ></div>

        <div
          className="btnCloseFrame"
          onClick={() =>
            updateBuildingFrame(false, {
              infraType: 0,
              type_id: 0,
              state: 0,
              posX: 0,
              posY: 0,
              selected: 0,
              moved: 0,
            })
          }
        ></div>

        {/* Ligne 1 */}
        <div
          className="grid grid-cols-2 inline-block"
          style={{ height: "20px", pointerEvents: "all" }}
        >
          <div
            className="font8BITWonder uppercase text-center"
            style={{ height: "20px" }}
          >
            {staticBuildingsData[typeId - 1].name}
          </div>
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ paddingLeft: "8px" }}
          >
            {/* Pop min needed  */}
            {staticBuildingsData[typeId - 1].createCost[8] ? (
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{
                    position: "absolute",
                    top: "-9px",
                    left: "46px",
                  }}
                >
                  {staticBuildingsData[typeId - 1].createCost[8]}
                </div>
                <div
                  className={"mb-3 small12"}
                  style={{
                    position: "absolute",
                    top: "-34px",
                    left: "45px",
                  }}
                ></div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Ligne 2 */}
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "85px", pointerEvents: "all" }}
        >
          <div className="flex flex-row justify-center inline-block relative">
            <div
              className="font04B text-center mx-auto relative"
              style={{ width: "68px" }}
            >
              <div
                className={"building" + `${typeId}`}
                style={{
                  left: "-26px",
                  top: "-39px",
                  position: "absolute",
                }}
              ></div>
            </div>
            <div
              className="font04B text-center mx-auto"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "85px",
              }}
            >
              {staticBuildingsData[typeId - 1].type}
            </div>
            <div
              className="font04B mx-auto text-center"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "67px",
              }}
            >
              {state}
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "65px",
              }}
            >
              {/* building size */}1 x 1
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "64px",
              }}
            >
              {/* building position  */}
              {posX + " " + posY}
            </div>
          </div>
        </div>

        {/* Description */}
        <div
          className="font04B"
          style={{
            height: "109px",
            fontSize: "13px",
            paddingLeft: "9px",
            paddingTop: "6px",
            pointerEvents: "all",
          }}
        >
          {staticBuildingsData[typeId - 1].description}
        </div>

        {/* upgrade btn */}
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{
            height: "45px",
            paddingTop: "8px",
            pointerEvents: "all",
          }}
        >
          <div className="flex flex-row justify-center inline-block">
            <div style={{ width: "135px", paddingTop: "10px" }}></div>
          </div>
        </div>

        {/* Buildings production / block */}
        <div className="grid grid-cols-2 l2R">
          <div
            className="relative flex justify-end items-center inline-block"
            style={{ width: "122px", marginTop: "-22px" }}
          >
            {Object.keys(staticBuildingsData[typeId - 1].production).map(
              (elem: any) => {
                return (
                  elem < 7 &&
                  staticBuildingsData[typeId - 1].production[elem] > 0 && (
                    <FrameItem
                      key={"prod_" + elem}
                      index={elem}
                      cost={staticBuildingsData[typeId - 1].production[elem]}
                      inventory={inventory[elem]}
                      option={0}
                      inputFuel={inputFuel}
                    />
                  )
                );
              }
            )}
          </div>
        </div>

        {/* Buildings maintenance costs / block */}
        <div
          className="grid grid-cols-2"
          style={{
            height: "28px",
            marginTop: "-10px",
            marginLeft: "190px",
          }}
        >
          <div
            className="relative flex jutify-center items-center inline-block fontHPxl"
            style={{
              width: "100px",
              paddingTop: "7px",
              fontSize: "19px",
            }}
          >
            {playerBuilding &&
            playerBuilding[uid] &&
            playerBuilding[uid].activeCycles &&
            playerBuilding[uid].activeCycles > 0
              ? playerBuilding[uid].activeCycles
              : 0}
            <span className="fontRed">({pendingCycles})</span>
          </div>
        </div>

        <div
          className="grid grid-cols-2"
          style={{ height: "55px", marginLeft: "0px", pointerEvents: "all" }}
        >
          <div>
            {canMaintain ? (
              <div
                className="btnFuelProd pixelated"
                onClick={async () =>
                  await fuelProd(inputFuel, typeId as number, posX, posY, uid)
                }
                style={{ marginTop: "-9px", marginLeft: "-18px" }}
              ></div>
            ) : (
              <>
                <div
                  className="btnFuelProdInactive pixelated"
                  onMouseOver={() => setShowNotif(true)}
                  onMouseOut={() => setShowNotif(false)}
                  style={{ marginTop: "-9px", marginLeft: "-18px" }}
                ></div>
                {showNotif && !canMaintain && (
                  <div className="popUpMaintenance fontHPxl-sm pixelated">
                    {msg}
                  </div>
                )}
              </>
            )}
            {inputFuel == 1 || inputFuel == 10 || inputFuel == 100 ? (
              <div
                style={{
                  height: "42px",
                  marginTop: "-23px",
                  marginLeft: "30px",
                  pointerEvents: "all",
                }}
                onClick={() => updateInputFuel()}
              >
                <div
                  className={"pixelated btnInput" + `${inputFuel}`}
                  style={{ marginTop: "-25px", pointerEvents: "none" }}
                ></div>
              </div>
            ) : (
              <div
                style={{
                  height: "42px",
                  marginTop: "-23px",
                  marginLeft: "30px",
                  pointerEvents: "all",
                }}
                onClick={() => updateInputFuel()}
              >
                <div
                  className="pixelated btnInputMax"
                  style={{ marginTop: "-25px", pointerEvents: "none" }}
                ></div>
              </div>
            )}
          </div>
          {/* :
                <>
                  <div>
                    <div className="btnStartProd pixelated" onClick={() => fuelProd(inputFuel, frameData.id as number, frameData.posX, frameData.posY, frameData.unique_id as any)} style={{marginTop: '-9px', marginLeft: '-18px'}}></div>
                    {inputFuel == 1 || inputFuel == 10 || inputFuel == 100 ?
                      <div style={{height: "42px", marginTop: '-23px', marginLeft: '30px', pointerEvents: 'all'}} onClick={() => updateInputFuel()} ><div className={"pixelated btnInput"+`${inputFuel}`} style={{marginTop: '-25px', pointerEvents: 'none'}}></div></div>
                      :
                      <div style={{height: "42px", marginTop: '-23px', marginLeft: '30px', pointerEvents: 'all'}} onClick={() => updateInputFuel()} ><div className="pixelated btnInputMax" style={{marginTop: '-25px', pointerEvents: 'none'}}></div></div>
                    }
                  </div>
                </>
              } */}
          <div
            className="relative flex justify-end items-center inline-block"
            style={{ width: "145px", marginTop: "-30px" }}
          >
            {Object.keys(staticBuildingsData[typeId - 1].maintainCost).map(
              (elem: any) => {
                return (
                  elem < 7 &&
                  staticBuildingsData[typeId - 1].maintainCost[elem] > 0 && (
                    <FrameItem
                      key={"maintain_" + elem}
                      index={elem}
                      cost={
                        staticBuildingsData[typeId - 1].maintainCost[elem] *
                        inputFuel
                      }
                      inventory={inventory[elem]}
                      option={1}
                      inputFuel={inputFuel}
                    />
                  )
                );
              }
            )}
          </div>
        </div>
      </div>
    </>
  );
}
