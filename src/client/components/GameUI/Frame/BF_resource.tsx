import React, { useState } from "react";
import { useGameContext } from "../../../hooks/useGameContext";
import { useNewGameContext } from "../../../hooks/useNewGameContext";
import { useSelectContext } from "../../../hooks/useSelectContext";
import {
  checkResHarvest,
  harvestResPay,
  receiveResHarvest,
} from "../../../utils/building";
import { FrameItem } from "../FrameItem";

export function BF_resource(props: any) {
  const {
    uid,
    typeId,
    state,
    posX,
    posY,
    _canHarvest,
    _msg,
    staticResourcesData,
  } = props;

  //   Contexts
  const { updateBuildingFrame } = useSelectContext();
  const {
    harvestActions,
    executeHarvest,
    updateInventory,
    updateHarvestActions,
    updateMapBlock,
    fullMap,
    addAction,
    payloadActions,
    inventory,
    wallet,
  } = useNewGameContext();
  const { tokenId, buildingData } = useGameContext();
  const [showNotif, setShowNotif] = useState(false);

  const storeAction = async (entrypoint: string, calldata: string) => {
    fetch("http://localhost:3001/api/player_action", {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("user") as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: wallet.account.address,
        action: {
          entrypoint: entrypoint,
          calldata: calldata,
        },
      }),
    })
      .then(async (response) => {
        return await response.json();
      })
      .then((data) => {
        console.log("action was stored in DB successfully", data);
      });
  };

  // TODO translated fullMap into string
  const harvestAction = (entrypoint: string, calldata: string) => {
    fetch("http://localhost:3001/api/users/harvest", {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("user") as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: wallet.account.address,
        action: {
          entrypoint: entrypoint,
          calldata: calldata,
        },
        inventory: inventory,
      }),
    })
      .then(async (response) => {
        return await response.json();
      })
      .then((data) => {
        console.log("action was stored in DB successfully", data);
      });
  };

  const harvestingResources = async (
    _typeId: number,
    _posX: number,
    _posY: number,
    _state: number
  ) => {
    const _check = checkResHarvest(_typeId - 1, inventory, staticResourcesData);
    if (_check && tokenId) {
      const _inventory = harvestResPay(
        _typeId - 1,
        inventory,
        staticResourcesData
      );
      updateInventory(_inventory);
      updateHarvestActions(_posX, _posY, uid, Date.now(), 0);
      // // executeHarvest(_posX, _posY, _state, 0, _inventory);

      // Store on-chain action in context
      const calldata = tokenId + "|" + 0 + "|" + _posX + "|" + _posY;
      const entrypoint = "harvest";
      addAction(entrypoint, calldata);

      // ? harvest timer has passed
      const _inventoryUpdated = receiveResHarvest(
        _typeId - 1,
        inventory,
        staticResourcesData
      );
      updateInventory(_inventoryUpdated);
      updateHarvestActions(_posX, _posY, uid, Date.now(), 1);

      // Update map block
      const _map = fullMap;
      if (_state == 3) {
        _map[_posY][_posX].state = 0;
        _map[_posY][_posX].infraType = 0;
        _map[_posY][_posX].type = 0;
        _map[_posY][_posX].id = 0;
      } else {
        _map[_posY][_posX].state++;
      }
      updateMapBlock(_map);
      // executeHarvest(_posX, _posY, _state + 1, 1, _inventoryUpdated);

      // ? Request : update inventory, update fullMap array, update nb harvest

      // TODO add action
      // Store action in DB : storeAction(entrypoint, calldata);
      // Update inventory
      // update fullMap array
      // update nb of harvest
      const _isHarvested = await harvestAction(entrypoint, calldata);
      console.log("_isHarvested", _isHarvested);

      // case tree has been harvested three times
    } else {
      console.log("cannot harvest or missing tokenId");
    }

    //     // const tx_hash = harvestingInvoke(
    //     //   tokenId,
    //     //   pos_start,
    //     //   parseInt(frameData?.unique_id as string),
    //     //   type_id,
    //     //   level,
    //     //   pos_x,
    //     //   pos_y,
    //     //   nonceValue
    //     // );

    //     // tx_hash.then((res) => {
    //     //   console.log("res", res);
    //     //   if (res != 0) {
    //     //     updateNonce(nonceValue);
    //     //     // Change status of harvesting to 0
    //     //     setHarvesting(pos_x, pos_y, 0);
    //     //   }
    //     // });
  };

  return (
    <>
      <div id="bFrame" className="selectDisable absolute harvestFrame">
        {/* Btn close frame */}
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

        <div
          className="grid grid-cols-2 inline-block"
          style={{ height: "20px", pointerEvents: "all" }}
        >
          <div
            className="font8BITWonder uppercase text-center"
            style={{ height: "20px" }}
          >
            {/* // * Resource name */}
            {staticResourcesData[typeId - 1].name}
          </div>
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ paddingLeft: "8px" }}
          >
            {/* // * Population Required to harvest */}
            {staticResourcesData[typeId - 1].harvestCost[8] > 0 ? (
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: "absolute", top: "-9px", left: "46px" }}
                >
                  {staticResourcesData[typeId - 1].harvestCost[8]}
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

        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "85px", pointerEvents: "all" }}
        >
          <div className="flex flex-row justify-center inline-block relative">
            <div
              className="font04B text-center mx-auto relative"
              style={{ width: "68px" }}
            >
              {/* Resource miniature image */}
              <div
                className={"resource" + `${typeId}`}
                style={{ left: "-26px", top: "-39px", position: "absolute" }}
              ></div>
            </div>
            <div
              className="font04B text-center mx-auto"
              style={{ fontSize: "12px", paddingTop: "34px", width: "85px" }}
            >
              {/* resource name  */}
              {staticResourcesData[typeId - 1].type}
            </div>
            <div
              className="font04B mx-auto text-center"
              style={{ fontSize: "12px", paddingTop: "34px", width: "67px" }}
            >
              {/* resource level  */}
              {state}
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{ fontSize: "12px", paddingTop: "34px", width: "65px" }}
            >
              {/* resource size */}1 x 1
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{ fontSize: "12px", paddingTop: "34px", width: "64px" }}
            >
              {/* resource position  */}
              {posX + " " + posY}
            </div>
          </div>
        </div>

        {/* Resource description */}
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
          {staticResourcesData[typeId - 1].description}
        </div>

        {/* // * Btn Harvest enabled / disabled  */}
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "45px", paddingTop: "8px", pointerEvents: "all" }}
        >
          <div className="flex flex-row justify-center inline-block">
            <div style={{ width: "135px", paddingTop: "10px" }}>
              <>
                {
                  // TODO comparer avec tableau en cours de harvest
                  // (harvestingArrValue &&
                  //   harvestingArrValue.length > 0 &&
                  //   harvestingArr[frameData.posY] &&
                  //   harvestingArr[frameData.posY][frameData.posX] == 0) ||
                  !_canHarvest ? (
                    <>
                      <div
                        className="btnHarvestDisabled"
                        onMouseOver={() => setShowNotif(true)}
                        onMouseOut={() => setShowNotif(false)}
                      ></div>
                      {showNotif && !_canHarvest && (
                        <div className="popUpBuild fontHPxl-sm pixelated">
                          {_msg}
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      className="btnHarvest"
                      onClick={() =>
                        harvestingResources(
                          typeId as number,
                          posX,
                          posY,
                          state as number
                        )
                      }
                    ></div>
                  )
                }
              </>
            </div>
          </div>
        </div>
        {/* Cost of harvesting a resource spawned */}
        <div className="grid grid-cols-2 l1noR">
          <div
            className="relative flex justify-end items-center inline-block"
            style={{ width: "115px", marginTop: "-21px" }}
          >
            {Object.keys(staticResourcesData[typeId - 1].harvestCost).map(
              (elem: any) => {
                return (
                  elem < 7 &&
                  staticResourcesData[typeId - 1].harvestCost[elem] > 0 && (
                    <FrameItem
                      key={elem}
                      index={elem}
                      cost={staticResourcesData[typeId - 1].harvestCost[elem]}
                      inventory={inventory[elem]}
                      option={1}
                    />
                  )
                );
              }
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 l2H">
          {/* // * Production */}
          <div
            className="relative flex justify-end items-center inline-block"
            style={{ width: "122px", marginTop: "-22px" }}
          >
            {Object.keys(staticResourcesData[typeId - 1].production).map(
              (elem: any) => {
                return (
                  elem < 7 &&
                  typeId &&
                  staticResourcesData[typeId - 1].production[elem] > 0 && (
                    <FrameItem
                      key={elem}
                      index={elem}
                      cost={staticResourcesData[typeId - 1].production[elem]}
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
