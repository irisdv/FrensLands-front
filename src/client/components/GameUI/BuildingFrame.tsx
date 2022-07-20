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
import useResourcesContext from "../../hooks/useResourcesContext";


export function BuildingFrame(props: any) {
  const { tokenId, address, setAddress, updateTokenId, mapArray, buildingData } = useGameContext();
  const { frensCoins, energy, wood, rock, metal, coal, populationBusy, populationFree, meat, cereal} = useResourcesContext();
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
  const [buildingSelec, setBuildingSelec] = useState(false)

  const [ costUpdate, setCostUpdate ] = useState<any>(null)
  const [ dailyCosts, setDailyCosts ] = useState<any>(null)
  const [ dailyHarvest, setDailyHarvests ] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [inputFuel, setInputFuel] = useState(1)

  useEffect(() => {
    if (showFrame) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [show, showFrame, frameData])

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
      // @ts-ignore
      DB.buildings[frameData.id as any].cost_update.level[frameData.level - 1].resources.map((item : any) => {
        newCost.push([item.id, item.quantity])
      })
      console.log('newcost', newCost)
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
      setDailyHarvests(newDailyHarvest)
    }
  }, [frameData])

  useEffect(() => {
    if (frameData && frameData.id && frameData.level) {
      var newDailyCost : any[] = [];  
      // @ts-ignore
      DB.buildings[frameData.id as any].daily_cost.level[frameData.level - 1].resources.map((item : any) => {
        newDailyCost.push([item.id, item.quantity])
      })
      // console.log('daily costs', newDailyCost)
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
    // console.log('pass showFrame to false and show cursor for', frameData)
    updateBuildingFrame(false, {"id": id, "level": frameData?.level, "posX": 0, "posY": 0, "selected": 1});
  }

  const updateInputFuel = () => {
    if (inputFuel == 1) {
      setInputFuel(10)
    } else if (inputFuel == 10) {
      setInputFuel(100)
    } else if (inputFuel == 100) {
      var max = 100000000
      dailyCosts.forEach((element : any) => {
        if (element[0] == 1 && wood != null) {
          var res = parseInt((wood /element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 2 && rock != null) {
          var res = parseInt((rock /element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 3 && meat != null) {
          var res = parseInt((meat /element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 5 && cereal != null) {
          var res = parseInt((10 /element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 6 && metal != null) {
          var res = parseInt((metal /element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 8 && coal != null) {
          var res = parseInt((coal /element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 10 && frensCoins != null) {
          var res = parseInt((frensCoins /element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 11 && energy != null) {
          var res = parseInt((energy /element[1]).toFixed(0))
          if (res < max) max = res
        }
      });
      setInputFuel(max)
    } else {
      setInputFuel(1)
    }
  }

  if (!showFrame) {
    return <></>;
  }
  if (frameData?.id == 0) {
    return <></>;
  }

  return (
    <>
      <div id="bFrame" className={"absolute "+`${frameData && frameData.id && (frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.id != 4 && frameData.id != 5) && frameData.unique_id ? "buildingFrameRecharged" : "buildingFrame" }`}>
        <div className="grid grid-cols-2 inline-block" style={{ height: "20px" }}>
          <div className="font8BITWonder uppercase text-center" style={{ height: "20px" }} >
            {frameData && frameData.id ? DB.buildings[frameData.id as any].name : ""}
          </div>
          <div className="relative flex jutify-center items-center inline-block" style={{ paddingLeft: "8px" }}>
                {frameData && frameData.id && DB.buildings[frameData.id].pop_min && (!frameData.unique_id) &&
                <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-9px", left: "100px" }}>-{DB.buildings[frameData.id].pop_min}</div>
                    <div className={"mb-3 small12"} style={{ position: "absolute", top: "-34px", left: "105px" }}></div>
                </div>
                }
                {frameData && frameData.id && DB.buildings[frameData.id].new_pop != null && (!frameData.unique_id) &&
                <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-9px", left: "46px" }}>+{DB.buildings[frameData.id].new_pop}</div>
                    <div className={"mb-3 small12"} style={{ position: "absolute", top: "-34px", left: "45px" }}></div>
                </div>
                }
                {frameData && frameData.id && DB.buildings[frameData.id].pop_min != null && frameData.unique_id &&
                <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-9px", left: "46px" }}>{DB.buildings[frameData.id].pop_min}</div>
                    <div className={"mb-3 small12"} style={{ position: "absolute", top: "-34px", left: "45px" }}></div>
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
              {frameData && (frameData.id == 2 || frameData.id == 3 || frameData.id == 20 ) &&
                <>
                  <div className="btnHarvest" onClick={() => harvestingResources(frameData.id as number, frameData.posX, frameData.posY, frameData.level as number)}></div>
                </>
              }
              {frameData && frameData.id == 1 && frameData.level == 1 &&
                  <div className="btnUpgrade"
                  onClick={() => console.log('upgrade cabin')}
                ></div>
              }
              {frameData && frameData.id == 1 && frameData.level == 2 &&
                <>
                  <div className="btnUpgradeRed"></div>
                </>
              }
              {frameData && frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && !frameData.unique_id &&
                <>
                    <div className="btnBuild"
                      onClick={() => showBuildingCursor(frameData.id as number)}
                    ></div>
                </>
              } 
              {frameData && frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.unique_id &&
                <>
                    <div className="btnUpgradeRed"></div>
                </>
              }
            </div>
            <div className="relative flex jutify-center items-center inline-block" style={{ width: "60px", height: "80px", paddingTop: "10px" }} >
              {frameData && frameData.id && (!frameData.unique_id || frameData.id == 2 || frameData.id == 3 || frameData.id == 20) && costUpdate && costUpdate.length >= 6 && costUpdate[5] &&
                <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "-77px" }}>{costUpdate[5][1]}</div>
                  <div className={"mb-3 small"+`${costUpdate[5][0]}`} style={{ position: "absolute", top: "-39px", left: "-82px" }}></div>
                </div>
              }
              {frameData && frameData.id && (!frameData.unique_id || frameData.id == 2 || frameData.id == 3 || frameData.id == 20) && costUpdate && costUpdate.length >= 5 && costUpdate[4] &&
                <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "-37px" }}>{costUpdate[4][1]}</div>
                  <div className={"mb-3 small"+`${costUpdate[4][0]}`} style={{ position: "absolute", top: "-39px", left: "-43px" }}></div>
                </div>
              }
              {frameData && frameData.id && (!frameData.unique_id || frameData.id == 2 || frameData.id == 3 || frameData.id == 20) && costUpdate && costUpdate.length >= 4 && costUpdate[3] &&
                <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "-1px" }}>{costUpdate[3][1]}</div>
                  <div className={"mb-3 small"+`${costUpdate[3][0]}`} style={{ position: "absolute", top: "-39px", left: "-10px" }}></div>
                </div>
              }
              {frameData && frameData.id && (!frameData.unique_id || frameData.id == 2 || frameData.id == 3 || frameData.id == 20) && costUpdate && costUpdate.length >= 3 && costUpdate[2] &&
                <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "32px" }}>{costUpdate[2][1]}</div>
                  <div className={"mb-3 small"+`${costUpdate[2][0]}`} style={{ position: "absolute", top: "-39px", left: "25px" }}></div>
                </div>
              }
              {frameData && frameData.id && (!frameData.unique_id || frameData.id == 2 || frameData.id == 3 || frameData.id == 20) && costUpdate && costUpdate[1] &&
                <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "70px" }}>{costUpdate[1][1]}</div>
                  <div className={"mb-3 small"+`${costUpdate[1][0]}`} style={{ position: "absolute", top: "-39px", left: "61px" }}></div>
                </div>
              }
              {frameData && frameData.id && (!frameData.unique_id || frameData.id == 2 || frameData.id == 3 || frameData.id == 20) && costUpdate && costUpdate[0] &&
                <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "105px" }}>{costUpdate[0][1]}</div>
                    <div className={"mb-3 small"+`${costUpdate[0][0]}`} style={{ position: "absolute", top: "-39px", left: "97px" }}></div>
                </div>
              }
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-2" style={{ height: "30px", marginLeft: "205px" }}> */}
        <div className={"grid grid-cols-2 "+`${frameData && frameData.id && (frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.id != 4 && frameData.id != 5) && frameData.unique_id ? "l1R" : "l1noR" }`}>
          <div className="relative flex jutify-center items-center inline-block" style={{ width: "60px", paddingTop: "10px" }}>
          {frameData && frameData.id && dailyCosts && dailyCosts.length == 4 && dailyCosts[3] &&
              <div className="flex flex-row justify-center inline-block relative">
                <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "15px" }}>{dailyCosts[3][1]}</div>
                <div className={"mb-3 small"+`${dailyCosts[3][0]}`} style={{ position: "absolute", top: "-39px", left: "3px" }}></div>
              </div>
            }
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
        {/* <div className="grid grid-cols-2" style={{ height: "30px", marginLeft: "205px" }}> */}
        <div className={"grid grid-cols-2 "+`${frameData && frameData.id && (frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.id != 4 && frameData.id != 5) && frameData.unique_id ? "l2R" : "l2noR" }`}>
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
        {/* Pour les buildings qui sont rechargeables */}
        {frameData && frameData.id && (frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.id != 4 && frameData.id != 5) &&
          frameData.unique_id && 
          <>
            <div className="grid grid-cols-2" style={{ height: "28px", marginTop: '-10px', marginLeft: "181px" }}>
              <div className="relative flex jutify-center items-center inline-block fontHPxl" style={{ width: "100px", paddingTop: "7px", fontSize: '19px' }}>
                {buildingData && buildingData.active && buildingData.active[frameData.unique_id as any] ? buildingData.active[frameData.unique_id as any]['recharges'] : 0}
              </div>
            </div>

            <div className="grid grid-cols-2" style={{ height: "55px", marginLeft: "0px", pointerEvents: "all" }}>
              {buildingData && buildingData.active && buildingData.active[frameData.unique_id as any] ? 
                <div>
                  <div className="btnFuelProd pixelated" onClick={() => console.log('fuelProd')} style={{marginTop: '-9px', marginLeft: '-18px'}}></div>
                  {inputFuel == 1 || inputFuel == 10 || inputFuel == 100 ? 
                    <div style={{height: "41px"}} onClick={() => updateInputFuel()} ><div className={"pixelated btnInput"+`${inputFuel}`} style={{marginTop: '-100px', marginLeft: "30px"}}></div></div>
                    : 
                    <div style={{height: "41px"}} onClick={() => updateInputFuel()} ><div className="pixelated btnInputMax" style={{marginTop: '-100px', marginLeft: "30px"}}></div></div>
                  }
                </div>
              :
                <>
                  <div>
                    <div className="btnStartProd pixelated" onClick={() => console.log('startProd')} style={{marginTop: '-9px', marginLeft: '-18px'}}></div>
                    {inputFuel == 1 || inputFuel == 10 || inputFuel == 100 ? 
                      <div style={{height: "41px"}} onClick={() => updateInputFuel()} ><div className={"pixelated btnInput"+`${inputFuel}`} style={{marginTop: '-100px', marginLeft: "30px"}}></div></div>
                      : 
                      <div style={{height: "41px"}} onClick={() => updateInputFuel()} ><div className="pixelated btnInputMax" style={{marginTop: '-100px', marginLeft: "30px"}}></div></div>
                    }
                  </div>
                </>
              }
              <div className="relative flex jutify-center items-center inline-block" style={{ width: "60px", marginTop: "-30px" }}>
                {frameData && frameData.id && dailyCosts && dailyCosts.length == 4 && dailyCosts[3] &&
                  <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "-10px" }}>{dailyCosts[3][1] * inputFuel}</div>
                    <div className={"mb-3 small"+`${dailyCosts[3][0]}`} style={{ position: "absolute", top: "-39px", left: "3px" }}></div>
                  </div>
                }
                {frameData && frameData.id && dailyCosts && dailyCosts.length == 3 && dailyCosts[2] &&
                <div className="flex flex-row justify-center inline-block relative">
                  <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "1px" }}>{dailyCosts[2][1] * inputFuel}</div>
                  <div className={"mb-3 small"+`${dailyCosts[2][0]}`} style={{ position: "absolute", top: "-39px", left: "3px" }}></div>
                </div>
                }
                {frameData && frameData.id && dailyCosts && dailyCosts[1] &&
                  <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "50px" }}>{dailyCosts[1][1] * inputFuel}</div>
                    <div className={"mb-3 small"+`${dailyCosts[1][0]}`} style={{ position: "absolute", top: "-39px", left: "52px" }}></div>
                  </div>
                }
                {frameData && frameData.id && dailyCosts && dailyCosts[0] &&
                  <div className="flex flex-row justify-center inline-block relative">
                      <div className="fontHPxl-sm" style={{ position: "absolute", top: "-15px", left: "95px" }}>{dailyCosts[0][1] * inputFuel}</div>
                      <div className={"mb-3 small"+`${dailyCosts[0][0]}`} style={{ position: "absolute", top: "-39px", left: "97px" }}></div>
                  </div>
                }
              </div>
            </div>

          </>
        }
        {/* <div className="grid grid-cols-2" style={{ height: "30px", marginLeft: "15px" }}>
          <div className="btnUpgradeRed"></div>
          <div className="relative flex jutify-center items-center inline-block" style={{ width: "60px", paddingTop: "10px" }}>
          
          
          </div>
        </div> */}
      </div> 
    </>
  );
}
