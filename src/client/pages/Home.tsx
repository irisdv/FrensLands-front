import React, { useMemo, useEffect, useState, useRef } from "react";
import { useStarknet, useStarknetCall, useConnectors, useStarknetExecute, useContract} from "@starknet-react/core";
import { toBN } from "starknet/dist/utils/number";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from 'gsap';
import { Abi, uint256 } from "starknet";
const starknet = require("starknet")
import { ConnectWallet } from "../components/ConnectWallet";
import Notifications from '../components/Notifications'
import UI_Frames from '../style/resources/front/Ui_Frames3.svg';
import { useMapsContract } from "../hooks/contracts/maps";
import { useWorldsContract } from "../hooks/contracts/worlds";
import { useGameContext } from "../hooks/useGameContext";
import useActiveNotifications from '../hooks/useNotifications'
import useMintMap from "../hooks/invoke/useMintMap";
import useStartGame from "../hooks/invoke/useStartGame"
import { useERC1155Contract } from "../hooks/contracts/erc1155";
import useApprove from "../hooks/invoke/useApprove";
import { useResourcesContract } from "../hooks/contracts/resources";
import { allMetadata } from "../data/metadata";

import AccountAbi from "../abi/Account.json";
import MenuHome from "../components/MenuHome";

export default function Home() {
  const { account } = useStarknet();
  const { available, connect, disconnect } = useConnectors();
  const [hasWallet, setHasWallet] = useState(false);
  const navigate = useNavigate()
  const { setAddress, updateTokenId, tokenId, nonce, setAccountContract, accountContract, updateNonce } = useGameContext();
  const activeNotifications = useActiveNotifications()
  const [worldType, setWorldType] = useState<any>(null)

  // Call
  const { contract: worlds } = useWorldsContract();
  const { contract: maps } = useMapsContract();
  // const { contract: buildings } = useBuildingsContract();
  const { contract: resources } = useResourcesContract();
  const { contract: erc1155 } = useERC1155Contract();
  const [watch, setWatch] = useState(true);
  // Invoke
  const generateMap = useMintMap()
  const initializeGame = useStartGame()
  const approveMO3ERC1155 = useApprove()
  const [settingUp, setSettingUp] = useState<any>(null)
  const [canPlay, setCanPlay] = useState(0)
  const [message, setMessage] = useState<any>(null)
  const [approved, setApproved] = useState<any>(null)

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

  useEffect(() => {
    if (account && tokenId) {
      let _metadata = allMetadata.filter(res => res.id == tokenId as number )
      setWorldType(_metadata[0].biome)
    }
  }, [account, tokenId])

  useEffect(() => {
    if (account && !accountContract) {
      let accountC = new starknet.Account(AccountAbi as Abi, account, starknet.Provider)
      setAccountContract(accountC)
    }
  }, [account, accountContract])

  // Rotation world
  useEffect(() => {
    gsap.timeline().to('.frensLandsWorld', {
      rotation: 1440,
      duration: 880,
      repeat: -1,
      ease: "none"
    })
  })

  const nonceValue = useMemo(() => {
    console.log('new nonce value', nonce)
    return nonce
  }, [nonce])

  // Fetch NFT balance of user
  const { data: fetchBalanceNFTResult } = useStarknetCall({
    contract: maps,
    method: "balanceOf",
    args: [account],
    options: { watch },
  });

  const BalanceNFTValue = useMemo(() => {
    if (fetchBalanceNFTResult && fetchBalanceNFTResult.length > 0) {
      var elem = uint256.uint256ToBN(fetchBalanceNFTResult[0]);
      var balance = elem.toNumber();

      if (balance == 1 && account) updateTokenId(account)

      return { NFTbalance: balance };
    }
  }, [fetchBalanceNFTResult]);

  // Fetch gameStatus
  const { data: fetchGameStatus } = useStarknetCall({
    contract: worlds,
    method: "get_game_status",
    args: [uint256.bnToUint256(tokenId as number)],
    options: { watch },
  });
  const GameStatusValue = useMemo(() => {
    if (fetchGameStatus && fetchGameStatus.length > 0) {

      var status = toBN(fetchGameStatus[0]).toNumber();

      console.log('status game', status)
      
      if (status == 1) setCanPlay(1)

      return { gameStatus: status };
    }
  }, [fetchGameStatus, tokenId]);

  // Check if is approved 
  const { data: fetchApprovalState } = useStarknetCall({
    contract: erc1155,
    method: "isApprovedForAll",
    args: [account, resources?.address],
    options: { watch },
  });

  const approvalStatusValue = useMemo(() => {
    if (fetchApprovalState && fetchApprovalState.length > 0) {
      var elem = uint256.uint256ToBN(fetchApprovalState[0]);
      var appr = toBN(fetchApprovalState[0]).toNumber();

      console.log('appr', appr)

      if (appr) setApproved(true)

      return { appr };
    }
  }, [fetchApprovalState, account, tokenId, approved]);

  const approveM03 = () => {
    if (!approved && tokenId) {
      let tx_hash = approveMO3ERC1155(nonceValue)
      console.log('tx hash approval ERC1155', tx_hash)
      setApproved(tx_hash);

      tx_hash.then((res) => {
        console.log('res', res)
        if (res != 0) {
          updateNonce(nonceValue)
        } else {
          setApproved(null)
        }
      })
    }
  }

  // Invoke Starting game 
  const startGame = () => {
    console.log('startingGame invoke')
    if (tokenId && !settingUp) {
      let tx_hash = initializeGame(tokenId, nonceValue)
      console.log('tx hash', tx_hash)
      setSettingUp(tx_hash);

      tx_hash.then((res) => {
        console.log('res', res)
        if (res != 0) {
          updateNonce(nonceValue)
        } else {
          setSettingUp(null)
        }
      })
    } else if (!tokenId) {
      console.log('Missing tokenId')
      setMessage("You need to own a Frens Lands map to initialize a game.")
    } else {
      console.log('Already Setting Up')
    }
  }

  useEffect(() => {
    if (settingUp) {
      var data = activeNotifications.filter((transactions) => (transactions?.transactionHash) === settingUp as string);
      if (data && data[0]) {
        if (data[0].status == 'REJECTED') {
          setMessage("Your transaction has failed... Try again.")
          setSettingUp(null)
        } else if (data[0].status == 'ACCEPTED_ON_L1' || data[0].status == 'ACCEPTED_ON_L2') {
          setMessage("Your transaction was accepted. Now you can play!")
          setSettingUp(true)
          if (approved) navigate('/play')
        } else {
          setMessage("Your transaction is ongoing.")
        }
      }
    }
  }, [settingUp, activeNotifications])

  return (
    <>
      <div className="" style={{overflow: "hidden", height: "100vh"}}>
        <div className="home-s1">

        <MenuHome />

          <div className="relative">

          <div className="notifContainer">
            <div className="notifPanel">
              <Notifications />
            </div>
          </div>

            <div className="absolute" style={{width: "100vw", top: '0'}}>
              <img src="resources/front/UI_MainScreenPlanet.svg" className="relative mx-auto pixelated frensLandsWorld selectDisable" />
            </div>

            <div className="absolute" style={{width: "100vw", top: '0'}}>
              <img src="resources/front/UI_GameTitle.png" className="relative mx-auto pixelated frensLandsLogo selectDisable" />
            </div>

            <div className="absolute selectDisable" style={{width: "100vw", top: '0'}}>
              {account && BalanceNFTValue && BalanceNFTValue.NFTbalance == 1 && worldType >= 0 && worldType != null &&
                <img className="relative mx-auto pixelated nftImg" src={`resources/maps/FrensLand_NFTs_${worldType}.png`} />
              }
              {account && BalanceNFTValue && BalanceNFTValue.NFTbalance == 0 &&
                <div className="messageNotifParent">
                  <div className="messageNotif fontHPxl-sm mx-auto text-center" style={{borderImage: `url(data:image/svg+xml;base64,${btoa(UI_Frames)}) 18 fill stretch` }}>
                    <p>You don't own a map... </p>
                    <br/>
                    <p>Join the <a className="cursor-pointer" style={{color: "#964489"}} href="https://discord.gg/gehYZU9Trf" target='_blank'>Frens Lands discord server</a> to take part in the next testing sessions.</p>
                  </div>
                </div>
              }
              {account && BalanceNFTValue && BalanceNFTValue.NFTbalance == 1 && GameStatusValue && GameStatusValue.gameStatus == 0 && !settingUp &&
                <button className="relative mx-auto pixelated btnPlay" onClick={() => startGame()} style={{marginTop: '-65px'}}></button>
              }
              {account && BalanceNFTValue && BalanceNFTValue.NFTbalance == 1 && GameStatusValue && GameStatusValue.gameStatus == 0 && settingUp ?
                <div className="messageNotifParent">
                <div className="messageNotifInit fontHPxl-sm mx-auto text-center" style={{borderImage: `url(data:image/svg+xml;base64,${btoa(UI_Frames)}) 18 fill stretch` }}>
                  <p>Your land is initializing...</p>
                </div>
              </div>
              : ""}
              {account && BalanceNFTValue && BalanceNFTValue.NFTbalance == 1 && GameStatusValue && GameStatusValue.gameStatus == 1 && !approved &&
                <button className="relative mx-auto pixelated btnApproval" onClick={() => approveM03()}></button>
              }
              {hasWallet && !account ? <ConnectWallet close={() => setHasWallet(false)} /> : null}
              {!account && 

                  <button 
                    onClick={() => setHasWallet(true)}
                    className="relative mx-auto btnPlay pixelated" 
                    style={{marginTop: '300px'}}
                  ></button>
              }
              {account && canPlay && approved == true && 
                <div style={{height: '170px', pointerEvents: 'all'}}>
                  <button className="relative mx-auto pixelated btnPlay" onClick={() => navigate('/play')} style={{marginTop: '-65px'}}></button>
                </div>
              }              
            </div>
          </div>
        </div>  
      </div>
    </>
  );
}
