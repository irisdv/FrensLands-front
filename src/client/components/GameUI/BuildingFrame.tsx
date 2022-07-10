import { useStarknet, useStarknetCall, useStarknetInvoke, useStarknetTransactionManager } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/buildings";
import { number, transaction, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";
import { useResourcesContract } from "../../hooks/resources";
import DB from '../../db.json';
import { InstancedMesh } from "three";


export function BuildingFrame(props: any) {
  const { showFrame, frameData, farmResource } = useGameContext();
  const { transactions } = useStarknetTransactionManager()
  const { contract: resources } = useResourcesContract();
  const [ farming, setFarming ] = useState(false)
  const [ costUpdate, setCostUpdate ] = useState<any>(null)
  const [ dailyCosts, setDailyCosts ] = useState<any>(null)
  const [ dailyHarvest, setDailyHarvests ] = useState<any>(null)
  const [show, setShow] = useState(false)

  console.log("frameData", frameData);
  // console.log('transaction status', transactions)

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
        method: "farm",
        message: "Farm resources spawned on map",
      },
    });
    setFarming(true);
  };

  useEffect(() => {
    if (frameData && frameData.id) {
      var newCost : any[] = [];
      DB.buildings[frameData.id as any].cost_update.resources.map((item : any) => {
        newCost.push([item.id, item.quantity])
      })
      setCostUpdate(newCost)
    }
  }, [frameData])

  useEffect(() => {
    if (frameData && frameData.id) {
      var newDailyHarvest : any[] = [];
      
      DB.buildings[frameData.id as any].daily_harvest.resources.map((item : any) => {
        newDailyHarvest.push([item.id, item.quantity])
      })
      console.log('newDailyHarvest', newDailyHarvest)
      console.log('newDailyHarvest', newDailyHarvest[0][0])
      setDailyHarvests(newDailyHarvest)
    }
  }, [frameData])

  useEffect(() => {
    if (frameData && frameData.id) {
      var newDailyCost : any[] = [];
      
      DB.buildings[frameData.id as any].daily_cost.resources.map((item : any) => {
        newDailyCost.push([item.id, item.quantity])
      })
      console.log('newCos', newDailyCost)
      console.log('newCos', newDailyCost[0][0])
      setDailyCosts(newDailyCost)
    }
  }, [frameData])

  if (!showFrame) {
    return <></>;
  }

  return (
    <>
      <div id="bFrame" className="absolute buildingFrame" style={{right: "-113px", bottom: "0", height: "640px", width: "640px"}}>
        <div className="grid grid-cols-2 inline-block" style={{ height: "20px" }}>
          <div className="font8BITWonder uppercase text-center" style={{ height: "20px" }} >
            {frameData && frameData.id ? DB.buildings[frameData.id as any].name : 0}
          </div>
          <div className="relative flex jutify-center items-center inline-block" style={{ paddingLeft: "8px" }}>
                {frameData && frameData.id && costUpdate && costUpdate[2] && 
                  <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-9px", left: "127px" }}>{costUpdate[2][1]}</div>
                    <div className={"mb-3 small"+`${costUpdate[2][0]}`} style={{ position: "absolute", top: "-34px", left: "119px" }}></div>
                  </div>
                }
                {frameData && frameData.id && costUpdate && costUpdate[1] &&
                  <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-9px", left: "78px" }}>{costUpdate[1][1]}</div>
                    <div className={"mb-3 small"+`${costUpdate[1][0]}`} style={{ position: "absolute", top: "-34px", left: "70px" }}></div>
                  </div>
                }
                {frameData && frameData.id && costUpdate && costUpdate[0] &&
                  <div className="flex flex-row justify-center inline-block relative">
                      <div className="fontHPxl-sm" style={{ position: "absolute", top: "-9px", left: "30px" }}>{costUpdate[0][1]}</div>
                      <div className={"mb-3 small"+`${costUpdate[0][0]}`} style={{ position: "absolute", top: "-34px", left: "23px" }}></div>
                  </div>
                }
          </div>
        </div>
        <div className="relative flex jutify-center items-center inline-block" style={{ height: "85px" }}>
          <div className="flex flex-row justify-center inline-block relative">
            <div  className="font04B text-center mx-auto relative"  style={{width: "68px"}}>
              <div className={"building"+`${frameData?.id}`} style={{left: "-26px", top: "-39px", position: "absolute"}}></div>
              </div>
            <div className="font04B text-center mx-auto" style={{fontSize: "12px", paddingTop: "34px", width: "85px"}}>
              {frameData && frameData.id ? DB.buildings[frameData.id as any].name : 0}
            </div>
            <div className="font04B mx-auto text-center" style={{   fontSize: "12px",   paddingTop: "34px",   width: "67px", }}>
              1
            </div>
            <div className="font04B text-center mx-auto relative" style={{   fontSize: "12px",   paddingTop: "34px",   width: "65px", }}>
              1 x 1
            </div>
            <div className="font04B text-center mx-auto relative" style={{fontSize: "12px", paddingTop: "34px", width: "64px",}}>
              {frameData && frameData.posX && frameData.posY ? frameData.posX + " " + frameData.posY : ""}
            </div>
          </div>
        </div>
        <div className="font04B" style={{   height: "109px",   fontSize: "13px",   paddingLeft: "9px",   paddingTop: "6px"}}>
        {frameData && frameData.id ? DB.buildings[0].description : 0}
        </div>
        <div className="relative flex jutify-center items-center inline-block" style={{ height: "45px", paddingTop: "8px" }}>
          <div className="flex flex-row justify-center inline-block">
            <div style={{ width: "206px", paddingTop: "10px" }}>
              {frameData && frameData.type == 0 ? 
                <div className="btnBuild" onClick={() => farmingResource(2)}></div>
               
              : 
                <div className="btnUpgrade"></div> 
              }
            </div>
            <div className="relative flex jutify-center items-center inline-block" style={{ width: "60px", height: "80px", paddingTop: "10px" }}>

              {frameData && frameData.id && costUpdate && costUpdate[2] && 
                <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "15px" }}>{dailyCosts[2][1]}</div>
                  <div className={"mb-3 small"+`${dailyCosts[2][0]}`} style={{ position: "absolute", top: "-39px", left: "3px" }}></div>
                </div>
              }
              {frameData && frameData.id && costUpdate && costUpdate[1] &&
                <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "60px" }}>{costUpdate[1][1]}</div>
                  <div className={"mb-3 small"+`${costUpdate[1][0]}`} style={{ position: "absolute", top: "-39px", left: "52px" }}></div>
                </div>
              }
              {frameData && frameData.id && costUpdate && costUpdate[0] &&
                <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "105px" }}>{costUpdate[0][1]}</div>
                    <div className={"mb-3 small"+`${costUpdate[0][0]}`} style={{ position: "absolute", top: "-39px", left: "97px" }}></div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2" style={{ height: "30px", marginLeft: "205px" }}>
          <div className="relative flex jutify-center items-center inline-block" style={{ width: "60px", paddingTop: "10px" }}>

          {frameData && frameData.id && dailyCosts && dailyCosts[2] && 
              <div className="flex flex-row justify-center inline-block relative">
                <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "15px" }}>{dailyCosts[2][1]}</div>
                <div className={"mb-3 small"+`${dailyCosts[2][0]}`} style={{ position: "absolute", top: "-39px", left: "3px" }}></div>
              </div>
            }
            {frameData && frameData.id && dailyCosts && dailyCosts[1] &&
              <div className="flex flex-row justify-center inline-block relative">
                <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "60px" }}>{dailyCosts[1][1]}</div>
                <div className={"mb-3 small"+`${dailyCosts[1][0]}`} style={{ position: "absolute", top: "-39px", left: "52px" }}></div>
              </div>
            }
            {frameData && frameData.id && dailyCosts && dailyCosts[0] &&
              <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "105px" }}>{dailyCosts[0][1]}</div>
                  <div className={"mb-3 small"+`${dailyCosts[0][0]}`} style={{ position: "absolute", top: "-39px", left: "97px" }}></div>
              </div>
            }
          </div>
        </div>
        <div className="grid grid-cols-2" style={{ height: "30px", marginLeft: "205px" }}>
          <div className="relative flex jutify-center items-center inline-block" style={{ width: "60px", paddingTop: "10px" }}>

            {frameData && frameData.id && dailyHarvest && dailyHarvest[2] && 
              <div className="flex flex-row justify-center inline-block relative">
                <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "15px" }}>{dailyHarvest[2][1]}</div>
                <div className={"mb-3 small"+`${dailyHarvest[2][0]}`} style={{ position: "absolute", top: "-39px", left: "3px" }}></div>
              </div>
            }
            {frameData && frameData.id && dailyHarvest && dailyHarvest[1] &&
              <div className="flex flex-row justify-center inline-block relative">
                <div className="fontHPxl-sm" style={{ position: "absolute", top: "-14px", left: "60px" }}>{dailyHarvest[1][1]}</div>
                <div className={"mb-3 small"+`${dailyHarvest[1][0]}`} style={{ position: "absolute", top: "-39px", left: "52px" }}></div>
              </div>
            }
            {frameData && frameData.id && dailyHarvest && dailyHarvest[0] &&
              <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "105px" }}>{dailyHarvest[0][1]}</div>
                  <div className={"mb-3 small"+`${dailyHarvest[0][0]}`} style={{ position: "absolute", top: "-39px", left: "97px" }}></div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}
