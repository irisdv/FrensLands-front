import { useStarknet, useStarknetCall } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";

export function BuildingFrame(props: any) {
  const { showFrame, frameData } = useGameContext();
  console.log("showFrame", showFrame);
  console.log("frameData", frameData);

  if (!showFrame) {
    return <></>;
  }

  return (
    <>
      <div
        id="bFrame"
        className="absolute buildingFrame"
        // style=`{{display: ${showFrame}}}`
      >
        <div
          className="grid grid-cols-2 inline-block"
          style={{ height: "20px" }}
        >
          <div
            className="font8BITWonder uppercase text-center"
            style={{ height: "20px" }}
          >
            {frameData && frameData.name ? frameData.name : ""}
          </div>
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ paddingLeft: "8px" }}
          >
            {/* TODO: dynamic choice of className for icons + dynamic data */}
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-9px", left: "20px" }}
              >
                <span id="GoldFrame">320</span>
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-34px", left: "23px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-9px", left: "68px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-34px", left: "70px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-9px", left: "117px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-34px", left: "119px" }}
              ></div>
            </div>
          </div>
        </div>
        {/* Add dynamic data */}
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "85px" }}
        >
          <div className="flex flex-row justify-center inline-block relative">
            <div
              className="font04B text-center mx-auto"
              style={{
                width: "68px",
              }}
            >
              Image
            </div>
            <div
              className="font04B text-center mx-auto"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "85px",
              }}
            >
              Security
            </div>
            <div
              className="font04B mx-auto text-center"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "67px",
              }}
            >
              1{/* level */}
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "65px",
              }}
            >
              2 x 2
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{
                fontSize: "12px",
                paddingTop: "34px",
                width: "64px",
              }}
            >
              34,37
            </div>
          </div>
        </div>
        {/* Add dynamic data */}
        <div
          className="font04B"
          style={{
            height: "109px",
            fontSize: "13px",
            paddingLeft: "9px",
            paddingTop: "6px",
          }}
        >
          description
        </div>
        {/* If too build :  btn Build left w/ required resources : red if not enough resources, green if ok
              If already built : btn centered Upgrade
          */}
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: "45px", paddingTop: "8px" }}
        >
          <div className="flex flex-row justify-center inline-block">
            {/* Case button  */}
            <div style={{ width: "206px", paddingTop: "10px" }}>
              <a>
                <div className="btnUpgrade"></div>
              </a>
            </div>
            <div
              className="relative flex jutify-center items-center inline-block"
              style={{ width: "60px", height: "80px", paddingTop: "10px" }}
            >
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: "absolute", top: "-15px", left: "0px" }}
                >
                  320
                </div>
                <div
                  className="smallGold mb-3"
                  style={{ position: "absolute", top: "-39px", left: "3px" }}
                ></div>
              </div>
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: "absolute", top: "-15px", left: "50px" }}
                >
                  320
                </div>
                <div
                  className="smallGold mb-3"
                  style={{ position: "absolute", top: "-39px", left: "52px" }}
                ></div>
              </div>
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: "absolute", top: "-15px", left: "95px" }}
                >
                  320
                </div>
                <div
                  className="smallGold mb-3"
                  style={{ position: "absolute", top: "-39px", left: "97px" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="grid grid-cols-2"
          style={{ height: "30px", marginLeft: "205px" }}
        >
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ width: "60px", paddingTop: "10px" }}
          >
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "0px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "3px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "50px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "52px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "95px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "97px" }}
              ></div>
            </div>
          </div>
        </div>
        <div
          className="grid grid-cols-2"
          style={{ height: "30px", marginLeft: "205px" }}
        >
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ width: "60px", paddingTop: "10px" }}
          >
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "0px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "3px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "50px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "52px" }}
              ></div>
            </div>
            <div className="flex flex-row justify-center inline-block relative">
              <div
                className="fontHPxl-sm"
                style={{ position: "absolute", top: "-15px", left: "95px" }}
              >
                320
              </div>
              <div
                className="smallGold mb-3"
                style={{ position: "absolute", top: "-39px", left: "97px" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
