import { useStarknet, useStarknetCall, useStarknetInvoke, useStarknetTransactionManager } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
// import { useBuildingsContract } from "../../hooks/buildings";
import { number, transaction, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";
import { useResourcesContract } from "../../hooks/contracts/resources";
import DB from '../../db.json';
// import { InstancedMesh } from "three";
import { useSelectContext } from "../../hooks/useSelectContext";
import useHarvestResource from "../../hooks/invoke/useHarvestResource";
import useBuild from "../../hooks/invoke/useBuild";
import useActiveNotifications from '../../hooks/useNotifications'


// Test
import { useWorldsContract } from '../../hooks/contracts/worlds'
import useTest from "../../hooks/invoke/useTest";


export function BuildingFrame(props: any) {
  const { tokenId, address, setAddress, updateTokenId, mapArray } = useGameContext();
  const { account } = useStarknet();
  const { showFrame, frameData, updateBuildingFrame } = useSelectContext();
  const { transactions } = useStarknetTransactionManager()
  const { contract: resources } = useResourcesContract();

  const { frontBlockArray } = props

  // Test
  const { contract: worlds } = useWorldsContract();
  const [watch, setWatch] = useState(true);
  // end test

  const activeNotifications = useActiveNotifications()
  const harvestingInvoke = useHarvestResource()
  const [ harvesting, setHarvesting ] = useState<any>(null)
  const buildingInvoke = useBuild()
  const [ building, setBuilding ] = useState<any>(null)

  const [ farming, setFarming ] = useState(false)
  const [ message, setMessage ] = useState("")

  const [ costUpdate, setCostUpdate ] = useState<any>(null)
  const [ dailyCosts, setDailyCosts ] = useState<any>(null)
  const [ dailyHarvest, setDailyHarvests ] = useState<any>(null)
  const [show, setShow] = useState(false)

  const [buildingSelec, setBuildingSelec] = useState(false)

  useEffect(() => {
    if (showFrame) {
      setShow(true)
    } else {
      setShow(false)
    }

  }, [show, showFrame, frameData])

  const sendEvent = (id : number) => {
    // if (tokenId) {
    //   let tx_hash = buildingInvoke(tokenId, 7, 1, 1, 1)
    //   console.log('tx hash building', tx_hash)
    //   setBuilding(tx_hash);
    // }
    // pgrade', [uint256.bnToUint256(tokenId as number), building_type_id, level, pos_start, allocated_pop])
    // setBuildingSelec(true);
    // updateBuildingFrame(false, {"id": frameData?.id, "type": frameData?.type, "posX": frameData?.posX, "selected": 1});

  };

  // Test
  // const { data: fetchMapBlock } = useStarknetCall({
  //   contract: worlds,
  //   method: "get_map_block",
  //   args: [uint256.bnToUint256(tokenId as number), 43],
  //   options: { watch },
  // });

  // const MapBlockValue = useMemo(() => {
  //   if (fetchMapBlock && fetchMapBlock.length > 0) {
  //     // console.log('fetchMapBlock', fetchMapBlock[0])
  //     var elem = toBN(fetchMapBlock[0]);
  //     var val = elem.toNumber();

  //     // console.log('val', val)

  //     return { block: val };
  //   }
  // }, [fetchMapBlock]);
  // end test

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

  const harvestingResources = (type_id : number, pos_x: number, pos_y: number, level : number) => {
    let pos_start = (pos_y - 1) * 40 + pos_x
    if (tokenId) {
      let tx_hash = harvestingInvoke(tokenId, pos_start, parseInt(frameData?.unique_id as string), type_id, level, pos_x, pos_y)
      console.log('tx hash harvesting resource', tx_hash)
      setHarvesting(tx_hash);
    } else {
      console.log('Missing tokenId')
    }
  }

  useEffect(() => {
    if (harvesting) {
      var dataMinting = activeNotifications.filter((transactions) => (transactions?.content.transactionHash as string) === harvesting as string)
      console.log('harvestingData', dataMinting )
      if (dataMinting && dataMinting[0] && dataMinting[0].content) {
        if (dataMinting[0].content.status == 'REJECTED') {
          setMessage("Your transaction has failed... Try again.")
          setHarvesting(null)
        } else if (dataMinting[0].content.status == 'ACCEPTED_ON_L1' || dataMinting[0].content.status == 'ACCEPTED_ON_L2') {
          setMessage("Your transaction was accepted. Now you need to initialize the game!")
          setHarvesting(true)
        } else {
          setMessage("Your transaction is ongoing.")
        }
      }
    }
  }, [harvesting, activeNotifications])

  useEffect(() => {
    if (frameData && frameData.id && frameData.level) {
      var newCost : any[] = [];
      console.log('level', frameData.level)
      // console.log('test', DB.buildings[frameData.id as any].cost_update.level[frameData.level])
      // @ts-ignore
      DB.buildings[frameData.id as any].cost_update.level[frameData.level - 1].resources.map((item : any) => {
        console.log('item', item)
        newCost.push([item.id, item.quantity])
      })
      console.log('cost update', newCost)
      setCostUpdate(newCost)
    }
  }, [frameData])

  useEffect(() => {
    if (frameData && frameData.id && frameData.level) {
      var newDailyHarvest : any[] = [];

      // @ts-ignore
      DB.buildings[frameData.id as any].daily_harvest.level[frameData.level - 1].resources.map((item : any) => {
        newDailyHarvest.push([item.id, item.quantity])
      })
      // console.log('newDailyHarvest', newDailyHarvest)
      console.log('newDailyHarvest', newDailyHarvest)
      setDailyHarvests(newDailyHarvest)
    }
  }, [frameData])

  useEffect(() => {
    if (frameData && frameData.id && frameData.level) {
      var newDailyCost : any[] = [];  

      // var level : number = frameData.level - 1
      console.log('level received', frameData.level)
      // console.log('data level', DB.buildings[frameData.id as any].cost_update.level[frameData.level])

      // @ts-ignore
      DB.buildings[frameData.id as any].daily_cost.level[frameData.level - 1].resources.map((item : any) => {
        newDailyCost.push([item.id, item.quantity])
      })
      console.log('daily costs', newDailyCost)
      // console.log('newCos', newDailyCost[0][0])
      setDailyCosts(newDailyCost)
    }
  }, [frameData])

  // TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST  TEST TEST TEST TEST TEST TEST TEST TEST TEST
  const generateTest = useTest()
  const [testing, setTesting] = useState<any>(null)
  const testContract = async (unique_id : any, id : number, posX : number, posY : number) => {
    console.log("invoking test", account);
    let tx_hash = await generateTest(unique_id, id, posX, posY, frontBlockArray[posY][posX][7])
    console.log('tx hash', tx_hash)
    setTesting(tx_hash);
  };

  // useEffect(() => {
  //   if (testing) {
  //     var data = activeNotifications.filter((transactions) => (transactions?.content.transactionHash as string) === testing as string)
  //     console.log('data test', data )
  //     console.log('state', testing)
  //     if (data && data[0] && data[0].content) {
  //       if (data[0].content.status == 'REJECTED') {
  //         setMessage("Your transaction has failed... Try again.")
  //       } else if (data[0].content.status == 'ACCEPTED_ON_L1' || data[0].content.status == 'ACCEPTED_ON_L2') {
  //         setMessage("Your transaction was accepted. Now you can play!")
  //         console.log('in data')
  //         setTesting(true)
  //       }
  //     }
  //   }
  // }, [testing, activeNotifications])
  // TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST  TEST TEST TEST TEST TEST TEST TEST TEST TEST

  const showBuildingCursor = (id : any) => {
    console.log('pass showFrame to false and show cursor for', frameData)
    updateBuildingFrame(false, {"id": id, "level": frameData?.level, "posX": 0, "posY": 0, "selected": 1});
  }

  if (!showFrame) {
    return <></>;
  }
  if (frameData?.id == 0) {
    return <></>;
  }

  return (
    <>
      <div id="bFrame" className="absolute buildingFrame" style={{right: "-113px", bottom: "0", height: "640px", width: "640px", zIndex: "1"}}>
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
          {frameData && frameData.id ? DB.buildings[frameData.id as any].description : ""}
        </div>
        <div className="relative flex jutify-center items-center inline-block" style={{ height: "45px", paddingTop: "8px", pointerEvents: "all" }}>
          <div className="flex flex-row justify-center inline-block">
            <div style={{ width: "206px", paddingTop: "10px" }}>
              {frameData && frameData.id  ?
                frameData && (frameData.id == 2 || frameData.id == 3 || frameData.id == 20 ) ?
                    <>
                      <div className="btnHarvest" onClick={() => harvestingResources(frameData.id as number, frameData.posX, frameData.posY, frameData.level as number)}></div>
                    </>
                  :
                    (frameData && frameData.id == 1) ?
                      // BUTTON UPGRADE FOR CABIN
                      <div className="btnUpgrade"
                        onClick={() => console.log('upgrade cabin')}
                      ></div>
                    :
                    // BUTTON BUILD
                    <div className="btnBuild"
                      onClick={() => showBuildingCursor(frameData.id as number)}
                    ></div>
              :
              // BUTTON UPGRADE
                <div className="btnUpgrade"></div>
              }
            </div>
            <div className="relative flex jutify-center items-center inline-block" style={{ width: "60px", height: "80px", paddingTop: "10px" }}>
              {frameData && frameData.id && costUpdate && costUpdate.length >= 4 && costUpdate[3] &&
                <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "15px" }}>{costUpdate[3][1]}</div>
                  <div className={"mb-3 small"+`${costUpdate[3][0]}`} style={{ position: "absolute", top: "-39px", left: "3px" }}></div>
                </div>
              }
              {frameData && frameData.id && costUpdate && costUpdate.length >= 3 && costUpdate[2] &&
                <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "15px" }}>{costUpdate[2][1]}</div>
                  <div className={"mb-3 small"+`${costUpdate[2][0]}`} style={{ position: "absolute", top: "-39px", left: "3px" }}></div>
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

          {frameData && frameData.id && dailyCosts && dailyCosts.length == 3 && dailyCosts[2] &&
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
