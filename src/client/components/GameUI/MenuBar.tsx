import { useStarknet, useStarknetBlock } from "@starknet-react/core";
import React, { useMemo, useState, useEffect } from "react";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";
import { useResourcesContract } from "../../hooks/contracts/resources";
import { ConnectWallet } from "../ConnectWallet";
import useClaim from "../../hooks/invoke/useClaim";
import useActiveNotifications from "../../hooks/useNotifications";
import Notifications from "../Notifications";

import useResourcesContext from "../../hooks/useResourcesContext";
import { useSelectContext } from "../../hooks/useSelectContext";

export function MenuBar() {
  const {account} = useStarknet()
  const { data: block } = useStarknetBlock()

  const {tokenId, updateTokenId, setAddress, blockGame, buildingData } = useGameContext();
  const {energy, frensCoins, wood, rock, coal, metal, populationBusy, populationFree, meat, cereal} = useResourcesContext();
  const { updateSound, sound } = useSelectContext()

  const claimingInvoke = useClaim()
  const activeNotifications = useActiveNotifications()

  // const { contract: resources } = useResourcesContract();
  const [watch, setWatch] = useState(true);

  const [ claiming, setClaiming ] = useState<any>(null)
  const [ btnClaim, setBtnClaim ] = useState(false)
  const [ popUpClaim, setPopUpClaim] = useState(false)
  const [ message, setMessage ] = useState("")

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
      console.log("invoking claiming", tokenId);
      if (tokenId) {
        let tx_hash = claimingInvoke(tokenId)
        console.log('tx hash claiming resources', tx_hash)
        setClaiming(tx_hash);
      } else {
        console.log('Missing tokenId')
      }
      setClaiming(true);
    };

    useEffect(() => {
      if (claiming) {
        var dataMinting = activeNotifications.filter((transactions) => (transactions?.transactionHash as string) === claiming as string)
        console.log('claimingData', dataMinting )
        // if (dataMinting && dataMinting[0] && dataMinting[0].content) {
        //   if (dataMinting[0].content.status == 'REJECTED') {
        //     setMessage("Your transaction has failed... Try again.")
        //     setClaiming(null)
        //   } else if (dataMinting[0].content.status == 'ACCEPTED_ON_L1' || dataMinting[0].content.status == 'ACCEPTED_ON_L2') {
        //     setMessage("Your transaction was accepted. Now you need to initialize the game!")
        //     setClaiming(true)
        //   } else {
        //     setMessage("Your transaction is ongoing.")
        //   }
        // }
      }
    }, [claiming, activeNotifications])

    const blockClaimable = useMemo(() => {
      if (buildingData) {
        let _newBlockClaimable = 0;
        console.log('block', block?.block_number)
        console.log('gameBlock', blockGame)
        buildingData.active?.forEach((elem : any) => {
          if (elem['recharges']) {
            // check lasr claim block number 
            // current block - last_claim block > then add recharges 
            if (block?.block_number) {
              var check = toBN(block?.block_number).toNumber() - elem['last_claim']
              console.log('check', check)
              // if (check > )
              _newBlockClaimable += elem['recharges']
            }
          }
        })
        console.log('_newBlockClaimable', _newBlockClaimable)
        return _newBlockClaimable
      }
    }, [buildingData])

  // Btn Claim 
  useEffect(() => {
    if (block && blockGame) {
      let current_block = toBN(block?.block_number).toNumber()
      if (current_block >= blockGame) {
        console.log('SUP blockGame', blockGame)
        console.log('SUP current_block', current_block)
        console.log('SUP', current_block - blockGame)
        setBtnClaim(true)
      } else {
        setBtnClaim(false)
      }
    }
  }, [block?.block_number, blockGame, claiming])

  return (
    <>
      <div className="absolute" style={{zIndex: "1"}}>
        <div className="flex flex-row justify-center inline-block">
          {sound ? 
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
          }
          <div id="menuBar" className="relative flex jutify-center items-center inline-block pixelated" style={{ fontSize: "16px" }}>
            <div className="flex jutify-center pl-2 pr-1 relative" style={{ marginTop: "-13px", marginLeft: "50px" }}>
              <div id="menuGold" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {frensCoins ? frensCoins : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-1"  style={{ marginTop: "-13px" }}>
              <div id="menuWood" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {wood ? wood : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-1" style={{ marginTop: "-13px" }}>
              <div id="menuRock" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {rock ? rock : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-1" style={{ marginTop: "-13px" }}>
              <div id="menuMetal" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {metal ? metal : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-1" style={{ marginTop: "-13px" }}>
              <div id="menuCoal" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {coal ? coal : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-1" style={{ marginTop: "-13px" }}>
              <div id="menuPop" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
              {populationBusy ? populationBusy : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-1" style={{ marginTop: "-13px" }}>
              <div id="menuPopFree" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {populationFree ? populationFree : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-1" style={{ marginTop: "-13px" }}>
              <div id="menuMeat" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated"  style={{ marginTop: "-2px" }}>
                {meat ? meat : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-1" style={{ marginTop: "-13px" }}>
              <div id="menuCereal" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {cereal ? cereal : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-1" style={{ marginTop: "-13px" }}>
              <div id="menuEnergy" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {energy ? energy : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-5" style={{ marginTop: "-13px" }}>
              {tokenId && blockClaimable && blockClaimable > 0 ? <div className="btnClaim pixelated" onClick={() => claimResources()} ></div> :  <div className="btnClaimDisabled pixelated"></div> }
            </div>
            <div className="flex jutify-center relative" style={{ marginTop: "-13px" }}></div>
            <div className="flex jutify-center relative" style={{ marginTop: "-13px" }}>
              <ConnectWallet />
            </div>
            
          </div>
        </div>
      </div>
      <div className="absolute" style={{zIndex: "1", pointerEvents: "none"}}>
        <div className="subBar" style={{ marginTop: "55px", marginLeft: "65px" }}>
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "284px" }}>2mn 30</div>
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "674px" }}>2mn 30</div>
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "898px" }}>{buildingData && buildingData.inactive ? Object.keys(buildingData.inactive).length : 0}</div>
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "1078px" }}>{buildingData && buildingData.active ? Object.keys(buildingData.active).length : 0}</div>
          <div className="fontHpxl_JuicySmall absolute" style={{ marginTop: "16px", marginLeft: "1261px" }}>{blockClaimable}</div>
        </div>
      </div>
      {/* <div className="notifContainer">
        <div className="notifPanel"> */}
          <Notifications />
          {/* <div className="popUpNotifsGame pixelated fontHPxl-sm"></div>
          <div className="popUpNotifsGame pixelated fontHPxl-sm"></div> */}
        {/* </div>
      </div> */}
    </>
  );
}
