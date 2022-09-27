import React, { useMemo, useEffect, useState, useRef } from 'react'
import {
  useStarknet,
  useStarknetCall,
  useConnectors,
  useStarknetExecute,
  useContract
} from '@starknet-react/core'
import { toBN } from 'starknet/dist/utils/number'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { Abi, uint256 } from 'starknet'
import { ConnectWallet } from '../components/ConnectWallet'
import Notifications from '../components/Notifications'
import UI_Frames from '../style/resources/front/Ui_Frames3.svg'
import { useMapsContract } from '../hooks/contracts/maps'
import { useWorldsContract } from '../hooks/contracts/worlds'
import { useGameContext } from '../hooks/useGameContext'
import useActiveNotifications from '../hooks/useNotifications'
import useMintMap from '../hooks/invoke/useMintMap'
import useStartGame from '../hooks/invoke/useStartGame'
import { useERC1155Contract } from '../hooks/contracts/erc1155'
import useApprove from '../hooks/invoke/useApprove'
import { useResourcesContract } from '../hooks/contracts/resources'
import { allMetadata } from '../data/metadata'

import AccountAbi from '../abi/Account.json'
import MenuHome from '../components/MenuHome'

import socketService from '../services/socketService'

import { io } from 'socket.io-client'
import { useSelectContext } from '../hooks/useSelectContext'
const starknet = require('starknet')
let socket: any

export default function Home () {
  const { account } = useStarknet()
  const { available, connect, disconnect } = useConnectors()
  const [hasWallet, setHasWallet] = useState(false)
  const navigate = useNavigate()
  const {
    setAddress,
    updateTokenId,
    tokenId,
    nonce,
    setAccountContract,
    accountContract,
    updateNonce
  } = useGameContext()
  const activeNotifications = useActiveNotifications()
  const [worldType, setWorldType] = useState<any>(null)
  const scrollRef = useRef<null | HTMLDivElement>(null)

  // Call
  const { contract: worlds } = useWorldsContract()
  const { contract: maps } = useMapsContract()
  // const { contract: buildings } = useBuildingsContract();
  const { contract: resources } = useResourcesContract()
  const { contract: erc1155 } = useERC1155Contract()
  const [watch, setWatch] = useState(true)
  // Invoke
  const generateMap = useMintMap()
  const initializeGame = useStartGame()
  const approveMO3ERC1155 = useApprove()
  const [settingUp, setSettingUp] = useState<any>(null)
  const [canPlay, setCanPlay] = useState(0)
  const [message, setMessage] = useState<any>(null)
  const [approved, setApproved] = useState<any>(null)

  // Connection to FL
  const [connected, setConnected] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  // const sdk = require('api')('@aspect/v0.1-testnet#13qgon3yl4dk4egj');

  const connectSocket = async (account: string) => {
    const socket = socketService
      .connect('http://localhost:8008/', account)
      .then((result) => {
        setConnected(true)
      })
      .catch((err) => {
        console.log('Error', err)
      })
  }

  useEffect(() => {
    if (!connected && account) {
      connectSocket(account)
    }
  })

  // Connexion du user
  const getUserInfo = async () => {
    fetch('http://localhost:3001/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ account })
    })
      .then(async (response) => {
        return await response.json()
      })
      .then((data) => {
        console.log('userData', data)
        if (data && data.token) localStorage.setItem('user', data.token)
        setSignedIn(true)
      })
  }

  useEffect(() => {
    if (account) {
      console.log('account exists', account)
      setAddress(account)
    }
  }, [account])

  useEffect(() => {
    if (account && !tokenId) {
      updateTokenId(account)
    }
  }, [account, tokenId])

  useEffect(() => {
    if (account && tokenId) {
      const _metadata = allMetadata.filter((res) => res.id == tokenId)
      setWorldType(_metadata[0].biome)
      getUserInfo()
    }
  }, [account, tokenId])

  useEffect(() => {
    if (account && !accountContract) {
      const accountC = new starknet.Account(
        AccountAbi as Abi,
        account,
        starknet.Provider
      )
      setAccountContract(accountC)
    }
  }, [account, accountContract])

  // Rotation world
  useEffect(() => {
    gsap.timeline().to('.frensLandsWorld', {
      rotation: 1440,
      duration: 880,
      repeat: -1,
      ease: 'none'
    })
  })

  const nonceValue = useMemo(() => {
    console.log('new nonce value', nonce)
    return nonce
  }, [nonce])

  // Fetch NFT balance of user
  const { data: fetchBalanceNFTResult } = useStarknetCall({
    contract: maps,
    method: 'balanceOf',
    args: [account],
    options: { watch }
  })

  const BalanceNFTValue = useMemo(() => {
    if (fetchBalanceNFTResult != null && fetchBalanceNFTResult.length > 0) {
      const elem = uint256.uint256ToBN(fetchBalanceNFTResult[0])
      const balance = elem.toNumber()

      if (balance == 1 && account) updateTokenId(account)

      return { NFTbalance: balance }
    }
  }, [fetchBalanceNFTResult])

  // Fetch gameStatus
  const { data: fetchGameStatus } = useStarknetCall({
    contract: worlds,
    method: 'get_game_status',
    args: [uint256.bnToUint256(tokenId as number)],
    options: { watch }
  })
  const GameStatusValue = useMemo(() => {
    if (fetchGameStatus != null && fetchGameStatus.length > 0) {
      const status = toBN(fetchGameStatus[0]).toNumber()

      console.log('status game', status)

      if (status == 1) setCanPlay(1)

      return { gameStatus: status }
    }
  }, [fetchGameStatus, tokenId])

  // Check if is approved
  const { data: fetchApprovalState } = useStarknetCall({
    contract: erc1155,
    method: 'isApprovedForAll',
    args: [account, resources?.address],
    options: { watch }
  })

  const approvalStatusValue = useMemo(() => {
    if (fetchApprovalState != null && fetchApprovalState.length > 0) {
      const elem = uint256.uint256ToBN(fetchApprovalState[0])
      const appr = toBN(fetchApprovalState[0]).toNumber()

      console.log('appr', appr)

      if (appr) setApproved(true)

      return { appr }
    }
  }, [fetchApprovalState, account, tokenId, approved])

  const approveM03 = () => {
    if (!approved && tokenId) {
      const tx_hash = approveMO3ERC1155(nonceValue)
      console.log('tx hash approval ERC1155', tx_hash)
      setApproved(tx_hash)

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
      const tx_hash = initializeGame(tokenId, nonceValue)
      console.log('tx hash', tx_hash)
      setSettingUp(tx_hash)

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
      setMessage('You need to own a Frens Lands map to initialize a game.')
    } else {
      console.log('Already Setting Up')
    }
  }

  useEffect(() => {
    if (settingUp) {
      const data = activeNotifications.filter(
        (transactions) =>
          transactions?.transactionHash === (settingUp as string)
      )
      if (data && data[0]) {
        if (data[0].status == 'REJECTED') {
          setMessage('Your transaction has failed... Try again.')
          setSettingUp(null)
        } else if (
          data[0].status == 'ACCEPTED_ON_L1' ||
          data[0].status == 'ACCEPTED_ON_L2'
        ) {
          setMessage('Your transaction was accepted. Now you can play!')
          setSettingUp(true)
          if (approved) navigate('/play')
        } else {
          setMessage('Your transaction is ongoing.')
        }
      }
    }
  }, [settingUp, activeNotifications])

  const executeScroll = () => {
    if (scrollRef.current != null) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <div
        className=""
        style={{ overflowX: 'hidden', overflowY: 'scroll', height: '100vh' }}
      >
        <div className="home-s1">
          <MenuHome />

          <div className="relative">
            <div className="notifContainer">
              <div className="notifPanel">
                <Notifications />
              </div>
            </div>

            <div className="absolute" style={{ width: '100vw', top: '0' }}>
              <img
                src="resources/front/UI_MainScreenPlanet.svg"
                className="relative mx-auto pixelated frensLandsWorld selectDisable"
              />
            </div>

            <div className="absolute" style={{ width: '100vw', top: '0' }}>
              <img
                src="resources/front/UI_GameTitle.png"
                className="relative mx-auto pixelated frensLandsLogo selectDisable"
              />
            </div>

            <div
              className="absolute selectDisable"
              style={{ width: '100vw', top: '0' }}
            >
              {account &&
                BalanceNFTValue != null &&
                BalanceNFTValue.NFTbalance == 1 &&
                worldType >= 0 &&
                worldType != null && (
                  <img
                    className="relative mx-auto pixelated nftImg"
                    src={`resources/maps/FrensLand_NFTs_${worldType}.png`}
                  />
              )}
              {account &&
                BalanceNFTValue != null &&
                BalanceNFTValue.NFTbalance == 0 && (
                  <div className="messageNotifParent">
                    <div
                      className="messageNotif fontHPxl-sm mx-auto text-center"
                      style={{
                        borderImage: `url(data:image/svg+xml;base64,${btoa(
                          UI_Frames
                        )}) 18 fill stretch`
                      }}
                    >
                      <p>You don't own a map... </p>
                      <br />
                      <p>
                        Join the{' '}
                        <a
                          className="cursor-pointer"
                          style={{ color: '#964489' }}
                          href="https://discord.gg/gehYZU9Trf"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Frens Lands discord server
                        </a>{' '}
                        to take part in the next testing sessions.
                      </p>
                    </div>
                  </div>
              )}
              {account &&
                BalanceNFTValue != null &&
                BalanceNFTValue.NFTbalance == 1 &&
                GameStatusValue != null &&
                GameStatusValue.gameStatus == 0 &&
                !settingUp && (
                  <button
                    className="relative mx-auto pixelated btnPlay"
                    onClick={() => startGame()}
                    style={{ marginTop: '-65px' }}
                  ></button>
              )}
              {account &&
              BalanceNFTValue != null &&
              BalanceNFTValue.NFTbalance == 1 &&
              GameStatusValue != null &&
              GameStatusValue.gameStatus == 0 &&
              settingUp
                ? (
                <div className="messageNotifParent">
                  <div
                    className="messageNotifInit fontHPxl-sm mx-auto text-center"
                    style={{
                      borderImage: `url(data:image/svg+xml;base64,${btoa(
                        UI_Frames
                      )}) 18 fill stretch`
                    }}
                  >
                    <p>Your land is initializing...</p>
                  </div>
                </div>
                  )
                : (
                    ''
                  )}
              {account &&
                BalanceNFTValue != null &&
                BalanceNFTValue.NFTbalance == 1 &&
                GameStatusValue != null &&
                GameStatusValue.gameStatus == 1 &&
                !approved && (
                  <button
                    className="relative mx-auto pixelated btnApproval"
                    onClick={() => approveM03()}
                  ></button>
              )}
              {hasWallet && !account
                ? (
                <ConnectWallet close={() => setHasWallet(false)} />
                  )
                : null}
              {!account && (
                <button
                  onClick={() => setHasWallet(true)}
                  className="relative mx-auto btnPlay pixelated"
                  style={{ marginTop: '300px' }}
                ></button>
              )}
              {account && canPlay && approved == true && signedIn && (
                <div style={{ height: '170px', pointerEvents: 'all' }}>
                  <button
                    className="relative mx-auto pixelated btnPlay"
                    onClick={() => navigate('/play')}
                    style={{ marginTop: '-65px' }}
                  ></button>
                </div>
              )}
            </div>
          </div>
        </div>
        <img
          src="resources/front/Web_SplashScrollFooter.png"
          className="splashScroll selectDisable"
          onClick={() => executeScroll()}
        />

        <div className="bg-home selectDisable">
          <div className="flex flex-col justify-center xl:w-[1080px] mx-auto">
            <div className="overviewT my-5 text-center mx-auto pixelated"></div>
            <p className="text-justify md:w-2/5 w-4/5 fontHPxl-sm text-white mx-auto">
              Frens Lands is currently in{' '}
              <span className="text-fl-green">
                pre-alpha on StarkNet testnet.
              </span>{' '}
              The first version was built during the Matchbox hackathon in July
              2022 and polished through August. The contracts, costs of
              buildings and harvesting are subject to change during the upcoming
              testing sessions.
            </p>

            <div className="md:flex justify-center my-5 px-2">
              <div
                className="md:mx-2 mx-auto text-center md:my-0 my-3"
                style={{ maxWidth: '400px', height: 'auto' }}
              >
                <img src="resources/screens/1.png" />
              </div>
              <div
                className="md:mx-2 mx-auto text-center md:my-0 my-3"
                style={{ maxWidth: '400px', height: 'auto' }}
              >
                <img src="resources/screens/2.png" />
              </div>
            </div>

            <div className="aboutUs-line mb-5 text-center mx-auto pixelated"></div>

            <div className="grid md:grid-cols-3 my-3">
              <div className="flex flex-col justify-center md:mx-10 mx-2 md:my-0 my-3">
                <img
                  src="resources/front/Gif_Population.gif"
                  style={{ height: '214px', width: '214px' }}
                  className="mx-auto text-center"
                />
                <p className="text-center fontHpxl_JuicyXL text-fl-yellow uppercase mb-3">
                  An RTS/builder in a persistent world
                </p>
                <p className="mx-auto text-justify fontHPxl-sm text-white">
                  Harvest resources to start building your own community. Manage
                  buildings upgrades and repairs but beware Frens Lands is also
                  a game where you’ll have to handle random events & diplomacy
                  relationships.
                </p>
              </div>
              <div className="flex flex-col md:mx-16 mx-2 md:my-0 my-3">
                <p className="text-center fontHpxl_JuicyXL text-fl-blue uppercase mb-3">
                  Building first
                </p>
                <p className="mx-auto text-justify fontHPxl-sm text-white">
                  Our team is focused on building a fun and testable game. We
                  use StarkNet testnet to take the time to build a balanced
                  economy and we'll launch NFT mint and tokens as soon as they
                  are fully understansable and usable by our community.
                </p>
              </div>
              <div className="flex flex-col justify-center md:mx-10 mx-2 md:my-0 my-3">
                <img
                  src="resources/front/Gif_Commnity2-export.gif"
                  style={{ height: '214px', width: '214px' }}
                  className="mx-auto text-center"
                />
                <p className="text-center fontHpxl_JuicyXL text-fl-yellow uppercase mb-3">
                  A game built with the community
                </p>
                <p className="mx-auto text-justify fontHPxl-sm text-white">
                  We’re very attached to community feedback that’s why we wanted
                  to open testing sessions as soon as possible to inform our
                  roadmap and next steps.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 my-5">
              <div className="flex flex-col md:mx-10 mx-2 md:my-0 my-3">
                <img
                  src="resources/maps/FrensLand_NFTs_0.png"
                  style={{ height: '214px', width: '214px' }}
                  className="mx-auto text-center"
                />
                <p className="text-center fontHpxl_JuicyXL text-fl-yellow uppercase mb-3">
                  Buy the NFT when the game is playable
                </p>
                <p className="mx-auto text-justify fontHPxl-sm text-white">
                  For now Frens Lands is running on StarkNet testnet and there
                  are no tokens or NFTs that can be bought on StarkNet mainnet.
                </p>
              </div>
              <div className="flex flex-col md:mx-10 mx-2 md:my-0 my-3">
                <img
                  src="resources/front/Gif_Commnity4.gif"
                  style={{ height: '214px', width: '214px' }}
                  className="mx-auto text-center"
                />
                <p className="text-center fontHpxl_JuicyXL text-fl-yellow uppercase mb-3">
                  Cross-usage <br />
                  and SBT
                </p>
                <p className="mx-auto text-justify fontHPxl-sm text-white">
                  We’re exploring ways to bring your web3 assets into Frens
                  Lands to truly customise your land. Imagine having a BAYC
                  building or a statue of your Cryptopunk.
                </p>
              </div>
              <div className="flex flex-col md:mx-10 mx-2 md:my-0 my-3">
                <img
                  src="resources/front/Gif_Commnity3.gif"
                  style={{ height: '214px', width: '214px' }}
                  className="mx-auto text-center"
                />
                <p className="text-center fontHpxl_JuicyXL text-fl-yellow uppercase mb-3">
                  Fully onchain <br />
                  day 1
                </p>
                <p className="mx-auto text-justify fontHPxl-sm text-white">
                  Frens Lands first version was built onchain. We’re currently
                  working on the new version with a complete set of features and
                  we’re exploring ways to enhance gameplay while staying fully
                  onchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
