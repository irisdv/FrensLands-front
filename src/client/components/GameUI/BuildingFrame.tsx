import { useStarknet, useStarknetBlock } from '@starknet-react/core'
import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useGameContext } from '../../hooks/useGameContext'
import { useSelectContext } from '../../hooks/useSelectContext'
import useHarvestResource from '../../hooks/invoke/useHarvestResource'
import useDestroy from '../../hooks/invoke/useDestroy'
import { allBuildings } from '../../data/buildings'

// Test
// import { useWorldsContract } from '../../hooks/contracts/worlds'
// import useTest from "../../hooks/invoke/useTest";
import useResourcesContext from '../../hooks/useResourcesContext'
import useUpgrade from '../../hooks/invoke/useUpgrade'
import useRecharge from '../../hooks/invoke/useRecharge'
import { FrameItem } from './FrameItem'

export function BuildingFrame (props: any) {
  const {
    tokenId,
    address,
    setAddress,
    updateTokenId,
    mapArray,
    buildingData,
    harvestingArr,
    setHarvesting
  } = useGameContext()
  const {
    frensCoins,
    energy,
    wood,
    rock,
    metal,
    coal,
    populationBusy,
    populationFree,
    meat,
    cereal,
    resources
  } = useResourcesContext()
  const { account } = useStarknet()
  const { showFrame, frameData, updateBuildingFrame } = useSelectContext()
  const { frontBlockArray } = props
  const { data: block } = useStarknetBlock()
  const { nonce, updateNonce } = useGameContext()
  const [canBuild, setCanBuild] = useState(1)
  const [msg, setMsg] = useState('')
  const [showNotif, setShowNotif] = useState(false)

  const harvestingInvoke = useHarvestResource()
  const upgradingInvoke = useUpgrade()
  const rechargingInvoke = useRecharge()
  const detroyingInvoke = useDestroy()

  const [costUpdate, setCostUpdate] = useState<any>(null)
  const [dailyCosts, setDailyCosts] = useState<any>(null)
  const [dailyHarvest, setDailyHarvests] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [inputFuel, setInputFuel] = useState(1)

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

  useEffect(() => {
    if (account) {
      setAddress(account)
    }
  }, [account])

  useEffect(() => {
    if (account && !tokenId) {
      updateTokenId(account)
    }
  }, [account, tokenId])

  const harvestingResources = (
    type_id: number,
    pos_x: number,
    pos_y: number,
    level: number
  ) => {
    const pos_start = (pos_y - 1) * 40 + pos_x
    if (tokenId) {
      if (type_id == 2 || type_id == 3 || type_id == 20 || type_id == 27) {
        const tx_hash = harvestingInvoke(
          tokenId,
          pos_start,
          parseInt(frameData?.unique_id as string),
          type_id,
          level,
          pos_x,
          pos_y,
          nonceValue
        )

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

  const upgradeBuilding = (
    type_id: number,
    pos_x: number,
    pos_y: number,
    level: number
  ) => {
    const pos_start = (pos_y - 1) * 40 + pos_x
    console.log('pos_start', pos_start)
    if (tokenId) {
      const tx_hash = upgradingInvoke(
        tokenId,
        pos_start,
        parseInt(frameData?.unique_id as string),
        type_id,
        level,
        pos_x,
        pos_y,
        nonceValue
      )
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

  const fuelProd = (
    nb_days: number,
    type_id: number,
    pos_x: number,
    pos_y: number,
    uniqueId: number
  ) => {
    const pos_start = (pos_y - 1) * 40 + pos_x
    console.log('pos_start', pos_start)
    if (tokenId) {
      // tokenId : number, pos_start: number, nb_days: number, building_type_id: number, posX: number, posY: number, uniqueId: number
      const tx_hash = rechargingInvoke(
        tokenId,
        pos_start,
        nb_days,
        type_id,
        pos_x,
        pos_y,
        uniqueId,
        nonceValue
      )
      console.log('tx hash recharging', tx_hash)

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

  const destroyBuilding = (type_id: number, pos_x: number, pos_y: number) => {
    const pos_start = (pos_y - 1) * 40 + pos_x
    console.log('pos_start', pos_start)
    if (tokenId) {
      const tx_hash = detroyingInvoke(
        tokenId,
        pos_start,
        type_id,
        pos_x,
        pos_y,
        parseInt(frameData?.unique_id as string),
        nonceValue
      )
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
    if (frameData != null && frameData.id && frameData.level) {
      const newCost: any[] = []
      let _canBuild = 1
      let _msg = ''
      if (allBuildings[frameData.id - 1].cost_update != null) {
        allBuildings[frameData.id - 1].cost_update?.[
          frameData.level - 1
        ].resources.forEach((cost: any) => {
          newCost.push([cost.id, cost.qty])
          if (resources[cost.id] < cost.qty) {
            _canBuild = 0
          }
        })
        if (!_canBuild) _msg += 'Not enough resources. '
        if (
          populationFree &&
          allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1]
            .pop_min
        ) {
          // @ts-expect-error
          const pop_min: number =
            allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1]
              .pop_min
          if (pop_min >= populationFree) {
            _canBuild = 0
            _msg += 'Not enough free frens.'
          }
        }
      }
      console.log('_canBuild', _canBuild)
      setCanBuild(_canBuild)
      setMsg(_msg)
      console.log('message cost update', _msg)
      setCostUpdate(newCost)
    }
  }, [frameData])

  useEffect(() => {
    if (frameData != null && frameData.id && frameData.level) {
      const newDailyHarvest: any[] = []
      if (allBuildings[frameData.id - 1].daily_harvest != null) {
        allBuildings[frameData.id - 1].daily_harvest?.[
          frameData.level - 1
        ].resources.forEach((harvest: any) => {
          newDailyHarvest.push([harvest.id, harvest.qty])
        })
      }
      setDailyHarvests(newDailyHarvest)
    }
  }, [frameData])

  useEffect(() => {
    if (frameData != null && frameData.id && frameData.level) {
      const newDailyCost: any[] = []
      let _canPay = 1
      let _msg = ''
      if (allBuildings[frameData.id - 1].daily_cost != null) {
        allBuildings[frameData.id - 1].daily_cost?.[
          frameData.level - 1
        ].resources.forEach((cost: any) => {
          newDailyCost.push([cost.id, cost.qty])
          if (resources[cost.id] < cost.qty) {
            _canPay = 0
          }
        })
        if (!_canPay) _msg += 'Not enough resources. '
        if (
          populationFree &&
          allBuildings[frameData.id - 1].daily_cost?.[frameData.level - 1]
            .pop_min
        ) {
          // @ts-expect-error
          const pop_min: number =
            allBuildings[frameData.id - 1].daily_cost?.[frameData.level - 1]
              .pop_min
          if (populationFree < pop_min) {
            _canPay = 0
            _msg += 'Not enough free frens.'
          }
        }
      }
      setCanBuild(_canPay)
      setMsg(_msg)
      console.log('message daily cost', _msg)
      setDailyCosts(newDailyCost)
    }
  }, [frameData])

  const showBuildingCursor = (id: any) => {
    updateBuildingFrame(false, {
      id,
      level: frameData?.level,
      posX: 0,
      posY: 0,
      selected: 1
    })
  }

  const updateInputFuel = () => {
    if (inputFuel == 1) {
      setInputFuel(10)
    } else if (inputFuel == 10) {
      setInputFuel(100)
    } else if (inputFuel == 100) {
      let max = 100000000
      dailyCosts.forEach((element: any) => {
        if (element[0] == 1 && wood != null) {
          var res = parseInt((wood / element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 2 && rock != null) {
          var res = parseInt((rock / element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 3 && meat != null) {
          var res = parseInt((meat / element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 5 && cereal != null) {
          var res = parseInt((10 / element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 6 && metal != null) {
          var res = parseInt((metal / element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 8 && coal != null) {
          var res = parseInt((coal / element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 10 && frensCoins != null) {
          var res = parseInt((frensCoins / element[1]).toFixed(0))
          if (res < max) max = res
        }
        if (element[0] == 11 && energy != null) {
          var res = parseInt((energy / element[1]).toFixed(0))
          if (res < max) max = res
        }
      })
      setInputFuel(max)
    } else {
      setInputFuel(1)
    }
  }

  if (!showFrame) {
    return <></>
  }
  if (frameData?.id == 0) {
    return <></>
  }

  return (
    <>
      <div
        id="bFrame"
        className={
          'selectDisable absolute ' +
          `${
            frameData != null &&
            frameData.id &&
            frameData.id != 1 &&
            frameData.id != 2 &&
            frameData.id != 3 &&
            frameData.id != 20 &&
            frameData.id != 27 &&
            frameData.id != 4 &&
            frameData.id != 5 &&
            frameData.id != 22 &&
            frameData.unique_id
              ? 'buildingFrameRecharged'
              : frameData?.id == 2 ||
                frameData?.id == 3 ||
                frameData?.id == 20 ||
                frameData?.id == 27
              ? 'harvestFrame'
              : 'buildingFrame'
          }`
        }
      >
        {frameData != null &&
          frameData.unique_id &&
          frameData.id != 1 &&
          frameData.id != 2 &&
          frameData.id != 3 &&
          frameData.id != 20 &&
          frameData.id != 27 &&
          frameData.id != 4 &&
          frameData.id != 5 &&
          frameData.id != 22 && (
            <div
              className="btnDestroy absolute"
              onClick={() =>
                destroyBuilding(
                  frameData?.id as number,
                  frameData?.posX,
                  frameData?.posY
                )
              }
              style={{ right: '135px', bottom: '280px' }}
            ></div>
        )}
        {frameData != null &&
          frameData.unique_id &&
          (frameData.id == 4 || frameData.id == 5 || frameData.id == 22) && (
            <div
              className="btnDestroy absolute"
              onClick={() =>
                destroyBuilding(
                  frameData?.id as number,
                  frameData?.posX,
                  frameData?.posY
                )
              }
              style={{ right: '135px', bottom: '207px' }}
            ></div>
        )}
        <div
          className="btnCloseFrame"
          onClick={() =>
            updateBuildingFrame(false, {
              id: 0,
              level: 0,
              posX: 0,
              posY: 0,
              selected: 0
            })
          }
        ></div>
        <div
          className="grid grid-cols-2 inline-block"
          style={{ height: '20px', pointerEvents: 'all' }}
        >
          <div
            className="font8BITWonder uppercase text-center"
            style={{ height: '20px' }}
          >
            {frameData != null && frameData.id
              ? allBuildings[frameData.id - 1].name
              : ''}
          </div>
          <div
            className="relative flex jutify-center items-center inline-block"
            style={{ paddingLeft: '8px' }}
          >
            {frameData != null &&
            frameData.id &&
            frameData.level &&
            allBuildings[frameData.id - 1].cost_update != null &&
            allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1]
              .pop_min &&
            !frameData.unique_id
              ? (
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: 'absolute', top: '-9px', left: '100px' }}
                >
                  {
                    allBuildings[frameData.id - 1].cost_update?.[
                      frameData.level - 1
                    ].pop_min
                  }
                </div>
                <div
                  className={'mb-3 small12'}
                  style={{ position: 'absolute', top: '-34px', left: '105px' }}
                ></div>
              </div>
                )
              : (
                  ''
                )}
            {frameData != null &&
            frameData.id &&
            frameData.level &&
            allBuildings[frameData.id - 1].cost_update?.[0].new_pop != null &&
            allBuildings[frameData.id - 1].cost_update?.[0].new_pop != 0 &&
            !frameData.unique_id
              ? (
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: 'absolute', top: '-9px', left: '46px' }}
                >
                  +
                  {
                    allBuildings[frameData.id - 1].cost_update?.[
                      frameData.level - 1
                    ].new_pop
                  }
                </div>
                <div
                  className={'mb-3 small12'}
                  style={{ position: 'absolute', top: '-34px', left: '45px' }}
                ></div>
              </div>
                )
              : (
                  ''
                )}
            {frameData != null &&
            frameData.id &&
            frameData.level &&
            allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1]
              .pop_min != null &&
            allBuildings[frameData.id - 1].cost_update?.[frameData.level - 1]
              .pop_min != 0 &&
            frameData.unique_id
              ? (
              <div className="flex flex-row justify-center inline-block relative">
                <div
                  className="fontHPxl-sm"
                  style={{ position: 'absolute', top: '-9px', left: '46px' }}
                >
                  {
                    allBuildings[frameData.id - 1].cost_update?.[
                      frameData.level - 1
                    ].pop_min
                  }
                </div>
                <div
                  className={'mb-3 small12'}
                  style={{ position: 'absolute', top: '-34px', left: '45px' }}
                ></div>
              </div>
                )
              : (
                  ''
                )}
          </div>
        </div>
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: '85px', pointerEvents: 'all' }}
        >
          <div className="flex flex-row justify-center inline-block relative">
            <div
              className="font04B text-center mx-auto relative"
              style={{ width: '68px' }}
            >
              <div
                className={'building' + `${frameData?.id}`}
                style={{ left: '-26px', top: '-39px', position: 'absolute' }}
              ></div>
            </div>
            <div
              className="font04B text-center mx-auto"
              style={{ fontSize: '12px', paddingTop: '34px', width: '85px' }}
            >
              {frameData != null && frameData.id
                ? allBuildings[frameData.id - 1].name
                : 0}
            </div>
            <div
              className="font04B mx-auto text-center"
              style={{ fontSize: '12px', paddingTop: '34px', width: '67px' }}
            >
              {frameData != null && frameData.posX && frameData.posY
                ? frontBlockArray[frameData?.posY][frameData?.posX][7]
                : 1}
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{ fontSize: '12px', paddingTop: '34px', width: '65px' }}
            >
              1 x 1
            </div>
            <div
              className="font04B text-center mx-auto relative"
              style={{ fontSize: '12px', paddingTop: '34px', width: '64px' }}
            >
              {frameData != null && frameData.posX && frameData.posY
                ? frameData.posX + ' ' + frameData.posY
                : ''}
            </div>
          </div>
        </div>
        <div
          className="font04B"
          style={{
            height: '109px',
            fontSize: '13px',
            paddingLeft: '9px',
            paddingTop: '6px',
            pointerEvents: 'all'
          }}
        >
          {frameData != null && frameData.id
            ? allBuildings[frameData.id - 1].description
            : ''}
        </div>
        <div
          className="relative flex jutify-center items-center inline-block"
          style={{ height: '45px', paddingTop: '8px', pointerEvents: 'all' }}
        >
          <div className="flex flex-row justify-center inline-block">
            <div style={{ width: '135px', paddingTop: '10px' }}>
              {frameData != null &&
                (frameData.id == 2 ||
                  frameData.id == 3 ||
                  frameData.id == 20 ||
                  frameData.id == 27) && (
                  <>
                    {(harvestingArrValue &&
                      harvestingArrValue.length > 0 &&
                      harvestingArr[frameData.posY] &&
                      harvestingArr[frameData.posY][frameData.posX] == 0) ||
                    !canBuild
                      ? (
                      <>
                        <div
                          className="btnHarvestDisabled"
                          onMouseOver={() => setShowNotif(true)}
                          onMouseOut={() => setShowNotif(false)}
                        ></div>
                        {showNotif && !canBuild && (
                          <div className="popUpBuild fontHPxl-sm pixelated">
                            {msg}
                          </div>
                        )}
                      </>
                        )
                      : (
                      <div
                        className="btnHarvest"
                        onClick={() =>
                          harvestingResources(
                            frameData.id as number,
                            frameData.posX,
                            frameData.posY,
                            frameData.level as number
                          )
                        }
                      ></div>
                        )}
                  </>
              )}
              {frameData != null &&
              frameData.id == 1 &&
              frameData.level == 1 &&
              canBuild
                ? (
                <>
                  <div
                    className="btnUpgrade"
                    onClick={() =>
                      upgradeBuilding(
                        frameData.id as number,
                        frameData.posX,
                        frameData.posY,
                        frameData.level as number
                      )
                    }
                  ></div>
                </>
                  )
                : frameData != null &&
                frameData.id == 1 &&
                frameData.level == 1 &&
                !canBuild
                  ? (
                <>
                  <div
                    className="btnUpgradeRed"
                    onMouseOver={() => setShowNotif(true)}
                    onMouseOut={() => setShowNotif(false)}
                  ></div>
                  {showNotif && !canBuild && (
                    <div className="popUpBuild fontHPxl-sm pixelated">
                      {msg}
                    </div>
                  )}
                </>
                    )
                  : (
                <></>
                    )}
              {frameData != null && frameData.id == 1 && frameData.level == 2 && (
                <>
                  <div className="btnUpgradeRed"></div>
                </>
              )}
              {frameData != null &&
              frameData.id != 1 &&
              frameData.id != 2 &&
              frameData.id != 3 &&
              frameData.id != 20 &&
              frameData.id != 27 &&
              !frameData.unique_id &&
              canBuild
                ? (
                <div
                  className="btnBuild"
                  onClick={() => showBuildingCursor(frameData.id as number)}
                ></div>
                  )
                : (
                <></>
                  )}
              {frameData != null &&
              frameData.id != 1 &&
              frameData.id != 2 &&
              frameData.id != 3 &&
              frameData.id != 20 &&
              frameData.id != 27 &&
              !frameData.unique_id &&
              !canBuild
                ? (
                <>
                  <div
                    className="btnBuildDisabled"
                    onMouseOver={() => setShowNotif(true)}
                    onMouseOut={() => setShowNotif(false)}
                  ></div>
                  {showNotif && (
                    <div className="popUpBuild fontHPxl-sm pixelated">
                      {msg}
                    </div>
                  )}
                </>
                  )
                : (
                <></>
                  )}
              {frameData != null &&
                frameData.id != 1 &&
                frameData.id != 2 &&
                frameData.id != 3 &&
                frameData.id != 20 &&
                frameData.id != 27 &&
                frameData.unique_id && (
                  <>
                    <div className="btnUpgradeRed"></div>
                  </>
              )}
            </div>
            {frameData != null &&
              frameData.id &&
              (!frameData.unique_id ||
                frameData.id == 2 ||
                frameData.id == 3 ||
                frameData.id == 20 ||
                frameData.id == 27) &&
              costUpdate &&
              costUpdate.length > 0 && (
                <div
                  className="relative flex justify-end items-center inline-block"
                  style={{ width: '201px', height: '80px', paddingTop: '10px' }}
                >
                  {Object.keys(costUpdate).map((elem: any) => {
                    return (
                      <FrameItem
                        key={elem}
                        content={costUpdate[elem]}
                        option={1}
                      />
                    )
                  })}
                </div>
            )}
            {frameData != null &&
              frameData.id &&
              frameData.unique_id &&
              frameData.id == 1 &&
              costUpdate &&
              costUpdate.length > 0 && (
                <div
                  className="relative flex justify-end items-center inline-block"
                  style={{ width: '201px', height: '80px', paddingTop: '10px' }}
                >
                  {Object.keys(costUpdate).map((elem: any) => {
                    return (
                      <FrameItem
                        key={elem}
                        content={costUpdate[elem]}
                        option={1}
                      />
                    )
                  })}
                </div>
            )}
          </div>
        </div>

        {frameData != null &&
        frameData.id &&
        frameData.id != 1 &&
        frameData.id != 4 &&
        frameData.id != 5 &&
        frameData.id != 22 &&
        frameData.id != 2 &&
        frameData.id != 3 &&
        frameData.id != 20 &&
        frameData.id != 27 &&
        !frameData.unique_id
          ? (
          <div className="grid grid-cols-2 l1noR">
            <div
              className="relative flex justify-end items-center inline-block"
              style={{ width: '115px', marginTop: '-21px' }}
            >
              {frameData &&
                frameData.id &&
                dailyCosts &&
                dailyCosts.length > 0 &&
                Object.keys(dailyCosts).map((elem: any) => {
                  return (
                    <FrameItem
                      key={elem}
                      content={dailyCosts[elem]}
                      option={1}
                    />
                  )
                })}
            </div>
          </div>
            )
          : (
          <></>
            )}
        {frameData != null &&
        frameData.id &&
        (frameData.id == 2 ||
          frameData.id == 3 ||
          frameData.id == 20 ||
          frameData.id == 27) &&
        frameData.unique_id
          ? (
          <div className="grid grid-cols-2 l1noR">
            <div
              className="relative flex justify-end items-center inline-block"
              style={{ width: '115px', marginTop: '-21px' }}
            >
              {frameData &&
                frameData.id &&
                dailyCosts &&
                dailyCosts.length > 0 &&
                Object.keys(dailyCosts).map((elem: any) => {
                  return (
                    <FrameItem
                      key={elem}
                      content={dailyCosts[elem]}
                      option={1}
                    />
                  )
                })}
            </div>
          </div>
            )
          : (
          <></>
            )}
        <div
          className={
            'grid grid-cols-2 ' +
            `${
              frameData != null &&
              frameData.id &&
              frameData.id != 1 &&
              frameData.id != 4 &&
              frameData.id != 5 &&
              frameData.id != 22 &&
              frameData.id != 2 &&
              frameData.id != 3 &&
              frameData.id != 20 &&
              frameData.id != 27 &&
              frameData.unique_id
                ? 'l2R'
                : frameData != null &&
                  frameData.id &&
                  (frameData?.id == 2 ||
                    frameData?.id == 3 ||
                    frameData?.id == 20 ||
                    frameData?.id == 27)
                ? 'l2H'
                : 'l2noR'
            }`
          }
        >
          <div
            className="relative flex justify-end items-center inline-block"
            style={{ width: '122px', marginTop: '-22px' }}
          >
            {frameData != null &&
              frameData.id &&
              dailyHarvest &&
              dailyHarvest.length > 0 &&
              Object.keys(dailyHarvest).map((elem: any) => {
                return (
                  <FrameItem
                    key={elem}
                    content={dailyHarvest[elem]}
                    option={0}
                  />
                )
              })}
          </div>
        </div>
        {/* Pour les buildings qui sont rechargeables */}
        {frameData != null &&
          frameData.id &&
          frameData.id != 1 &&
          frameData.id != 2 &&
          frameData.id != 3 &&
          frameData.id != 20 &&
          frameData.id != 27 &&
          frameData.id != 4 &&
          frameData.id != 5 &&
          frameData.id != 22 &&
          frameData.unique_id && (
            <>
              <div
                className="grid grid-cols-2"
                style={{
                  height: '28px',
                  marginTop: '-10px',
                  marginLeft: '190px'
                }}
              >
                <div
                  className="relative flex jutify-center items-center inline-block fontHPxl"
                  style={{
                    width: '100px',
                    paddingTop: '7px',
                    fontSize: '19px'
                  }}
                >
                  {/* {buildingData != null &&
                  buildingData.active != null &&
                  buildingData.active[frameData.unique_id as any] &&
                  buildingData.active[frameData.unique_id as any].recharges
                    ? buildingData.active[frameData.unique_id as any].recharges
                    : 0} */}
                </div>
              </div>

              <div
                className="grid grid-cols-2"
                style={{
                  height: '55px',
                  marginLeft: '0px',
                  pointerEvents: 'all'
                }}
              >
                {buildingData != null &&
                buildingData.active != null &&
                buildingData.active[frameData.unique_id as any]
                  ? (
                  <div>
                    <div
                      className="btnFuelProd pixelated"
                      onClick={() =>
                        fuelProd(
                          inputFuel,
                          frameData.id as number,
                          frameData.posX,
                          frameData.posY,
                          frameData.unique_id as any
                        )
                      }
                      style={{ marginTop: '-9px', marginLeft: '-18px' }}
                    ></div>
                    {inputFuel == 1 || inputFuel == 10 || inputFuel == 100
                      ? (
                      <div
                        style={{
                          height: '42px',
                          marginTop: '-23px',
                          marginLeft: '30px',
                          pointerEvents: 'all'
                        }}
                        onClick={() => updateInputFuel()}
                      >
                        <div
                          className={'pixelated btnInput' + `${inputFuel}`}
                          style={{ marginTop: '-25px', pointerEvents: 'none' }}
                        ></div>
                      </div>
                        )
                      : (
                      <div
                        style={{
                          height: '42px',
                          marginTop: '-23px',
                          marginLeft: '30px',
                          pointerEvents: 'all'
                        }}
                        onClick={() => updateInputFuel()}
                      >
                        <div
                          className="pixelated btnInputMax"
                          style={{ marginTop: '-25px', pointerEvents: 'none' }}
                        ></div>
                      </div>
                        )}
                  </div>
                    )
                  : (
                  <>
                    <div>
                      <div
                        className="btnStartProd pixelated"
                        onClick={() =>
                          fuelProd(
                            inputFuel,
                            frameData.id as number,
                            frameData.posX,
                            frameData.posY,
                            frameData.unique_id as any
                          )
                        }
                        style={{ marginTop: '-9px', marginLeft: '-18px' }}
                      ></div>
                      {inputFuel == 1 || inputFuel == 10 || inputFuel == 100
                        ? (
                        <div
                          style={{
                            height: '42px',
                            marginTop: '-23px',
                            marginLeft: '30px',
                            pointerEvents: 'all'
                          }}
                          onClick={() => updateInputFuel()}
                        >
                          <div
                            className={'pixelated btnInput' + `${inputFuel}`}
                            style={{
                              marginTop: '-25px',
                              pointerEvents: 'none'
                            }}
                          ></div>
                        </div>
                          )
                        : (
                        <div
                          style={{
                            height: '42px',
                            marginTop: '-23px',
                            marginLeft: '30px',
                            pointerEvents: 'all'
                          }}
                          onClick={() => updateInputFuel()}
                        >
                          <div
                            className="pixelated btnInputMax"
                            style={{
                              marginTop: '-25px',
                              pointerEvents: 'none'
                            }}
                          ></div>
                        </div>
                          )}
                    </div>
                  </>
                    )}
                <div
                  className="relative flex justify-end items-center inline-block"
                  style={{ width: '145px', marginTop: '-30px' }}
                >
                  {frameData &&
                    frameData.id &&
                    dailyCosts &&
                    dailyCosts.length > 0 &&
                    Object.keys(dailyCosts).map((elem: any) => {
                      return (
                        <FrameItem
                          key={elem}
                          content={dailyCosts[elem]}
                          inputFuel={inputFuel}
                          option={1}
                        />
                      )
                    })}
                </div>
              </div>
            </>
        )}
      </div>
    </>
  )
}
