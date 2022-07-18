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
import { useSelectContext } from "../../hooks/useSelectContext";

export function MenuBar() {
  const {account} = useStarknet()
  const { data: block } = useStarknetBlock()

  const {tokenId, updateTokenId, setAddress, blockGame } = useGameContext();
  const {energy, frensCoins, wood, rock, coal, metal, populationBusy, populationFree, meat, cereal} = useResourcesContext();
  const { updateSound, sound } = useSelectContext()

  const claimingInvoke = useClaim()
  const activeNotifications = useActiveNotifications()

  const { contract: resources } = useResourcesContract();
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


    // Resources daily costs & harvest
    // const { data: fetchDailyHarvest } = useStarknetCall({
    //   contract: resources,
    //   method: "fetch_daily_ressources_harvest",
    //   args: [uint256.bnToUint256(tokenId as number)],
    //   options: { watch },
    // });
    // const DailyHarvestValue = useMemo(() => {
    //   if (tokenId && fetchDailyHarvest && fetchDailyHarvest.length > 0) {
    //     let harvestArr : any[] = [];
    //     var i = 0;
    //     while (i < 18) {
    //       harvestArr[toBN(fetchDailyHarvest[0][i]).toNumber()] = toBN(fetchDailyHarvest[0][i + 1]).toNumber()
    //       i += 2;
    //     }
    //     // console.log('dailyHarvest', harvestArr)
    //     return { dailyHarvest: harvestArr };
    //   }
    // }, [fetchDailyHarvest, tokenId]);

    // const { data: fetchDailyCosts } = useStarknetCall({
    //   contract: resources,
    //   method: "fetch_daily_ressources_harvest",
    //   args: [uint256.bnToUint256(tokenId as number)],
    //   options: { watch },
    // });
    // const DailyCoststValue = useMemo(() => {
    //   if (tokenId && fetchDailyCosts && fetchDailyCosts.length > 0) {
    //     let costsArr : any[] = [];
    //     var i = 0;
    //     while (i < 18) {
    //       costsArr[toBN(fetchDailyCosts[0][i]).toNumber()] = toBN(fetchDailyCosts[0][i + 1]).toNumber()
    //       i += 2;
    //     }
    //     // console.log('dailyCosts', costsArr)
    //     return { dailyCosts: costsArr };
    //   }
    // }, [fetchDailyCosts, tokenId]);

    // // Gold
    // const { data: fetchDailyHarvestGold } = useStarknetCall({
    //   contract: resources,
    //   method: "daily_gold_harvest",
    //   args: [uint256.bnToUint256(tokenId as number)],
    //   options: { watch },
    // });
    // const DailyHarvestGoldValue = useMemo(() => {
    //   if (tokenId && fetchDailyHarvestGold && fetchDailyHarvestGold.length > 0) {
    //     // console.log('gold harvest', fetchDailyHarvestGold[0].toNumber())  
    //     return { dailyHarvestGold: fetchDailyHarvestGold[0].toNumber() };
    //   }
    // }, [fetchDailyHarvestGold, tokenId]);

    // const { data: fetchDailyCostGold } = useStarknetCall({
    //   contract: resources,
    //   method: "daily_gold_cost",
    //   args: [uint256.bnToUint256(tokenId as number)],
    //   options: { watch },
    // });
    // const DailyCostGoldValue = useMemo(() => {
    //   if (tokenId && fetchDailyCostGold && fetchDailyCostGold.length > 0) {
    //     // console.log('gold cost', fetchDailyCostGold[0].toNumber())  
    //     return { dailyCostGold: fetchDailyCostGold[0].toNumber() };
    //   }
    // }, [fetchDailyCostGold, tokenId]);

    // // Energy
    // const { data: fetchDailyHarvestEnergy } = useStarknetCall({
    //   contract: resources,
    //   method: "daily_energy_harvest",
    //   args: [uint256.bnToUint256(tokenId as number)],
    //   options: { watch },
    // });
    // const DailyHarvestEnergyValue = useMemo(() => {
    //   if (tokenId && fetchDailyHarvestEnergy && fetchDailyHarvestEnergy.length > 0) {
    //     // console.log('energy harvest', fetchDailyHarvestEnergy[0].toNumber())  
    //     return { dailyHarvestEnergy: fetchDailyHarvestEnergy[0].toNumber() };
    //   }
    // }, [fetchDailyHarvestEnergy, tokenId]);

    // const { data: fetchDailyCostEnergy } = useStarknetCall({
    //   contract: resources,
    //   method: "daily_energy_cost",
    //   args: [uint256.bnToUint256(tokenId as number)],
    //   options: { watch },
    // });
    // const DailyCostEnergyValue = useMemo(() => {
    //   if (tokenId && fetchDailyCostEnergy && fetchDailyCostEnergy.length > 0) {
    //     // console.log('energy cost', fetchDailyCostEnergy[0].toNumber())  
    //     return { dailyCostEnergy: fetchDailyCostEnergy[0].toNumber() };
    //   }
    // }, [fetchDailyCostEnergy, tokenId]);

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
            <div className="flex jutify-center pl-2 pr-4 relative" style={{ marginTop: "-13px", marginLeft: "50px" }}>
              <div id="menuGold" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {frensCoins ? frensCoins : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4"  style={{ marginTop: "-13px" }}>
              <div id="menuWood" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {wood ? wood : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuRock" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {rock ? rock : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuMetal" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {metal ? metal : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuCoal" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {coal ? coal : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuPop" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
              {populationBusy ? populationBusy : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuPopFree" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {populationFree ? populationFree : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuMeat" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated"  style={{ marginTop: "-2px" }}>
                {meat ? meat : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuCereal" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {cereal ? cereal : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-4" style={{ marginTop: "-13px" }}>
              <div id="menuEnergy" className="pixelated"></div>
              <div className="flex items-center fontTom_PXL pb-1 menuItems pixelated" style={{ marginTop: "-2px" }}>
                {energy ? energy : 0}
              </div>
            </div>
            <div className="flex jutify-center relative pr-5" style={{ marginTop: "-13px" }}>
              {tokenId && btnClaim ? 
                <>
                  <div className="btnClaim pixelated" 
                    onClick={() => claimResources()} 
                    onMouseEnter={() => setPopUpClaim(true)}
                    onMouseLeave={() => setPopUpClaim(false)}
                  ></div>
                  {popUpClaim && 
                    <div className="popUpClaim fontHPxl-sm pixelated">
                      {/* <p>Gold : {DailyHarvestGoldValue?.dailyHarvestGold - DailyCostGoldValue?.dailyCostGold}</p>
                      <p>Energy: {DailyHarvestEnergyValue?.dailyHarvestEnergy - DailyCostEnergyValue?.dailyCostEnergy}</p>
                      <p>Wood : {DailyCoststValue?.dailyCosts[1] - DailyHarvestValue?.dailyHarvest[1]}</p>
                      <p>Rock : {DailyCoststValue?.dailyCosts[2] - DailyHarvestValue?.dailyHarvest[2]}</p>
                      <p>Metal : {DailyCoststValue?.dailyCosts[6] - DailyHarvestValue?.dailyHarvest[6]}</p>
                      <p>Coal : {DailyCoststValue?.dailyCosts[8] - DailyHarvestValue?.dailyHarvest[8]}</p>
                      <p>Meat : {DailyCoststValue?.dailyCosts[3] - DailyHarvestValue?.dailyHarvest[3]}</p>
                      <p>Cereal : {DailyCoststValue?.dailyCosts[5] - DailyHarvestValue?.dailyHarvest[5]}</p> */}
                    </div>
                  }
                </>

                : ""
              }
              {!btnClaim ?
                <>
                  <div className="btnClaimDisabled pixelated"
                    onMouseEnter={() => setPopUpClaim(true)}
                    onMouseLeave={() => setPopUpClaim(false)}></div>
                  {popUpClaim && 
                    <div className="popUpClaim fontHPxl-sm pixelated">
                      {!tokenId && <p>"no token id"</p>}
                      {tokenId && 
                        <div>
                          <p>GameBlock : {blockGame}</p>
                          <p>Current block : {toBN(block?.block_number as number).toNumber()}</p>
                        </div>
                      }
                    </div>
                  }
                </>
                : ""
              }
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
