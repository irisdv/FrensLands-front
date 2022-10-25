import React, { useEffect, useMemo, useState } from "react";
// import { useGameContext } from "../../../hooks/useGameContext";
import { useNewGameContext } from "../../../hooks/useNewGameContext";
import { useSelectContext } from "../../../hooks/useSelectContext";
import {
  addElemToIncoming,
  checkResHarvest,
  harvestResPay,
  incomingCompose,
  receiveResHarvest,
} from "../../../utils/building";
import { FrameItem } from "../FrameItem";
import { harvestAction, updateIncomingInventories } from "../../../api/player";
import { ComposeD } from "../../../utils/land";
import { number } from "starknet";

export function BF_resource(props: any) {
  const {
    uid,
    typeId,
    randType,
    state,
    posX,
    posY,
    _canHarvest,
    _msg,
    inventory,
    staticResourcesData,
    fullMap,
  } = props;
  //   Contexts
  const { updateBuildingFrame } = useSelectContext();
  const {
    updateInventory,
    updateIncomingActions,
    addAction,
    wallet,
    player,
    incomingArray,
    incomingActions,
    counters,
  } = useNewGameContext();
  // const { tokenId } = useGameContext();
  const [showNotif, setShowNotif] = useState(false);

  const inventoryValue = useMemo(() => {
    return inventory;
  }, [inventory]);

  const fullMapValue = useMemo(() => {
    return fullMap;
  }, [fullMap]);

  const harvestingResources = async (
    _typeId: number,
    _posX: number,
    _posY: number,
    _state: number
  ) => {
    const _check = checkResHarvest(_typeId - 1, inventory, staticResourcesData);
    if (_check && player.tokenId) {
      var _inventory = harvestResPay(
        randType - 1,
        inventoryValue,
        staticResourcesData
      );
      updateInventory(_inventory);
      var time = Date.now();
      updateIncomingActions(1, _posX, _posY, uid, time, 0);
      let _incomingArray = addElemToIncoming(incomingArray, uid, time);
      var incomingArrStr = incomingCompose(_incomingArray);
      let _updateIncoming = updateIncomingInventories(player, incomingArrStr);
    } else {
      console.log("Cannot harvest or missing tokenId");
    }
  };

  const get_map = async () => {
    console.log("getting block");
    if (wallet.account) {
      const _res = await wallet.account.callContract({
        contractAddress:
          "0x060363b467a2b8d409234315babe6be180020e0bb65d708c0d09be6fd3691a2f",
        entrypoint: "read_map_block",
        calldata: [number.toFelt(1), number.toFelt(posX), number.toFelt(posY)],
      });
      console.log("res", _res.result[0]);
      console.log(number.hexToDecimalString(_res.result[0]));
    }
  };

  return (
    <>
      <div id="bFrame" className="selectDisable absolute harvestFrame">
        {/* Btn close frame */}
        {/* <button
          style={{ zIndex: "10", pointerEvents: "all" }}
          onClick={() => get_map()}
        >
          Get chain block{" "}
        </button> */}
        <div
          className="btnCloseFrame"
          onClick={() =>
            updateBuildingFrame(false, {
              infraType: 0,
              randType: 0,
              type_id: 0,
              state: 0,
              posX: 0,
              posY: 0,
              selected: 0,
              moved: 0,
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
            {staticResourcesData[randType - 1].name}
          </div>
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ paddingLeft: "8px" }}
          >
            {/* // * Population Required to harvest */}
            {staticResourcesData[randType - 1].harvestCost[8] > 0 ? (
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: "absolute", top: "-9px", left: "46px" }}
                >
                  {staticResourcesData[randType - 1].harvestCost[8]}
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
                className={"resource" + `${randType}`}
                style={{ left: "-26px", top: "-39px", position: "absolute" }}
              ></div>
            </div>
            <div
              className="font04B text-center mx-auto"
              style={{ fontSize: "12px", paddingTop: "34px", width: "85px" }}
            >
              {/* resource name  */}
              {staticResourcesData[randType - 1].type}
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
          {staticResourcesData[randType - 1].description}
        </div>

        {/* // * Btn Harvest enabled / disabled  */}
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "45px", paddingTop: "8px", pointerEvents: "all" }}
        >
          <div className="flex flex-row justify-center inline-block">
            <div style={{ width: "135px", paddingTop: "10px" }}>
              <>
                {(incomingActions &&
                  incomingActions.length > 0 &&
                  incomingActions[posY] &&
                  incomingActions[posY][posX] &&
                  incomingActions[posY][posX].status == 0) ||
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
                )}
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
            {Object.keys(staticResourcesData[randType - 1].harvestCost).map(
              (elem: any) => {
                return (
                  elem < 7 &&
                  staticResourcesData[randType - 1].harvestCost[elem] > 0 && (
                    <FrameItem
                      key={elem}
                      index={elem}
                      cost={staticResourcesData[randType - 1].harvestCost[elem]}
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
            {Object.keys(staticResourcesData[randType - 1].production).map(
              (elem: any) => {
                return (
                  elem < 7 &&
                  staticResourcesData[randType - 1].production[elem] > 0 && (
                    <FrameItem
                      key={elem}
                      index={elem}
                      cost={staticResourcesData[randType - 1].production[elem]}
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
