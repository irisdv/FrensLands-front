import React, { useMemo, useEffect, useState, useRef } from "react";
import { useStarknet, useStarknetCall, InjectedConnector} from "@starknet-react/core";
import { TransactionList } from "../components/TransactionList";
import { toBN } from "starknet/dist/utils/number";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from 'gsap';
import { ConnectWallet } from "../components/ConnectWallet";

import Notifications from '../components/Notifications'
import { uint256 } from "starknet";

import { useMapsContract } from "../hooks/contracts/maps";
import { useWorldsContract } from "../hooks/contracts/worlds";
import { useBuildingsContract } from "../hooks/contracts/buildings";
import { useGameContext } from "../hooks/useGameContext";
import useActiveNotifications from '../hooks/useNotifications'
import useMintMap from "../hooks/invoke/useMintMap";
import useStartGame from "../hooks/invoke/useStartGame"

import useTest from "../hooks/invoke/useTest";
import { useERC1155Contract } from "../hooks/contracts/erc1155";
import useApprove from "../hooks/invoke/useApprove";
import { useResourcesContract } from "../hooks/contracts/resources";

export default function Home() {
  // const { account } = useStarknet();
  // const { available, connect, disconnect } = useConnectors();

  // START DEBUG
  const [testing, setTesting] = useState<any>(null)
  const generateTest = useTest()
  // END DEBUG 

  const navigate = useNavigate()
  const { account, connect, connectors, disconnect } = useStarknet();
  const injected = useMemo(() => new InjectedConnector(), []);

  const { setAddress, updateTokenId, tokenId, fetchMapType } = useGameContext();
  const activeNotifications = useActiveNotifications()

  // Call
  const { contract: worlds } = useWorldsContract();
  const { contract: maps } = useMapsContract();
  const { contract: buildings } = useBuildingsContract();
  const { contract: resources } = useResourcesContract();
  const { contract: erc1155 } = useERC1155Contract();
  const [watch, setWatch] = useState(true);
  // Invoke
  const generateMap = useMintMap()
  const initializeGame = useStartGame()
  const approveMO3ERC1155 = useApprove()

  const [minting, setMinting] = useState<any>(null)
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

  // Rotation world
  useEffect(() => {
    gsap.timeline().to('.frensLandsWorld', {
      rotation: 1440,
      duration: 880,
      repeat: -1,
      ease: "none"
    })
  })

  // useEffect(() => {
  //   if (canPlay == 1 && approved) {
  //     navigate('/play')
  //   }
  // }, [canPlay])

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

  // Fetch tokenType
  const { data: fetchtokenType } = useStarknetCall({
    contract: maps,
    method: "tokenURI",
    args: [uint256.bnToUint256(tokenId as number)],
    options: { watch },
  });

  const tokenTypeValue = useMemo(() => {
    if (fetchtokenType && fetchtokenType.length > 0) {
      var elem = uint256.uint256ToBN(fetchtokenType[0]);
      console.log("Token URI", fetchtokenType);
      var balance = elem.toString();

      fetchMapType(balance)

      return { tokenType: balance };
    }
  }, [fetchtokenType, account, tokenId]);

  // Invoke Minting Maps 
  const mintMap = () => {
    let tx_hash = generateMap()
    console.log('tx hash generating map', tx_hash)
    setMinting(tx_hash);
  };

  useEffect(() => {
    if (minting) {
      var dataMinting = activeNotifications.filter((transactions) => (transactions?.content.transactionHash as string) === minting as string)
      console.log('mintingData', dataMinting )
      if (dataMinting && dataMinting[0] && dataMinting[0].content) {
        if (dataMinting[0].content.status == 'REJECTED') {
          setMessage("Your transaction has failed... Try again.")
          setMinting(null)
        } else if (dataMinting[0].content.status == 'ACCEPTED_ON_L1' || dataMinting[0].content.status == 'ACCEPTED_ON_L2') {
          setMessage("Your transaction was accepted. Now you need to initialize the game!")
          setMinting(true)
        } else {
          setMessage("Your transaction is ongoing.")
        }
      }
    }
  }, [minting, activeNotifications])

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
      // console.log("Approval state", uint256.uint256ToBN(fetchApprovalState[0]).toNumber());
      var appr = toBN(fetchApprovalState[0]).toNumber();

      console.log('appr', appr)

      if (appr) setApproved(true)

      return { appr };
    }
  }, [fetchApprovalState, account, tokenId, approved]);

  // Si faux, btn invoke 

  const approveM03 = () => {
    let tx_hash = approveMO3ERC1155()
    console.log('tx hash approval ERC1155', tx_hash)
    setApproved(tx_hash);
  }

  // Invoke Starting game 
  const startGame = () => {
    console.log('startingGame invoke')
    if (tokenId) {
      let tx_hash = initializeGame(tokenId)
      console.log('tx hash', tx_hash)
      setSettingUp(tx_hash);
    } else {
      console.log('Missing tokenId')
      setMessage("You need to own a Frens Lands map to initialize a game.")
    }
  }

  useEffect(() => {
    if (settingUp) {
      var data = activeNotifications.filter((transactions) => (transactions?.content.transactionHash) === settingUp as string);
      if (data && data[0] && data[0].content) {
        if (data[0].content.status == 'REJECTED') {
          setMessage("Your transaction has failed... Try again.")
          setSettingUp(null)
        } else if (data[0].content.status == 'ACCEPTED_ON_L1' || data[0].content.status == 'ACCEPTED_ON_L2') {
          setMessage("Your transaction was accepted. Now you can play!")
          setSettingUp(true)
          if (approved) navigate('/play')
        } else {
          setMessage("Your transaction is ongoing.")
        }
      }
    }
  }, [settingUp, activeNotifications])


  // TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST  TEST TEST TEST TEST TEST TEST TEST TEST TEST 
  // const testContract = async () => {
  //   console.log("invoking test", account);
  //   let tx_hash = await generateTest()
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
  //         navigate('/game')
  //       }
  //     }
  //   }
  // }, [testing, activeNotifications])
  // TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST  TEST TEST TEST TEST TEST TEST TEST TEST TEST 

  return (
    <>
      <div style={{backgroundColor: "#151d28", width: "100vw", height: "100vh"}}>
        
        <div className="backgroundImg relative pixelated" style={{width: "1280px", height:"720px"}}>

        {activeNotifications && activeNotifications.length > 0 &&
          <div className="popUpNotifs fontHPxl-sm pixelated" style={{padding: "23px"}}>
            <Notifications />
          </div>
        }
        {/* <button onClick={() => testContract()}>TEST test test test </button> */}

          <img className="absolute pixelated frensLandsLogo" src="resources/front/UI_GameTitle.png" 
              style={{width : "640px", height: "640px", marginTop: '-165px', marginLeft: "320px", zIndex: "1", position: "absolute"}} />

          <img className="absolute pixelated frensLandsWorld" src="resources/front/UI_MainScreenPlanet.png" 
              style={{width : "640px", height: "640px", marginTop: '180px', marginLeft: "320px"}} />

            {account && BalanceNFTValue && (BalanceNFTValue.NFTbalance == 0 || BalanceNFTValue.NFTbalance == 1) &&
            <>
              <img className="absolute pixelated" src="resources/maps/FrensLand_NFTs_V2.png" style={{height: "256px", width: "256px", marginLeft: "512px", marginTop: "290px"}} />
              {/* <img className="absolute pixelated" src="resources/maps/FrensLand_NFTs_V3.png" style={{height: "256px", width: "256px", marginLeft: "512px", marginTop: "290px"}} />
              <img className="absolute pixelated" src="resources/maps/FrensLand_NFTs_V4.png" style={{height: "256px", width: "256px", marginLeft: "512px", marginTop: "290px"}} />
              <img className="absolute pixelated" src="resources/maps/FrensLand_NFTs_V5.png" style={{height: "256px", width: "256px", marginLeft: "512px", marginTop: "290px"}} />
              <img className="absolute pixelated" src="resources/maps/FrensLand_NFTs_V6.png" style={{height: "256px", width: "256px", marginLeft: "512px", marginTop: "290px"}} /> */}
            </>
            }
              {account && 
                BalanceNFTValue && BalanceNFTValue.NFTbalance == 0 &&
                <div style={{height: "128px", width: "128px", marginTop: "414px", marginLeft: "576px"}} className="absolute"> 
                  <div>
                    <button className="pixelated btnMint" onClick={() => mintMap()} style={{marginLeft: "-36px", marginTop: "120px"}}></button>
                  </div>
                </div>
              }
              {account && BalanceNFTValue && (BalanceNFTValue.NFTbalance == 1 || minting == true) && GameStatusValue && GameStatusValue.gameStatus == 0 &&
                  <>
                    <div style={{height: "128px", width: "128px", marginTop: "510px", marginLeft: "576px"}} className="absolute"> 
                      <button className="pixelated btnPlay" onClick={() => startGame()}></button>
                    </div>
                  </>
              }
              {account && BalanceNFTValue && BalanceNFTValue.NFTbalance == 1 && GameStatusValue && GameStatusValue.gameStatus == 1 && !approved &&
                  <>
                    <div style={{height: "128px", width: "128px", marginTop: "545px", marginLeft: "576px"}} className="absolute"> 
                      <button className="pixelated btnApproval" onClick={() => approveM03()}></button>
                    </div>
                  </>
              }
              {!account &&
                <div style={{height: "128px", width: "128px", marginTop: "414px", marginLeft: "576px"}} className="absolute"> 
                  <ConnectWallet/>
                </div>
              }
              {account && canPlay && approved &&
              <>
                <div style={{height: "128px", width: "128px", marginTop: "510px", marginLeft: "576px"}} className="absolute"> 
                  <button className="pixelated btnPlay" onClick={() => navigate('/play')}></button>
                </div>
              </>
              
              }
        </div>
      </div>
      {/* <button onClick={() => testContract()}>TEST test test test </button> */}
    </>
  );
}
