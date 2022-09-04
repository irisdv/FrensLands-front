import { useStarknet, useStarknetBlock } from "@starknet-react/core";
import React, { useMemo, useState, useEffect } from "react";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";
import useClaim from "../../hooks/invoke/useClaim";
import useActiveNotifications from "../../hooks/useNotifications";
import Notifications from "../Notifications";
import { allBuildings } from "../../data/buildings";
import UI_Frames from '../../style/resources/front/Ui_Frames3.svg';

import useResourcesContext from "../../hooks/useResourcesContext";
import { useSelectContext } from "../../hooks/useSelectContext";
import useReinitialize from "../../hooks/invoke/useReinitialize";

export function MenuBar() {
  const {account} = useStarknet()
  const { data: block } = useStarknetBlock()

  const {tokenId, updateTokenId, setAddress, blockGame, buildingData, nonce, updateNonce, counterResources } = useGameContext();
  const {energy, frensCoins, wood, rock, coal, metal, populationBusy, populationFree, meat, cereal} = useResourcesContext();
  const { updateSound, sound } = useSelectContext()

  const claimingInvoke = useClaim()
  const activeNotifications = useActiveNotifications()

  const reinitializeInvoke = useReinitialize()

  const [ claiming, setClaiming ] = useState<any>(null)
  const [ btnClaim, setBtnClaim ] = useState(false)
  const [popUpInit, setPopUpInit] = useState(false)

  const [claimableResources, setClaimableResources] = useState<any[]>([])

    useEffect(() => {
      if (account) setAddress(account)
    }, [account])

    useEffect(() => {
      if (account && !tokenId) {
        updateTokenId(account);
      }
    }, [account, tokenId])
  
    // Invoke claim resources
    const claimResources = () => {
      if (tokenId) {
        let tx_hash = claimingInvoke(tokenId, nonceValue)
        setClaiming(tx_hash);

        tx_hash.then((res) => {
          console.log('res', res)
          if (res != 0) {
            updateNonce(nonceValue)
          }
        })
      } else {
        console.log('Missing tokenId')
      }
      setClaiming(true);
    };

    const nonceValue = useMemo(() => {
      console.log('new nonce value', nonce)
      return nonce
    }, [nonce])

    const reinitializeLand = () => {
      if (tokenId) {
        let tx_hash = reinitializeInvoke(tokenId, nonceValue)

        tx_hash.then((res) => {
          console.log('res', res)
          if (res != 0) {
            updateNonce(nonceValue)
          }
        })
      } else {
        console.log('Missing tokenId')
      }
    };

    const blockClaimable = useMemo(() => {
      if (buildingData) {
        let _newBlockClaimable = 0;
        // console.log('block', block?.block_number)
        // console.log('gameBlock', blockGame)

        let _resources : any[] = []

        buildingData.active?.forEach((elem : any) => {
          if (elem['recharges']) {
            // check lasr claim block number 
            // current block - last_claim block > then add recharges 
            if (block?.block_number) {
              var check = toBN(block?.block_number).toNumber() - elem['last_claim']
              var block2Claim = 0;
              if (check > elem['recharges']) {
                block2Claim = elem['recharges']
              } else {
                block2Claim = check
              }
              _newBlockClaimable += block2Claim

              console.log('block2Claim', block2Claim)
              console.log('_newBlockClaimable', _newBlockClaimable)
              
              // Get resources to harvest for each claimable building
              if (block2Claim > 0) {

                allBuildings[elem['type'] - 1].daily_harvest?.[0].resources.map((elem: any) => {
                // DB.buildings[elem['type']].daily_harvest.level[0].resources.map((elem: any) => {
                  let _currValue = 0
                  if (_resources[elem.id] && _resources[elem.id] > 0) {
                    _currValue =  _resources[elem.id] + (elem.quantity * block2Claim)
                  } else {
                    _currValue += (elem.quantity * block2Claim)
                  }
                  _resources[elem.id] = _currValue
                })
              }
            }
          }
        })
        console.log('resources', _resources)
        setClaimableResources(_resources)
        console.log('_newBlockClaimable', _newBlockClaimable)
        return _newBlockClaimable
      }
    }, [buildingData])

  // Btn Claim 
  useEffect(() => {
    if (block && blockGame) {
      let current_block = toBN(block?.block_number).toNumber()
      if (current_block >= blockGame) {
        setBtnClaim(true)
      } else {
        setBtnClaim(false)
      }
    }
  }, [block?.block_number, blockGame, claiming])

  return (
    <>
      <div className="btnBug pixelated selectDisable" onClick={() => window.open("https://forms.gle/87Ldvb1UTw53iUhH7", "_blank")}></div>
      <div className="absolute selectDisable" style={{zIndex: "1"}}>
        <div className="flex flex-row justify-center inline-block">
          {/* {sound ? 
            <div 
              className="btnSound1 pixelated" 
              style={{ left: "5px" }}
              onClick={() => updateSound(false)}
            ></div>
            : 
            <div 
              className="btnSound0 pixelated" 
              style={{ left: "5px" }}
              onClick={() => updateSound(true)}
            ></div>
          } */}
          <div id="menuBar" className="relative flex jutify-center items-center inline-block pixelated" style={{ fontSize: "16px" }}>
            <div className="flex jutify-center pl-2 pr-3 relative" style={{ marginTop: "-13px", marginLeft: "50px" }}>
              <div id="menuGold" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {frensCoins ? frensCoins : 0}
              </div>
              <div className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"  style={{ marginTop: "-11px", marginLeft:'5px', color: '#55813E', fontSize: '16px' }}>
                {claimableResources[10] ? "+"+claimableResources[10] : ''}
              </div>
            </div>
            <div className="flex jutify-center relative pr-3"  style={{ marginTop: "-13px" }}>
              <div id="menuWood" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {wood ? wood : 0}
              </div>
              <div className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"  style={{ marginTop: "-11px", marginLeft:'5px', color: '#55813E', fontSize: '16px' }}>
                {claimableResources[1] ? "+"+claimableResources[1] : ''}
              </div>
            </div>
            <div className="flex jutify-center relative pr-3" style={{ marginTop: "-13px" }}>
              <div id="menuRock" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {rock ? rock : 0}
              </div>
              <div className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"  style={{ marginTop: "-11px", marginLeft:'5px', color: '#55813E', fontSize: '16px' }}>
                {claimableResources[2] ? "+"+claimableResources[2] : ''}
              </div>
            </div>
            <div className="flex jutify-center relative pr-3" style={{ marginTop: "-13px" }}>
              <div id="menuMetal" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {metal ? metal : 0}
              </div>
              <div className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"  style={{ marginTop: "-11px", marginLeft:'5px', color: '#55813E', fontSize: '16px' }}>
                {claimableResources[6] ? "+"+claimableResources[6] : ''}
              </div>
            </div>
            <div className="flex jutify-center relative pr-3" style={{ marginTop: "-13px" }}>
              <div id="menuCoal" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {coal ? coal : 0}
              </div>
              <div className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"  style={{ marginTop: "-11px", marginLeft:'5px', color: '#55813E', fontSize: '16px' }}>
                {claimableResources[8] ? "+"+claimableResources[8] : ''}
              </div>
            </div>
            <div className="flex jutify-center relative pr-3" style={{ marginTop: "-13px" }}>
              <div id="menuPop" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
              {populationBusy ? populationBusy : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-3" style={{ marginTop: "-13px" }}>
              <div id="menuPopFree" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {populationFree ? populationFree : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-3" style={{ marginTop: "-13px" }}>
              <div id="menuMeat" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated"  style={{ marginTop: "-2px" }}>
                {meat ? meat : 0}
              </div>
              <div className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"  style={{ marginTop: "-11px", marginLeft:'5px', color: '#55813E', fontSize: '16px' }}>
                {claimableResources[3] ? "+"+claimableResources[3] : ''}
              </div>
            </div>
            <div className="flex jutify-center relative pr-1" style={{ marginTop: "-13px" }}>
              <div id="menuEnergy" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {energy ? energy : 0}
              </div>
              <div className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"  style={{ marginTop: "-11px", marginLeft:'5px', color: '#55813E', fontSize: '16px' }}>
                {claimableResources[11] ? "+"+ claimableResources[11] : ''}
              </div>
            </div>
            <div className="flex jutify-center relative pr-5" style={{ marginTop: "-13px" }}>
              {tokenId && blockClaimable && blockClaimable > 0 ? <div className="btnClaim pixelated" onClick={() => claimResources()} ></div> :  <div className="btnClaimDisabled pixelated"></div> }
            </div>
            <div className="flex jutify-center relative pr-5" style={{ marginTop: "-13px" }}>
              {tokenId && <div className="btnInit pixelated" onClick={() => setPopUpInit(true)} ></div> }
            </div>
            <div className="flex jutify-center relative" style={{ marginTop: "-13px" }}></div>
          </div>
            {/* <div 
              className="btnBottom pixelated" 
              style={{ left: "5px" }}
            >
              <div className="menuSettings pixelated"></div>
            </div> */}
        </div>
      </div>
      <div className="absolute selectDisable" style={{zIndex: "1", pointerEvents: "none"}}>
        <div className="subBar">
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "268px" }}>{buildingData && buildingData.total && buildingData.total > 0 ? buildingData.total : 0}</div>
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "452px" }}>{counterResources && counterResources[3] ? counterResources[3] : 0}</div>
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "570px" }}>{counterResources && counterResources[2] ? counterResources[2] : 0}</div>
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "700px" }}>{counterResources && counterResources[27] ? counterResources[27] : 0}</div>
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "898px" }}>{buildingData && buildingData.inactive ? Object.keys(buildingData.inactive).length : 0}</div>
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "1078px" }}>{buildingData && buildingData.active ? Object.keys(buildingData.active).length : 0}</div>
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "1261px" }}>{blockClaimable}</div>
        </div>
      </div>

      <Notifications />

      {popUpInit && 
        <div className="flex justify-center selectDisable">
        <div className="parentNotifInit">
          <div className="popUpNotifsAchievement pixelated fontHPxl-sm" style={{zIndex: 1, borderImage: `url(data:image/svg+xml;base64,${btoa(UI_Frames)}) 18 fill stretch` , textAlign: 'center'}}>
            <div className="closeAchievement" onClick={() => setPopUpInit(false)}></div>
            <p>Beware fren !!</p><br/>
            <p>Are you sure you want to reset your land ? You will loose the entirety of your progression (buildings & resources). This action is irreversible, there is no coming back.</p>
            <div className="btnInit pixelated" onClick={() => reinitializeLand()}></div>
          </div>
        </div>
        </div>
      }
    </>
  );
}
