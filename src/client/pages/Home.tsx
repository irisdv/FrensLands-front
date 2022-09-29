import React, { useMemo, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { uint256 } from "starknet";
import { getStarknet, IStarknetWindowObject } from "get-starknet";
import { useStarknetCall } from "@starknet-react/core";

import Notifications from "../components/Notifications";
import MenuHome from "../components/MenuHome";

import { useMapsContract } from "../hooks/contracts/maps";
import { useGameContext } from "../hooks/useGameContext";
import { useERC1155Contract } from "../hooks/contracts/erc1155";
import { useResourcesContract } from "../hooks/contracts/resources";
import { ILand } from "../providers/NewGameContext";

import { gsap } from "gsap";
import UI_Frames from "../style/resources/front/Ui_Frames3.svg";

// import socketService from "../services/socketService";
// import { io } from "socket.io-client";
// let socket: any;

export default function Home() {
  const [wallet, setWallet] = useState<IStarknetWindowObject>();
  const [signedIn, setSignedIn] = useState(false);
  const [hasLand, setHasLand] = useState<ILand>();
  const navigate = useNavigate();
  const {
    updateTokenId,
    // nonce,
    // updateNonce,
  } = useGameContext();
  const scrollRef = useRef<null | HTMLDivElement>(null);

  // Call
  const { contract: maps } = useMapsContract();
  const { contract: resources } = useResourcesContract();
  const { contract: erc1155 } = useERC1155Contract();
  const [watch, setWatch] = useState(true);
  const [canPlay, setCanPlay] = useState(0);
  const [approved, setApproved] = useState<any>(null);

  // const connectSocket = async (account: string) => {
  //   const socket = socketService
  //     .connect("http://localhost:8008/", account)
  //     .then((result) => {
  //       setConnected(true);
  //     })
  //     .catch((err) => {
  //       console.log("Error", err);
  //     });
  // };

  // useEffect(() => {
  //   if (!connected && account) {
  //     connectSocket(account);
  //   }
  // });

  // ------------------------------------- START: Fetch DB --------------------------------------------
  // Connexion du user
  const getUserInfo = async (account: string) => {
    fetch("http://localhost:3001/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account }),
    })
      .then(async (response) => {
        return await response.json();
      })
      .then((data) => {
        console.log(
          "userData received, ready to initialize game session withat data : ",
          data
        );
        if (data && data.token) localStorage.setItem("user", data.token);
        setSignedIn(true);
        if (data.land == 0) {
          console.log("user has no land, need to initialize");
        } else {
          setHasLand(data.land);
        }
      });
  };

  const initGame = async (account: string, biomeId: number) => {
    fetch("http://localhost:3001/api/users/init", {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("user") as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account: account, biomeId: biomeId }),
    })
      .then(async (response) => {
        return await response.json();
      })
      .then((data) => {
        console.log("userData", data);
        if (data && data.success) {
          navigate("/play");
        }
      });
  };

  // ------------------------------------- END: Fetch DB --------------------------------------------

  const connectWallet = async () => {
    const _wallet = await getStarknet();
    console.log("wallet", _wallet);
    await _wallet.enable({ showModal: true });
    setWallet(_wallet);
  };

  // Sign in player after wallet connect
  useEffect(() => {
    if (wallet?.isConnected && !signedIn) {
      getUserInfo(wallet.account.address);
    }
  }, [wallet]);

  // Get current nonce value
  // const nonceValue = useMemo(() => {
  //   console.log("new nonce value", nonce);
  //   return nonce;
  // }, [nonce]);

  // Fetch NFT balance of user
  const { data: fetchBalanceNFTResult } = useStarknetCall({
    contract: maps,
    method: "balanceOf",
    args: [wallet?.account.address],
    options: { watch },
  });

  const BalanceNFTValue = useMemo(() => {
    if (fetchBalanceNFTResult != null && fetchBalanceNFTResult.length > 0) {
      const elem = uint256.uint256ToBN(fetchBalanceNFTResult[0]);
      const balance = elem.toNumber();

      if (balance == 1 && wallet?.account.address)
        updateTokenId(wallet?.account.address);

      return { NFTbalance: balance };
    }
  }, [fetchBalanceNFTResult]);

  // Fetch gameStatus
  // const { data: fetchGameStatus } = useStarknetCall({
  //   contract: worlds,
  //   method: "get_game_status",
  //   args: [uint256.bnToUint256(tokenId as number)],
  //   options: { watch },
  // });
  // const GameStatusValue = useMemo(() => {
  //   if (fetchGameStatus != null && fetchGameStatus.length > 0) {
  //     const status = toBN(fetchGameStatus[0]).toNumber();

  //     console.log("status game", status);

  //     if (status == 1) setCanPlay(1);

  //     return { gameStatus: status };
  //   }
  // }, [fetchGameStatus, tokenId]);

  // Invoke Starting game
  const startGame = async (biomeId: number) => {
    console.log("startingGame invoke with biomeId", biomeId);

    // Send tx to init game on-chain

    // Init game in DB
    await initGame(wallet?.account.address as string, biomeId);

    //   if (tokenId && !settingUp) {
    //     const tx_hash = initializeGame(tokenId, nonceValue);
    //     console.log("tx hash", tx_hash);
    //     setSettingUp(tx_hash);

    //     tx_hash.then((res) => {
    //       console.log("res", res);
    //       if (res != 0) {
    //         updateNonce(nonceValue);
    //       } else {
    //         setSettingUp(null);
    //       }
    //     });
    //   } else if (!tokenId) {
    //     console.log("Missing tokenId");
    //     setMessage("You need to own a Frens Lands map to initialize a game.");
    //   } else {
    //     console.log("Already Setting Up");
    //   }
  };

  // --------------------- STYLE ------------------------------
  const executeScroll = () => {
    if (scrollRef.current != null) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Rotation world
  useEffect(() => {
    gsap.timeline().to(".frensLandsWorld", {
      rotation: 1440,
      duration: 880,
      repeat: -1,
      ease: "none",
    });
  });

  return (
    <>
      <div
        className=""
        style={{ overflowX: "hidden", overflowY: "scroll", height: "100vh" }}
      >
        <div className="home-s1">
          <MenuHome />

          <div className="relative">
            <div className="notifContainer">
              <div className="notifPanel">
                <Notifications />
              </div>
            </div>

            <div className="absolute" style={{ width: "100vw", top: "0" }}>
              <img
                src="resources/front/UI_MainScreenPlanet.svg"
                className="relative mx-auto pixelated frensLandsWorld selectDisable"
              />
            </div>

            <div className="absolute" style={{ width: "100vw", top: "0" }}>
              <img
                src="resources/front/UI_GameTitle.png"
                className="relative mx-auto pixelated frensLandsLogo selectDisable"
              />
            </div>

            <div
              className="absolute selectDisable"
              style={{ width: "100vw", top: "0" }}
            >
              {/* Player is already registered and has a land */}
              {wallet?.isConnected && hasLand && signedIn && (
                <>
                  <img
                    className="relative mx-auto pixelated nftImg"
                    src={`resources/maps/FrensLand_NFTs_${hasLand.biomeId}.png`}
                  />
                  <div style={{ height: "170px", pointerEvents: "all" }}>
                    <button
                      className="relative mx-auto pixelated btnPlay"
                      onClick={() => navigate("/play")}
                      style={{ marginTop: "-65px" }}
                    ></button>
                  </div>
                </>
              )}
              {/* User is connected, has an NFT but doesn't have a land  */}
              {wallet?.isConnected &&
                !hasLand &&
                BalanceNFTValue != null &&
                BalanceNFTValue.NFTbalance == 1 && (
                  <>
                    <div className="grid grid-cols-5 px-8">
                      <div
                        className="cursor-pointer px-5"
                        onClick={() => startGame(1)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={`resources/maps/FrensLand_NFTs_1.png`}
                        />
                      </div>
                      <div
                        className="cursor-pointer px-5"
                        onClick={() => startGame(2)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={`resources/maps/FrensLand_NFTs_2.png`}
                        />
                      </div>
                      <div
                        className="cursor-pointer px-5"
                        onClick={() => startGame(0)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={`resources/maps/FrensLand_NFTs_0.png`}
                        />
                      </div>
                      <div
                        className="cursor-pointer px-5"
                        onClick={() => startGame(3)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={`resources/maps/FrensLand_NFTs_3.png`}
                        />
                      </div>
                      <div
                        className="cursor-pointer px-5"
                        onClick={() => startGame(4)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={`resources/maps/FrensLand_NFTs_4.png`}
                        />
                      </div>
                    </div>

                    <div className="messageNotifParent">
                      <div
                        className="messageNotif fontHPxl-sm mx-auto text-center"
                        style={{
                          borderImage: `url(data:image/svg+xml;base64,${btoa(
                            UI_Frames
                          )}) 18 fill stretch`,
                        }}
                      >
                        <p>Chose a land to start playing!</p>
                      </div>
                    </div>
                  </>
                )}
              {/* User is connected and does not have a land and doesn't have a NFT either  */}
              {wallet?.isConnected &&
                !hasLand &&
                BalanceNFTValue != null &&
                BalanceNFTValue.NFTbalance == 0 && (
                  <>
                    <div className="grid grid-col-1 px-8">
                      <div
                        className="cursor-pointer px-5"
                        onClick={() => startGame(0)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={`resources/maps/FrensLand_NFTs_0.png`}
                        />
                      </div>
                    </div>

                    <div className="messageNotifParent">
                      <div
                        className="messageNotif fontHPxl-sm mx-auto text-center"
                        style={{
                          borderImage: `url(data:image/svg+xml;base64,${btoa(
                            UI_Frames
                          )}) 18 fill stretch`,
                        }}
                      >
                        <p>Chose a land to start playing!</p>
                      </div>
                    </div>
                  </>
                )}

              {/* {account?.isConnected &&
                BalanceNFTValue != null &&
                BalanceNFTValue.NFTbalance == 1 &&
                GameStatusValue != null &&
                GameStatusValue.gameStatus == 0 &&
                !settingUp && (
                  <button
                    className="relative mx-auto pixelated btnPlay"
                    onClick={() => startGame()}
                    style={{ marginTop: "-65px" }}
                  ></button>
                )} */}
              {/* {account?.isConnected &&
              BalanceNFTValue != null &&
              BalanceNFTValue.NFTbalance == 1 &&
              GameStatusValue != null &&
              GameStatusValue.gameStatus == 0 &&
              settingUp ? (
                <div className="messageNotifParent">
                  <div
                    className="messageNotifInit fontHPxl-sm mx-auto text-center"
                    style={{
                      borderImage: `url(data:image/svg+xml;base64,${btoa(
                        UI_Frames
                      )}) 18 fill stretch`,
                    }}
                  >
                    <p>Your land is initializing...</p>
                  </div>
                </div>
              ) : (
                ""
              )}
              {account?.isConnected &&
                BalanceNFTValue != null &&
                BalanceNFTValue.NFTbalance == 1 &&
                GameStatusValue != null &&
                GameStatusValue.gameStatus == 1 &&
                !approved && (
                  <button
                    className="relative mx-auto pixelated btnApproval"
                    onClick={() => approveM03()}
                  ></button>
                )} */}
              {/* {hasWallet && !account ? (
                <ConnectWallet close={() => setHasWallet(false)} />
              ) : null} */}

              {/* Connect Wallet */}
              {!wallet?.isConnected && (
                <button
                  onClick={() => connectWallet()}
                  className="relative mx-auto btnPlay pixelated"
                  style={{ marginTop: "300px" }}
                ></button>
              )}

              {/* Send user to next page */}
              {wallet?.isConnected && canPlay && approved == true && signedIn && (
                <div style={{ height: "170px", pointerEvents: "all" }}>
                  <button
                    className="relative mx-auto pixelated btnPlay"
                    onClick={() => navigate("/play")}
                    style={{ marginTop: "-65px" }}
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
              Frens Lands is currently in{" "}
              <span className="text-fl-green">
                pre-alpha on StarkNet testnet.
              </span>{" "}
              The first version was built during the Matchbox hackathon in July
              2022 and polished through August. The contracts, costs of
              buildings and harvesting are subject to change during the upcoming
              testing sessions.
            </p>

            <div className="md:flex justify-center my-5 px-2">
              <div
                className="md:mx-2 mx-auto text-center md:my-0 my-3"
                style={{ maxWidth: "400px", height: "auto" }}
              >
                <img src="resources/screens/1.png" />
              </div>
              <div
                className="md:mx-2 mx-auto text-center md:my-0 my-3"
                style={{ maxWidth: "400px", height: "auto" }}
              >
                <img src="resources/screens/2.png" />
              </div>
            </div>

            <div className="aboutUs-line mb-5 text-center mx-auto pixelated"></div>

            <div className="grid md:grid-cols-3 my-3">
              <div className="flex flex-col justify-center md:mx-10 mx-2 md:my-0 my-3">
                <img
                  src="resources/front/Gif_Population.gif"
                  style={{ height: "214px", width: "214px" }}
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
                  style={{ height: "214px", width: "214px" }}
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
                  style={{ height: "214px", width: "214px" }}
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
                  style={{ height: "214px", width: "214px" }}
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
                  style={{ height: "214px", width: "214px" }}
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
  );
}
