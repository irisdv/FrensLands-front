import { useStarknet, useStarknetCall, useStarknetBlock, useStarknetTransactionManager, useStarknetInvoke } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
// import { useBuildingsContract } from "../../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";
import { useResourcesContract } from "../../hooks/contracts/resources";
import { ConnectWallet } from "../ConnectWallet";
import useClaim from "../../hooks/invoke/useClaim";
import useActiveNotifications from "../../hooks/useNotifications";
import Notifications from "../Notifications";

import useResourcesContext from "../../hooks/useResourcesContext";

export function MenuBar() {
  const {account} = useStarknet()
  const { data: block } = useStarknetBlock()

  const {tokenId, updateTokenId, setAddress, blockGame, currentBlock} = useGameContext();
  const {energy, frensCoins, wood, rock, coal, metal, populationBusy, populationFree, meat, cereal} = useResourcesContext();
  const { contract: resources } = useResourcesContract();
  const claimingInvoke = useClaim()
  const activeNotifications = useActiveNotifications()

  const [ claiming, setClaiming ] = useState<any>(null)
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
        var dataMinting = activeNotifications.filter((transactions) => (transactions?.content.transactionHash as string) === claiming as string)
        console.log('claimingData', dataMinting )
        if (dataMinting && dataMinting[0] && dataMinting[0].content) {
          if (dataMinting[0].content.status == 'REJECTED') {
            setMessage("Your transaction has failed... Try again.")
            setClaiming(null)
          } else if (dataMinting[0].content.status == 'ACCEPTED_ON_L1' || dataMinting[0].content.status == 'ACCEPTED_ON_L2') {
            setMessage("Your transaction was accepted. Now you need to initialize the game!")
            setClaiming(true)
          } else {
            setMessage("Your transaction is ongoing.")
          }
        }
      }
    }, [claiming, activeNotifications])



  //   Gestion du block Number

  return (
    <>
      <div className="absolute">
        <div className="flex flex-row justify-center inline-block">
          <div className="btnHome pixelated" style={{ left: "5px" }}></div>
          <div id="menuBar" className="relative flex jutify-center items-center inline-block pixelated" style={{ fontSize: "16px" }}>
            <div className="flex jutify-center pl-2 pr-4 relative" style={{ marginTop: "-13px", marginLeft: "50px" }}>
              <div id="menuGold" className="pixelated"></div>
              <div className="flex items-center fontHPxl pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {frensCoins ? frensCoins : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4"  style={{ marginTop: "-13px" }}>
              <div id="menuWood" className="pixelated"></div>
              <div className="flex items-center fontHPxl pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {wood ? wood : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuRock" className="pixelated"></div>
              <div className="flex items-center fontHPxl pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {rock ? rock : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuMetal" className="pixelated"></div>
              <div className="flex items-center fontHPxl pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {metal ? metal : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuCoal" className="pixelated"></div>
              <div className="flex items-center fontHPxl pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {coal ? coal : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuPop" className="pixelated"></div>
              <div className="flex items-center fontHPxl pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
              {populationBusy ? populationBusy : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuPopFree" className="pixelated"></div>
              <div className="flex items-center fontHPxl pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {populationFree ? populationFree : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuMeat" className="pixelated"></div>
              <div className="flex items-center fontHPxl pb-1 menuItems pixelated"  style={{ marginTop: "-2px" }}>
                {meat ? meat : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuCereal" className="pixelated"></div>
              <div className="flex items-center fontHPxl pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {cereal ? cereal : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuEnergy" className="pixelated"></div>
              <div className="flex items-center fontHPxl pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {energy ? energy : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-5" style={{ marginTop: "-13px" }}>
              <div className="btnClaim" onClick={() => claimResources()}></div>
            </div>
            <div className="flex jutify-center relative" style={{ marginTop: "-13px" }}>
            </div>
            <div className="flex jutify-center relative" style={{ marginTop: "-13px" }}>
             <ConnectWallet />
            </div>
            
          </div>
        </div>
      </div>
      {/* { claiming != null ?  */}
        {/* <div className="popUpNotifsGame pixelated fontHPxl-sm"> */}
        <div className="notifContainer">
          <div className="notifPanel">
            <Notifications />
          </div>
        </div>
        {/* </div> */}
      {/* : ""
      } */}
    </>
  );
}
