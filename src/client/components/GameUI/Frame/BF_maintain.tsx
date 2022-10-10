import React, { useMemo, useState, useEffect } from "react";
import { useSelectContext } from "../../../hooks/useSelectContext";
import { FrameItem } from "../FrameItem";

export function BF_maintain(props: any) {
  const { uid, typeId, state, posX, posY, staticBuildingsData, inventory } =
    props;
  const { showFrame, frameData, updateBuildingFrame } = useSelectContext();
  const [showNotif, setShowNotif] = useState(false);
  const [inputFuel, setInputFuel] = useState(1);

  const destroyBuilding = (type_id: number, pos_x: number, pos_y: number) => {
    const pos_start = (pos_y - 1) * 40 + pos_x;
    console.log("pos_start", pos_start);
    // if (tokenId) {
    //   const tx_hash = detroyingInvoke(
    //     tokenId,
    //     pos_start,
    //     type_id,
    //     pos_x,
    //     pos_y,
    //     frameData?.unique_id as number,
    //     nonceValue
    //   );
    //   console.log("tx hash destroy", tx_hash);
    //   // setDestroying(tx_hash);

    //   // tx_hash.then((res) => {
    //   //   console.log("res", res);
    //   //   if (res != 0) {
    //   //     updateNonce(nonceValue);
    //   //     setHarvesting(pos_x, pos_y, 0);
    //   //   }
    //   // });
    // } else {
    //   console.log("Missing tokenId");
    // }
  };

  const fuelProd = (
    nb_days: number,
    type_id: number,
    pos_x: number,
    pos_y: number,
    uniqueId: number
  ) => {
    const pos_start = (pos_y - 1) * 40 + pos_x;
    // console.log("pos_start", pos_start);
    // if (tokenId) {
    //   // tokenId : number, pos_start: number, nb_days: number, building_type_id: number, posX: number, posY: number, uniqueId: number
    //   const tx_hash = rechargingInvoke(
    //     tokenId,
    //     pos_start,
    //     nb_days,
    //     type_id,
    //     pos_x,
    //     pos_y,
    //     uniqueId,
    //     nonceValue
    //   );
    //   console.log("tx hash recharging", tx_hash);

    //   // tx_hash.then((res) => {
    //   //   console.log("res", res);
    //   //   if (res != 0) {
    //   //     updateNonce(nonceValue);
    //   //   }
    //   // });
    // } else {
    //   console.log("Missing tokenId");
    // }
  };

  // TODO check can pay maintain costs depending on inventory
  // + build error msg checkResMaintainMsg function

  const updateInputFuel = () => {
    if (inputFuel == 1) {
      setInputFuel(10);
    } else if (inputFuel == 10) {
      setInputFuel(100);
    } else if (inputFuel == 100) {
      // let max = 100000000;
      // dailyCosts.forEach((element: any) => {
      //   if (element[0] == 1 && wood != null) {
      //     var res = parseInt((wood / element[1]).toFixed(0));
      //     if (res < max) max = res;
      //   }
      //   if (element[0] == 2 && rock != null) {
      //     var res = parseInt((rock / element[1]).toFixed(0));
      //     if (res < max) max = res;
      //   }
      //   if (element[0] == 3 && meat != null) {
      //     var res = parseInt((meat / element[1]).toFixed(0));
      //     if (res < max) max = res;
      //   }
      //   if (element[0] == 5 && cereal != null) {
      //     var res = parseInt((10 / element[1]).toFixed(0));
      //     if (res < max) max = res;
      //   }
      //   if (element[0] == 6 && metal != null) {
      //     var res = parseInt((metal / element[1]).toFixed(0));
      //     if (res < max) max = res;
      //   }
      //   if (element[0] == 8 && coal != null) {
      //     var res = parseInt((coal / element[1]).toFixed(0));
      //     if (res < max) max = res;
      //   }
      //   if (element[0] == 10 && frensCoins != null) {
      //     var res = parseInt((frensCoins / element[1]).toFixed(0));
      //     if (res < max) max = res;
      //   }
      //   if (element[0] == 11 && energy != null) {
      //     var res = parseInt((energy / element[1]).toFixed(0));
      //     if (res < max) max = res;
      //   }
      // });
      setInputFuel(1);
    } else {
      setInputFuel(1);
    }
  };

  return (
    <>
      <div
        id="bFrame"
        className="selectDisable absolute buildingFrameRecharged"
      >
        <div
          className="btnDestroy absolute"
          onClick={() => destroyBuilding(typeId as number, posX, posY)}
          style={{ right: "135px", bottom: "280px" }}
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
                className={"building" + `${frameData?.typeId}`}
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

        {/* upgrade btn*/}
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

        {/* Buildings rechargeables */}

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

        {/* Pour les buildings qui sont rechargeables */}
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
            {/* // TODO get number of blocks fueled by player  */}
            {/* {buildingData != null &&
                  buildingData.active != null &&
                  buildingData.active[frameData.unique_id as any] &&
                  buildingData.active[frameData.unique_id as any].recharges
                    ? buildingData.active[frameData.unique_id as any].recharges
                    : 0} */}
            0
          </div>
        </div>

        <div
          className="grid grid-cols-2"
          style={{ height: "55px", marginLeft: "0px", pointerEvents: "all" }}
        >
          {/* // TODO show btn fuel / start prod /disabled  */}
          {/* {buildingData && buildingData.active && buildingData.active[frameData.unique_id as any] ?  */}
          <div>
            <div
              className="btnFuelProd pixelated"
              onClick={() =>
                fuelProd(inputFuel, typeId as number, posX, posY, uid)
              }
              style={{ marginTop: "-9px", marginLeft: "-18px" }}
            ></div>
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
            {/* {staticBuildingsData[typeId - 1].maintainCost.map((elem: any) => { */}
            {Object.keys(staticBuildingsData[typeId - 1].maintainCost).map(
              (elem: any) => {
                return (
                  elem < 7 &&
                  staticBuildingsData[typeId - 1].maintainCost[elem] > 0 && (
                    <FrameItem
                      key={"maintain_" + elem}
                      index={elem}
                      cost={staticBuildingsData[typeId - 1].maintainCost[elem]}
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
