import { useStarknet, useStarknetCall, useStarknetInvoke, useStarknetTransactionManager } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/buildings";
import { number, transaction, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";
import { useResourcesContract } from "../../hooks/resources";
import DB from '../../db.json';


export function BuildingFrame(props: any) {
  const { showFrame, frameData, farmResource } = useGameContext();
  const { transactions } = useStarknetTransactionManager()
  const { contract: resources } = useResourcesContract();
  const [ farming, setFarming ] = useState(false)


  console.log("HERE HERE HERE", showFrame);
  console.log("frameData", frameData);

  console.log('transaction status', transactions)
  // transaction.metadata pour accéder aux data

  const [show, setShow] = useState(false)

  useEffect(() => {
    if (showFrame) {
      setShow(true)
    } else {
      setShow(false)
    }

  }, [show, showFrame, frameData])

  const {
    data: dataStartFarming,
    loading: loadingStartFarming,
    invoke: startFarmingInvoke,
  } = useStarknetInvoke({
    contract: resources,
    method: "farm",
  });

  // DEBUG : enlever les arguments 
  const farmingResource = (id : any) => {
    console.log('farming a resource of type id', 1)
    console.log("invoking farming", Date.now());
    // Args : tokenId, building_unique_id
    startFarmingInvoke({
      args: [
          uint256.bnToUint256(1),
          id,
          "0x02b8f3e7a283dcf5703ab165d0b3785e4e903742102743735da4c64e8ac0dfc6",
          "0x070bc995b48d153a40ad566cab6d3be143e7be7074dd93c0059fd540e3ca2596",
          "0x04bad6d5f54e70c1edd8127fa3a7e3633a0c6b2a8753f0c7ead7503df111d77f",
          "0x04a628b88797fd3d99609c0d362c9cda04480c79930b867cdcf55454a95c4b8f"
      ],
      metadata: {
        method: "get_map",
        message: "Mint Frens Lands map",
      },
    });
    setFarming(true);
  };

  // const farmingResource = (id : any) => {
  //   console.log('farming a resource of id', 1)
  //   farmResource(id, {});

  // }

  // _farm_tx = await resources.invoke("farm", [
  //   uint256.bnToUint256(0),
  //   building_unique_id,
  //   "0x05e10dc2d99756ff7e339912a8723ecb9c596e8ecd4f3c3a9d03eb06096b153f",
  //   "0x072c5b060c922f01383d432624fa389bf8b087013b9702b669c484857d23eea1",
  //   "0x0574fe8bbe799ce7583ef1aefe4c6cf1135dc21c092471982e56b038355f8249",
  //   "0x04e8653b61e068c01e95f4df9e7504b6c71f2937e2bf00ec6734f4b2d33c13e0"
  // ]);


  if (!showFrame) {
    return <></>;
  }

  return (
    <>

      <div id="bFrame" className="absolute buildingFrame"
        style={{right: "-113px", bottom: "0", height: "640px", width: "640px"}}>
        <div className="grid grid-cols-2 inline-block" style={{ height: "20px" }}>
          <div className="font8BITWonder uppercase text-center" style={{ height: "20px" }} >
            {/* {frameData && frameData.name ? frameData.name : ""} */}
            {frameData && frameData.id ? DB.buildings[0].name : 0}
            {/* // ["building"]['id'][`${frameData.id}`].name */}
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
            <div style={{ width: "206px", paddingTop: "10px" }}>
              {frameData && frameData.type == 0 ? 
                <div className="btnBuild" onClick={() => farmingResource(2)}></div>
               
              : 
                <div className="btnUpgrade"></div> 
              }
            </div>
            <div className="relative flex jutify-center items-center inline-block" style={{ width: "60px", height: "80px", paddingTop: "10px" }}>
              <div className="flex flex-row justify-center inline-block relative">
                <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "0px" }}>
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
