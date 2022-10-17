import React, { useState } from "react";
import { destroyAction, repairAction } from "../../../api/player";
import { useGameContext } from "../../../hooks/useGameContext";
import { useNewGameContext } from "../../../hooks/useNewGameContext";
import { useSelectContext } from "../../../hooks/useSelectContext";
import { checkResRepairMsg, destroyBuilding_, repairBuildingPay } from "../../../utils/building";
import { ComposeD } from "../../../utils/land";
import { FrameItem } from "../FrameItem";

export function BF_upgrade(props: any) {
  const {
    uid,
    typeId,
    state,
    posX,
    posY,
    _canRepair,
    decay,
    _msg,
    staticBuildingsData,
  } = props;

  const {
    updateInventory,
    addAction,
    inventory,
    wallet,
    playerBuilding,
    updatePlayerBuilding,
    player,
    fullMap,
    updateMapBlock
  } = useNewGameContext();
  const { updateBuildingFrame } = useSelectContext();
  const { tokenId } = useGameContext();
  const [showNotif, setShowNotif] = useState(false);

  //   Function to upgrade building
  const upgradeBuilding = async (
    _typeId: number,
    _posX: number,
    _posY: number,
    _state: number
  ) => {
    const _check = checkResRepairMsg(
      _typeId - 1,
      inventory,
      staticBuildingsData
    );
    if (_check && tokenId) {
      const _inventory = repairBuildingPay(
        _typeId - 1,
        inventory,
        staticBuildingsData
      );
      updateInventory(_inventory);

      // Store on-chain action in context
      const calldata = tokenId + "|" + 0 + "|" + _posX + "|" + _posY;
      const entrypoint = "repair_building";
      addAction(entrypoint, calldata);

      // ? repair timer has passed
      // receive resources after upgrade
      _inventory[9] += staticBuildingsData[_typeId - 1].repairCost[9];
      updateInventory(_inventory);

      const _idx = playerBuilding.findIndex((obj) => obj.gameUid == uid);
      playerBuilding[_idx].decay = 0;
      updatePlayerBuilding(playerBuilding);

      updateBuildingFrame(false, {
        infraType: 0,
        type_id: 0,
        state: 0,
        posX: 0,
        posY: 0,
        selected: 0,
      });

      // ? send request to db
      let _action = await repairAction(
        player,
        entrypoint,
        calldata,
        inventory,
        playerBuilding[_idx].gameUid
      );
    } else {
      console.log("Cannot repair or missing tokenId");
    }
  };

  const destroyBuilding = (_typeId: number, _posX: number, _posY: number) => {
    if (tokenId) {
      console.log("inventory before destroy", inventory);
      let _inventory = destroyBuilding_(
        _typeId - 1,
        inventory,
        staticBuildingsData
      );
      console.log("inventory after destroy", _inventory);
      updateInventory(_inventory);

      // update buildings array
      console.log("playerBuilding before", playerBuilding);
      var _newPlayerB = playerBuilding.filter(
        (item: any) => item.gameUid !== uid
      );
      console.log("_newPlayerB before", playerBuilding);
      updatePlayerBuilding(_newPlayerB);

      // Update map block
      const _map = fullMap;
      _map[_posY][_posX].state = 0;
      _map[_posY][_posX].infraType = 0;
      _map[_posY][_posX].type = 0;
      _map[_posY][_posX].id = 0;
      updateMapBlock(_map);

      // Update action in context
      const entrypoint = "destroy_building";
      const calldata = tokenId + "|" + 0 + "|" + _posX + "|" + _posY;
      addAction(entrypoint, calldata);

      // ? Send request DB
      const _mapComposed = ComposeD(_map);
      let _destroy = destroyAction(
        player,
        entrypoint,
        calldata,
        inventory,
        uid,
        _mapComposed
      );

      updateBuildingFrame(false, {
        infraType: 0,
        type_id: 0,
        state: 0,
        posX: 0,
        posY: 0,
        selected: 0,
      });
    } else {
      console.log("Missing tokenId");
    }
  };

  const moveBuilding = (_typeId: number, _posX: number, _posY: number) => {
    console.log('moving building', _typeId);
    if (tokenId) {
    }
  }

  return (
    <>
      <div id="bFrame" className="selectDisable absolute buildingFrame">

        {staticBuildingsData[typeId - 1].canDestroy ?
        <div
          className="btnDestroy absolute"
          onClick={() => destroyBuilding(typeId as number, posX, posY)}
          style={{ right: "135px", bottom: "212px" }}
        ></div>
      : <></>}

        {staticBuildingsData[typeId - 1].canMove ?
        <div
          className="btnMove absolute"
          onClick={() => moveBuilding(typeId as number, posX, posY)}
          style={{ right: "185px", bottom: "210px" }}
        ></div>
        : <></>}

        {/* //* btn close frame */}
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
            })
          }
        ></div>

        {/* // * #1 line */}
        <div
          className="grid grid-cols-2 inline-block"
          style={{ height: "20px", pointerEvents: "all" }}
        >
          <div
            className="font8BITWonder uppercase text-center"
            style={{ height: "20px" }}
          >
            {/* Building name */}
            {staticBuildingsData[typeId - 1].name}
          </div>
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ paddingLeft: "8px" }}
          >
            {/* Population Required to build */}
            {decay == 100 &&
            staticBuildingsData[typeId - 1].repairCost[8] > 0 ? (
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: "absolute", top: "-9px", left: "100px" }}
                >
                  {staticBuildingsData[typeId - 1].createCost[8]}
                </div>
                <div
                  className={"mb-3 small12"}
                  style={{
                    position: "absolute",
                    top: "-34px",
                    left: "105px",
                  }}
                ></div>
              </div>
            ) : (
              ""
            )}
            {/* Pop additional after building */}
            {decay == 100 &&
            staticBuildingsData[typeId - 1].repairCost[9] > 0 ? (
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: "absolute", top: "-9px", left: "46px" }}
                >
                  +{staticBuildingsData[typeId - 1].repairCost[9]}
                </div>
                <div
                  className={"mb-3 small12"}
                  style={{ position: "absolute", top: "-34px", left: "45px" }}
                ></div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {/*  // * #2nd line */}
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "85px", pointerEvents: "all" }}
        >
          <div className="flex flex-row justify-center inline-block relative">
            <div
              className="font04B text-center mx-auto relative"
              style={{ width: "68px" }}
            >
              {/* Building miniature image */}
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
              style={{ fontSize: "12px", paddingTop: "34px", width: "85px" }}
            >
              {/* building type  */}
              {staticBuildingsData[typeId - 1].type}
            </div>
            <div
              className="font04B mx-auto text-center"
              style={{ fontSize: "12px", paddingTop: "34px", width: "67px" }}
            >
              {/* building level  */}1
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{ fontSize: "12px", paddingTop: "34px", width: "65px" }}
            >
              {/* building size */}1 x 1
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{ fontSize: "12px", paddingTop: "34px", width: "64px" }}
            >
              {posX + " " + posY}
            </div>
          </div>
        </div>

        {/*  // * building description */}
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

        {/* // * btn repair + cost of repairing  */}
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "45px", paddingTop: "8px", pointerEvents: "all" }}
        >
          <div className="flex flex-row justify-center inline-block">
            <div style={{ width: "135px", paddingTop: "10px" }}>
              {/*  // * Can repair building  */}
              {_canRepair == 1 && decay == 100 ? (
                <>
                  <div
                    className="btnUpgrade"
                    onClick={() =>
                      upgradeBuilding(
                        typeId as number,
                        posX,
                        posY,
                        state as number
                      )
                    }
                  ></div>
                </>
              ) : (
                _canRepair == 0 &&
                decay == 100 && (
                  <>
                    <div
                      className="btnUpgradeRed"
                      onMouseOver={() => setShowNotif(true)}
                      onMouseOut={() => setShowNotif(false)}
                    ></div>
                    {showNotif && (
                      <div className="popUpBuild fontHPxl-sm pixelated">
                        {_msg}
                      </div>
                    )}
                  </>
                )
              )}
            </div>
            {/* Cost of repairing  */}
            <div
              className="relative flex justify-end items-center inline-block"
              style={{
                width: "201px",
                height: "80px",
                paddingTop: "10px",
              }}
            >
              {decay == 100 &&
                Object.keys(staticBuildingsData[typeId - 1].repairCost).map(
                  (elem: any) => {
                    return (
                      elem < 7 &&
                      staticBuildingsData[typeId - 1].repairCost[elem] > 0 && (
                        <FrameItem
                          key={elem}
                          index={elem}
                          cost={
                            staticBuildingsData[typeId - 1].repairCost[elem]
                          }
                          inventory={inventory[elem]}
                          option={1}
                        />
                      )
                    );
                  }
                )}
            </div>
          </div>
        </div>

        {/* // * Maintain costs  */}
        <div className="grid grid-cols-2 l1noR">
          <div
            className="relative flex justify-end items-center inline-block"
            style={{ width: "115px", marginTop: "-21px" }}
          >
            {Object.keys(staticBuildingsData[typeId - 1].maintainCost).map(
              (elem: any) => {
                return (
                  elem < 7 &&
                  staticBuildingsData[typeId - 1].maintainCost[elem] > 0 && (
                    <FrameItem
                      key={elem}
                      index={elem}
                      cost={staticBuildingsData[typeId - 1].maintainCost[elem]}
                      inventory={inventory[elem]}
                      option={1}
                    />
                  )
                );
              }
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 l2noR">
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
                      key={elem}
                      index={elem}
                      cost={staticBuildingsData[typeId - 1].production[elem]}
                      option={0}
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
