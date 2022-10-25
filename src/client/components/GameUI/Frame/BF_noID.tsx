import React, { useState } from "react";
import { useSelectContext } from "../../../hooks/useSelectContext";
import { FrameItem } from "../FrameItem";

export function BF_noID(props: any) {
  const {
    uid,
    typeId,
    state,
    _canBuild,
    _msg,
    staticBuildingsData,
    inventory,
  } = props;
  const { updateBuildingFrame } = useSelectContext();
  const [showNotif, setShowNotif] = useState(false);

  const showBuildingCursor = (_infraType: number, _typeId: number) => {
    updateBuildingFrame(false, {
      infraType: _infraType,
      typeId: _typeId,
      level: state,
      posX: 0,
      posY: 0,
      selected: 1,
      moved: 0,
    });
  };

  return (
    <>
      <div id="bFrame" className="selectDisable absolute buildingFrame">
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
              moved: 0,
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
            {staticBuildingsData[typeId - 1].createCost[8] > 0 ? (
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
            {staticBuildingsData[typeId - 1].createCost[9] > 0 ? (
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: "absolute", top: "-9px", left: "46px" }}
                >
                  +{staticBuildingsData[typeId - 1].createCost[9]}
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
            ></div>
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

        {/* // * btn build + cost of building  */}

        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "45px", paddingTop: "8px", pointerEvents: "all" }}
        >
          <div className="flex flex-row justify-center inline-block">
            <div style={{ width: "135px", paddingTop: "10px" }}>
              {/*  // * Can build building  */}
              {_canBuild == 1 ? (
                <div
                  className="btnBuild"
                  onClick={() => showBuildingCursor(2, typeId as number)}
                ></div>
              ) : (
                _canBuild == 0 && (
                  <>
                    {/*  // * not enough resources to build  */}
                    <div
                      className="btnBuildDisabled"
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
            {/* Cost of building  */}
            <div
              className="relative flex justify-end items-center inline-block"
              style={{
                width: "201px",
                height: "80px",
                paddingTop: "10px",
              }}
            >
              {Object.keys(staticBuildingsData[typeId - 1].createCost).map(
                (elem: any) => {
                  return (
                    elem < 7 &&
                    staticBuildingsData[typeId - 1].createCost[elem] > 0 && (
                      <FrameItem
                        key={elem}
                        index={elem}
                        cost={staticBuildingsData[typeId - 1].createCost[elem]}
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
