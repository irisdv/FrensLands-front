import { useStarknet, useStarknetCall, useStarknetInvoke, useStarknetTransactionManager } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/buildings";
import { number, transaction, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";
import { useResourcesContract } from "../../hooks/resources";
import DB from '../../db.json';
import { InstancedMesh } from "three";
import { useSelectContext } from "../../hooks/useSelectContext";


export function BuildingFrame(props: any) {
  const { tokenId, address, setAddress, updateTokenId } = useGameContext();
  const { account } = useStarknet();
  const { showFrame, frameData, updateBuildingFrame } = useSelectContext();
  const { transactions } = useStarknetTransactionManager()
  const { contract: resources } = useResourcesContract();

  const [ farming, setFarming ] = useState(false)
  const [ claiming, setClaiming ] = useState(false)
  const [ message, setMessage ] = useState("")
  const [ costUpdate, setCostUpdate ] = useState<any>(null)
  const [ dailyCosts, setDailyCosts ] = useState<any>(null)
  const [ dailyHarvest, setDailyHarvests ] = useState<any>(null)
  const [show, setShow] = useState(false)

  const [buildingSelec, setBuildingSelec] = useState(false)

  // console.log("frameData", frameData);
  // console.log('transaction status', transactions)

  useEffect(() => {
    if (showFrame) {
      setShow(true)
    } else {
      setShow(false)
    }

  }, [show, showFrame, frameData])

  const sendEvent = (id : number) => {
    // setBuildingSelec(true);
    // updateBuildingFrame(false, {"id": frameData?.id, "type": frameData?.type, "posX": frameData?.posX, "selected": 1});
  };

  useEffect(() => {
    if (account) {
      setAddress(account as string);
    }
  }, [account])

  useEffect(() => {
    if (account && !tokenId) {
      updateTokenId(account);
    }
  }, [account, tokenId])

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
    console.log('farming a resource of type id', id)
    console.log("invoking farming", tokenId);
    if (tokenId) {
      startFarmingInvoke({
        args: [
            uint256.bnToUint256(tokenId),
            id,
            "0x045ecb5f7d99d67214def0c6c77b20070b3fac664ddc16ca9850cd417c393a38",
            "0x03af997c327ca80bf00e0fc69e765a2d6f52c3d6dd0d02f36f97015065fa908d",
            "0x0526abb8b9f4d90e97a29266a3d9c5ed52f44a8a70847ef7ce9fe90f65ca51ea",
            "0x04a6a806aab47f343499dfc39d11680afbb4eec725044bd84cf548ac5c1e0297"
        ],
        metadata: {
          method: "farm",
          message: "Harvest resources spawned on map",
        },
      });
    }
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
  if (frameData?.id == 0) {
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
              {frameData && frameData.id  ? 
                frameData && (frameData.id == 2 || frameData.id == 3 || frameData.id == 20 ) ? 
                    <div className="btnBuild" onClick={() => farmingResource(frameData.id as number)}>Harvest resource</div>
                  : 
                  // BUTTON BUILD
                  <div className="btnBuild" onClick={() => sendEvent(frameData.id as number)}></div>
              :  
              // BUTTON UPGRADE 
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
