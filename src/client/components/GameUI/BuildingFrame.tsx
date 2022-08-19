import { useStarknet, useStarknetBlock } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { useSelectContext } from "../../hooks/useSelectContext";
import useHarvestResource from "../../hooks/invoke/useHarvestResource";
import useDestroy from "../../hooks/invoke/useDestroy";
import { allBuildings } from "../../data/buildings";

// Test
// import { useWorldsContract } from '../../hooks/contracts/worlds'
// import useTest from "../../hooks/invoke/useTest";
import useResourcesContext from "../../hooks/useResourcesContext";
import useUpgrade from "../../hooks/invoke/useUpgrade";
import useRecharge from "../../hooks/invoke/useRecharge";
import { FrameItem } from "./FrameItem";


export function BuildingFrame(props: any) {
  const { tokenId, address, setAddress, updateTokenId, mapArray, buildingData, harvestingArr, setHarvesting } = useGameContext();
  const { frensCoins, energy, wood, rock, metal, coal, populationBusy, populationFree, meat, cereal, resources} = useResourcesContext();
  const { account } = useStarknet();
  const { showFrame, frameData, updateBuildingFrame } = useSelectContext();
  const { frontBlockArray } = props
  const { data: block } = useStarknetBlock()
  const { nonce, updateNonce } = useGameContext();

  // Test
  // const { contract: worlds } = useWorldsContract();
  // const [watch, setWatch] = useState(true);
  // end test

  // const activeNotifications = useActiveNotifications()
  const harvestingInvoke = useHarvestResource()
  // const [ harvesting, setHarvesting ] = useState<any>(null)
  const upgradingInvoke = useUpgrade()
  // const [ upgrading, setUpgrading ] = useState<any>(null)
  const rechargingInvoke = useRecharge()
  // const [ recharging, setRecharging ] = useState<any>(null)
  const detroyingInvoke = useDestroy()
  // const [ destroying, setDestroying ] = useState<any>(null)
  // const [ message, setMessage ] = useState("")

  const [ costUpdate, setCostUpdate ] = useState<any>(null)
  const [ dailyCosts, setDailyCosts ] = useState<any>(null)
  const [ dailyHarvest, setDailyHarvests ] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [inputFuel, setInputFuel] = useState(1)
  const [harvestTreeNb, setHarvestTreeNb] = useState(0)
  const [harvestRockNb, setHarvestRockNb] = useState(0)
  const [harvestMineNb, setHarvestMineNb] = useState(0)

  useEffect(() => {
    if (showFrame) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [show, showFrame, frameData])

  const nonceValue = useMemo(() => {
    console.log('new nonce value', nonce)
    return nonce
  }, [nonce])

  const harvestingArrValue = useMemo(() => {
    console.log('new havestingArr Value', harvestingArr)
    return harvestingArr
  }, [harvestingArr])

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
      if ((type_id == 2 && harvestRockNb <= 3) || (type_id == 3 && harvestTreeNb <= 3) || (type_id == 20 && harvestMineNb <= 3) || (type_id == 27)) {
        let tx_hash = harvestingInvoke(tokenId, pos_start, parseInt(frameData?.unique_id as string), type_id, level, pos_x, pos_y, nonceValue)
        // if (type_id == 2) setHarvestRockNb(harvestRockNb+1)
        // if (type_id == 3) setHarvestTreeNb(harvestTreeNb+1)
        // if (type_id == 20) setHarvestMineNb(harvestMineNb+1)

        tx_hash.then((res) => {
          console.log('res', res)
          if (res != 0) {
            updateNonce(nonceValue)
            // Change status of harvesting to 0
            setHarvesting(pos_x, pos_y, 0)
          }
        })
      }
      // setHarvesting(tx_hash);
    } else {
      console.log('Missing tokenId')
    }
  }

  const upgradeBuilding = (type_id : number, pos_x: number, pos_y: number, level : number) => {
    let pos_start = (pos_y - 1) * 40 + pos_x
    console.log('pos_start', pos_start)
    if (tokenId) {
      let tx_hash = upgradingInvoke(tokenId, pos_start, parseInt(frameData?.unique_id as string), type_id, level, pos_x, pos_y, nonceValue)
      console.log('tx hash upgrade', tx_hash)
      // setUpgrading(tx_hash);

      tx_hash.then((res) => {
        console.log('res', res)
        if (res != 0) {
          updateNonce(nonceValue)
          setHarvesting(pos_x, pos_y, 0)
        }
      })
    } else {
      console.log('Missing tokenId')
    }
  }

  const fuelProd = (nb_days: number, type_id: number, pos_x: number, pos_y: number, uniqueId: number) => {
    let pos_start = (pos_y - 1) * 40 + pos_x
    console.log('pos_start', pos_start)
    if (tokenId) {
      // tokenId : number, pos_start: number, nb_days: number, building_type_id: number, posX: number, posY: number, uniqueId: number
      let tx_hash = rechargingInvoke(tokenId, pos_start, nb_days, type_id, pos_x, pos_y, uniqueId, nonceValue)
      console.log('tx hash recharging', tx_hash)
      // setUpgrading(tx_hash);

      tx_hash.then((res) => {
        console.log('res', res)
        if (res != 0) {
          updateNonce(nonceValue)
        }
      })
    } else {
      console.log('Missing tokenId')
    }
  }

  const destroyBuilding = (type_id : number, pos_x: number, pos_y: number) => {
    let pos_start = (pos_y - 1) * 40 + pos_x
    console.log('pos_start', pos_start)
    if (tokenId) {
      let tx_hash = detroyingInvoke(tokenId, pos_start, type_id, pos_x, pos_y, parseInt(frameData?.unique_id as string), nonceValue)
      console.log('tx hash destroy', tx_hash)
      // setDestroying(tx_hash);

      tx_hash.then((res) => {
        console.log('res', res)
        if (res != 0) {
          updateNonce(nonceValue)
          setHarvesting(pos_x, pos_y, 0)
        }
      })
    } else {
      console.log('Missing tokenId')
    }
  }

  useEffect(() => {
    if (frameData && frameData.id && frameData.level) {
      var newCost : any[] = [];
      if (allBuildings[frameData.id - 1].cost_update) {
        allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1].resources.forEach((cost : any) => {
          newCost.push([cost.id, cost.qty])
        })
      }
      setCostUpdate(newCost)
    }
  }, [frameData])

  useEffect(() => {
    if (frameData && frameData.id && frameData.level) {
      var newDailyHarvest : any[] = [];
      if (allBuildings[frameData.id - 1].daily_harvest) {
        allBuildings[frameData.id - 1].daily_harvest?.[frameData.level - 1].resources.forEach((harvest : any) => {
          newDailyHarvest.push([harvest.id, harvest.qty])
        })
      }
      setDailyHarvests(newDailyHarvest)
    }
  }, [frameData])

  useEffect(() => {
    if (frameData && frameData.id && frameData.level) {
      var newDailyCost : any[] = [];  
      if (allBuildings[frameData.id - 1].daily_cost) {
        allBuildings[frameData.id - 1].daily_cost?.[frameData.level - 1].resources.forEach((cost : any) => {
          newDailyCost.push([cost.id, cost.qty])
        })
      }
      setDailyCosts(newDailyCost)
    }
  }, [frameData])

  // TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST  TEST TEST TEST TEST TEST TEST TEST TEST TEST
  // const generateTest = useTest()
  // const [testing, setTesting] = useState<any>(null)
  // const testContract = async (unique_id : any, id : number, posX : number, posY : number) => {
  //   console.log("invoking test", account);
  //   let tx_hash = await generateTest(unique_id, id, posX, posY, frontBlockArray[posY][posX][7])
  //   console.log('tx hash', tx_hash)
  //   setTesting(tx_hash);
  // };

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
      <div id="bFrame" 
        className={"selectDisable absolute "+`${frameData && frameData.id && (frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.id != 27 && frameData.id != 4 && frameData.id != 5) && frameData.unique_id ? "buildingFrameRecharged" : "buildingFrame" }`}
      >
        {frameData && frameData.unique_id && (frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.id != 27) && <div className="btnDestroy absolute" onClick={() => destroyBuilding(frameData?.id as number, frameData?.posX, frameData?.posY)}></div>}
        <div className='btnCloseFrame' onClick={() => updateBuildingFrame(false, {"id": 0, "level": 0, "posX": 0, "posY": 0, "selected": 0})}></div>
        <div className="grid grid-cols-2 inline-block" style={{ height: "20px" }}>
          <div className="font8BITWonder uppercase text-center" style={{ height: "20px" }} >
            { frameData && frameData.id ? allBuildings[frameData.id - 1].name : ""}
          </div>
          <div className="relative flex jutify-center items-center inline-block" style={{ paddingLeft: "8px" }}>
                {frameData && frameData.id && frameData.level && allBuildings[frameData.id - 1].cost_update && allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1].pop_min && (!frameData.unique_id) ?
                <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-9px", left: "100px" }}>
                      {allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1].pop_min}
                    </div>
                    <div className={"mb-3 small12"} style={{ position: "absolute", top: "-34px", left: "105px" }}></div>
                </div> : ''
                }
                {frameData && frameData.id && frameData.level && allBuildings[frameData.id - 1].cost_update?.[0].new_pop != null && allBuildings[frameData.id - 1].cost_update?.[0].new_pop != 0 && (!frameData.unique_id) ?
                <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-9px", left: "46px" }}>+{allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1].new_pop}</div>
                    <div className={"mb-3 small12"} style={{ position: "absolute", top: "-34px", left: "45px" }}></div>
                </div> : ''
                }
                {frameData && frameData.id && frameData.level && allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1].pop_min != null && allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1].pop_min != 0 && frameData.unique_id ?
                <div className="flex flex-row justify-center inline-block relative">
                    <div className="fontHPxl-sm" style={{ position: "absolute", top: "-9px", left: "46px" }}>{allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1].pop_min}</div>
                    <div className={"mb-3 small12"} style={{ position: "absolute", top: "-34px", left: "45px" }}></div>
                </div> : ''
                }
          </div>
        </div>
        <div className="relative flex jutify-center items-center inline-block" style={{ height: "85px" }}>
          <div className="flex flex-row justify-center inline-block relative">
            <div  className="font04B text-center mx-auto relative"  style={{width: "68px"}}>
              <div className={"building"+`${frameData?.id}`} style={{left: "-26px", top: "-39px", position: "absolute"}}></div>
              </div>
            <div className="font04B text-center mx-auto" style={{fontSize: "12px", paddingTop: "34px", width: "85px"}}>
              {frameData && frameData.id ? allBuildings[frameData.id - 1].name : 0}
            </div>
            <div className="font04B mx-auto text-center" style={{   fontSize: "12px",   paddingTop: "34px",   width: "67px", }}>
              {frameData && frameData.posX && frameData.posY ? frontBlockArray[frameData?.posY][frameData?.posX][7] : 1}
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
          {frameData && frameData.id ? allBuildings[frameData.id - 1].description : ""}
        </div>
        <div className="relative flex jutify-center items-center inline-block" style={{ height: "45px", paddingTop: "8px", pointerEvents: "all" }}>
          <div className="flex flex-row justify-center inline-block">
            <div style={{ width: "135px", paddingTop: "10px" }}>
              {frameData && (frameData.id == 2 || frameData.id == 3 || frameData.id == 20 || frameData.id == 27 ) &&
                <>
                  {harvestingArrValue && harvestingArrValue.length > 0 && harvestingArr[frameData.posY] && harvestingArr[frameData.posY][frameData.posX] == 0 ?
                    <div className="btnHarvestDisabled"></div>

                  :
                    <div className="btnHarvest" onClick={() => harvestingResources(frameData.id as number, frameData.posX, frameData.posY, frameData.level as number)}></div>
                  }
                </>
              }
              {frameData && frameData.id == 1 && frameData.level == 1 &&
                  <div className="btnUpgrade"
                  onClick={() => upgradeBuilding(frameData.id as number, frameData.posX, frameData.posY, frameData.level as number)}
                ></div>
              }
              {frameData && frameData.id == 1 && frameData.level == 2 &&
                <>
                  <div className="btnUpgradeRed"></div>
                </>
              }
              {frameData && frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.id != 27 && !frameData.unique_id &&
                <>
                    <div className="btnBuild"
                      onClick={() => showBuildingCursor(frameData.id as number)}
                    ></div>
                </>
              } 
              {frameData && frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.id != 27 && frameData.unique_id &&
                <>
                    <div className="btnUpgradeRed"></div>
                </>
              }
            </div>
            {frameData && frameData.id && (!frameData.unique_id || frameData.id == 2 || frameData.id == 3 || frameData.id == 20 || frameData.id == 27) && costUpdate && costUpdate.length > 0 &&
            
              <div className="relative flex justify-end items-center inline-block" style={{ width: "201px", height: "80px", paddingTop: "10px" }} >

                {Object.keys(costUpdate).map((elem : any) => {
                  return <FrameItem key={elem} content={costUpdate[elem]} option={1} />           
                })}
              </div>
            }
            {frameData && frameData.id && frameData.unique_id && frameData.id == 1 && costUpdate && costUpdate.length > 0 &&
            
            <div className="relative flex justify-end items-center inline-block" style={{ width: "201px", height: "80px", paddingTop: "10px" }} >

              {Object.keys(costUpdate).map((elem : any) => {
                return <FrameItem key={elem} content={costUpdate[elem]} option={1} />           
              })}
            </div>
          }
          </div>
        </div>

        {/* <div className={"grid grid-cols-2 "+`${frameData && frameData.id && (frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.id != 27 && frameData.id != 4 && frameData.id != 5) && frameData.unique_id ? "l1R" : "l1noR" }`}>
          <div className="relative flex justify-end items-center inline-block" style={{ width: "115px", marginTop: "-21px" }}>
            {frameData && frameData.id && dailyCosts && dailyCosts.length > 0 &&
              Object.keys(dailyCosts).map((elem : any) => {
                return <FrameItem key={elem} content={dailyCosts[elem]} option={1} />      
              })
            }
          </div>
        </div> */}
        <div className={"grid grid-cols-2 "+`${frameData && frameData.id && (frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.id != 27 && frameData.id != 4 && frameData.id != 5) && frameData.unique_id ? "l2R" : "l2noR" }`}>
          <div className="relative flex justify-end items-center inline-block" style={{ width: "122px", marginTop: "-22px" }}>

          {frameData && frameData.id && dailyHarvest && dailyHarvest.length > 0 &&
              Object.keys(dailyHarvest).map((elem : any) => {
                return <FrameItem key={elem} content={dailyHarvest[elem]} option={0} />      
              })
            }
          </div>
        </div>
        {/* Pour les buildings qui sont rechargeables */}
        {frameData && frameData.id && (frameData.id != 1 && frameData.id != 2 && frameData.id != 3 && frameData.id != 20 && frameData.id != 27 && frameData.id != 4 && frameData.id != 5) &&
          frameData.unique_id && 
          <>
            <div className="grid grid-cols-2" style={{ height: "28px", marginTop: '-10px', marginLeft: "190px" }}>
              <div className="relative flex jutify-center items-center inline-block fontHPxl" style={{ width: "100px", paddingTop: "7px", fontSize: '19px' }}>
                {buildingData && buildingData.active && buildingData.active[frameData.unique_id as any] ? buildingData.active[frameData.unique_id as any]['recharges'] : 0}
              </div>
            </div>

            <div className="grid grid-cols-2" style={{ height: "55px", marginLeft: "0px", pointerEvents: "all" }}>
              {buildingData && buildingData.active && buildingData.active[frameData.unique_id as any] ? 
                <div>
                  <div 
                    className="btnFuelProd pixelated" 
                    onClick={() => fuelProd(inputFuel, frameData.id as number, frameData.posX, frameData.posY, frameData.unique_id as any)}
                    style={{marginTop: '-9px', marginLeft: '-18px'}}
                  ></div>
                  {inputFuel == 1 || inputFuel == 10 || inputFuel == 100 ? 
                    <div style={{height: "42px", marginTop: '-23px', marginLeft: '30px', pointerEvents: 'all'}} onClick={() => updateInputFuel()} ><div className={"pixelated btnInput"+`${inputFuel}`} style={{marginTop: '-25px', pointerEvents: 'none'}}></div></div>
                    : 
                    <div style={{height: "42px", marginTop: '-23px', marginLeft: '30px', pointerEvents: 'all'}} onClick={() => updateInputFuel()} ><div className="pixelated btnInputMax" style={{marginTop: '-25px', pointerEvents: 'none'}}></div></div>
                  }
                </div>
              :
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
              }
              <div className="relative flex justify-end items-center inline-block" style={{ width: "145px", marginTop: "-30px" }}>

                {frameData && frameData.id && dailyCosts && dailyCosts.length > 0 &&
                  Object.keys(dailyCosts).map((elem : any) => {
                    return <FrameItem key={elem} content={dailyCosts[elem]} inputFuel={inputFuel} option={1} />      
                  })
                }
              </div>
            </div>

          </>
        }
      </div> 
    </>
  );
}
