import { useStarknet, useStarknetCall, useStarknetBlock, useStarknetTransactionManager, useStarknetInvoke } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
// import { useBuildingsContract } from "../../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";
import { useResourcesContract } from "../../hooks/resources";
import { ConnectWallet } from "../ConnectWallet";

export function MenuBar() {
  const {tokenId, updateTokenId, setAddress, frensCoins, wood, rock, meat, metal, coal, cereal, energy, populationBusy, populationFree, blockGame, currentBlock} = useGameContext();
    // const { contract: resources } = useResourcesContract();
    const [ claiming, setClaiming ] = useState(false)
    const [ message, setMessage ] = useState("")
    const { transactions } = useStarknetTransactionManager()
    const { contract: resources } = useResourcesContract();

    const { data: block } = useStarknetBlock()

    const {account} = useStarknet()

    useEffect(() => {
      if (account) setAddress(account)
    }, [account])

    useEffect(() => {
      if (account && !tokenId) {
        updateTokenId(account);
      }
    }, [account, tokenId])

    const {
      data: dataStartClaiming,
      loading: loadingStartClaiming,
      invoke: startClaimingInvoke,
    } = useStarknetInvoke({
      contract: resources,
      method: "claim_resources",
    });
  
    // DEBUG : enlever les arguments 
    const claimResources = () => {
      console.log("invoking claiming", tokenId);
      if (tokenId) {
        startClaimingInvoke({
          args: [
              uint256.bnToUint256(tokenId),
              "0x0526abb8b9f4d90e97a29266a3d9c5ed52f44a8a70847ef7ce9fe90f65ca51ea",
              "0x03af997c327ca80bf00e0fc69e765a2d6f52c3d6dd0d02f36f97015065fa908d",
              "0x04a6a806aab47f343499dfc39d11680afbb4eec725044bd84cf548ac5c1e0297"
          ],
          metadata: {
            method: "claim resources",
            message: "Claiming your resources.",
          },
        });
      }
      setClaiming(true);
    };
  
    // useEffect(() => {
    //   var data = transactions.filter((transactions) => (transactions?.transactionHash) === dataStartClaiming);
    //   console.log('data starting game', data);
  
    // }, [claiming, transactions, dataStartClaiming])
  
    useEffect(() => {
      var data = transactions.filter((transactions) => (transactions?.transactionHash) === dataStartClaiming);
      console.log('data claiming', data);
      if (data && data[0] && data[0].status && (data[0].status == 'REJECTED')) {
        setMessage('Your transaction failed. ')
      } else if (data && data[0] && (data[0].status == 'ACCEPTED_ON_L1' || data[0].status == 'ACCEPTED_ON_L2')) {
        console.log('tx pour set approval est bien passée on peut passer au bridge')
        setMessage('Your resources just arrived !')
        setClaiming(false);
      } else if (data && data[0] && (data[0].status == 'RECEIVED')) {
        setMessage('Your resources are on their way ! It may take some time to harvest everything...')
      }
    }, [claiming, transactions, dataStartClaiming])

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
          { claiming ? 
          <div className="popUpNotifs pixelated">
            {message}
          </div>
          : ""
          }
        </div>
      </div>
    </>
  );
}
