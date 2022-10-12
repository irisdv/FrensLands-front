import React, { useMemo, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import starknet, { uint256, number } from "starknet";
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
import useStartGame from "../hooks/invoke/useStartGame";
import { useFLContract } from "../hooks/contracts/frenslands";
import { createSupabase } from "../supabaseClient";
import { initMap } from "../utils/constant";

export default function Home() {
  const [wallet, setWallet] = useState<IStarknetWindowObject>();
  const [signedIn, setSignedIn] = useState(false);
  const [hasLand, setHasLand] = useState<ILand>();
  const [hasInit, setHasInit] = useState(0);
  const navigate = useNavigate();
  const {
    updateTokenId,
    tokenId,
    // nonce,
    // updateNonce,
  } = useGameContext();
  const scrollRef = useRef<null | HTMLDivElement>(null);

  // Call
  const { contract: maps } = useMapsContract();
  const { contract: frenslands } = useFLContract();
  // const { contract: erc1155 } = useERC1155Contract();
  const [watch, setWatch] = useState(true);
  const [canPlay, setCanPlay] = useState(0);
  const [approved, setApproved] = useState<any>(null);
  // const initializeGame = useStartGame();

  // ------------------------------------- START: Fetch DB --------------------------------------------

  const initGame = async (account: string, biomeId: number) => {
    var _user: string = localStorage.getItem("user") as string;
    const _supabase = createSupabase(_user);

    const response = await _supabase
      .from("users")
      .select(`id, account, lands (fk_userid, id, biomeId)`)
      .eq("account", wallet?.account.address)
      .single();

    if (
      response &&
      response.data?.lands &&
      Object.keys(response.data?.lands).length > 0
    ) {
      console.log(
        "user already has a land initialized",
        Object.keys(response.data?.lands).length
      );

      navigate("/play");

      // Need to ensure that it's the right owner based on tokenId that was fetched
    } else {
      console.log("user need to initialize its land");
      // TODO init w/ data fetched from chain (if land has not been already initialized)

      var land_id;
      const { data: inventory_data, error: inventory_error } = await _supabase
        .from("inventories")
        .insert([
          {
            fk_userid: response.data?.id,
          },
        ]);
      console.log("inventory", inventory_data);

      const { data: land_data, error: land_error } = await _supabase
        .from("lands")
        .insert([
          {
            fk_userid: response.data?.id,
            biomeId: biomeId,
            fullMap: initMap,
            nbResourcesSpawned: 196,
            nbResourcesLeft: 196,
            nbBuilding: 1,
          },
        ])
        .select();
      console.log("land_data", land_data);
      if (land_data) land_id = land_data[0].id;

      const { data: building_data, error: building_error } = await _supabase
        .from("player_buildings")
        .insert([
          {
            fk_userid: response.data?.id,
            fk_landid: land_id,
            fk_buildingid: 1,
            gameUid: 1,
            posX: 1.2,
            posY: 1.2,
            blockX: 11,
            blockY: 8,
            decay: 100,
            unitTimeCreatedAt: 0,
          },
        ]);

      const { data: actions_data, error: actions_error } = await _supabase
        .from("player_actions")
        .insert([
          {
            entrypoint: "start_game",
            calldata: biomeId,
            validated: false,
            fk_userid: response.data?.id,
            fk_landid: land_id,
          },
        ]);

      if (!inventory_error && !land_error && !building_error && !actions_error)
        navigate("/play");
    }
  };

  // ------------------------------------- END: Fetch DB --------------------------------------------

  const connectWallet = async () => {
    const _wallet = await getStarknet();
    console.log("wallet", _wallet);
    await _wallet.enable({ showModal: true });
    setWallet(_wallet);
  };

  const connectUser = (_account: string) => {
    var _url: string;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      _url = "http://localhost:3001/api/signin";
    } else {
      _url = "https://" + process.env.REACT_APP_URL + "/api/signin";
    }

    fetch(_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _account }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data received from server ", data);

        if (data && data.user) {
          if (data && data.token) {
            localStorage.setItem("user", data.token);
            setTimeout(function () {
              setSignedIn(true);
            }, 50);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // Sign in player
  useEffect(() => {
    if (wallet?.isConnected && !signedIn) {
      connectUser(wallet.account.address);
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

      console.log("fetchBalanceNFTResult", fetchBalanceNFTResult);

      console.log("balance NFT", balance);

      if (balance > 0 && wallet?.account.address) {
        updateTokenId(wallet?.account.address);
      }

      return { NFTbalance: balance };
    }
  }, [fetchBalanceNFTResult]);

  const checkWasInit = async (_wallet: any, token: number) => {
    const _res = await _wallet.account.callContract({
      contractAddress:
        "0x060363b467a2b8d409234315babe6be180020e0bb65d708c0d09be6fd3691a2f",
      entrypoint: "get_owner",
      calldata: [number.toFelt(token)],
    });
    return _res.result[0];
  };

  // Invoke Starting game
  const startGame = async (biomeId: number) => {
    console.log("startingGame invoke with biomeId", biomeId);

    // Send tx to init game on-chain
    console.log("tokenId of owner", tokenId);

    if (wallet != null && tokenId && !hasInit) {
      // TODO update depending on changes to db + indexer
      // returns 0x0 if not init
      const wasInit = await checkWasInit(wallet, tokenId);
      console.log("wasInit ? ", wasInit);

      if (wasInit == "0x0") {
        let nonce = await wallet.account.getNonce();
        const result = await wallet.account.execute(
          [
            {
              contractAddress: frenslands?.address as string,
              entrypoint: "start_game",
              calldata: [tokenId, 0, biomeId],
            },
          ],
          undefined,
          { maxFee: 500, nonce }
        );
        console.log("result", result);
        // TODO keep tx hash for notif
      }

      // const tx_hash = await initializeGame(wallet, tokenId, biomeId, nonce);
      // console.log('tx_hash', tx_hash);
      setHasInit(1);
    }

    // Init game in DB
    await initGame(wallet?.account.address as string, biomeId);
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

            <button
              onClick={async () => await startGame(2)}
              style={{ position: "absolute", zIndex: 100 }}
            >
              START GAME
            </button>

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
              {wallet?.isConnected && hasLand != null && signedIn && (
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
              {/* // TODO show list of owned lands  */}
              {wallet?.isConnected &&
                hasLand == null &&
                BalanceNFTValue != null &&
                BalanceNFTValue.NFTbalance > 0 && (
                  <>
                    <div className="grid grid-cols-5 px-8">
                      <div
                        className="cursor-pointer px-5"
                        onClick={async () => await startGame(2)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={"resources/maps/FrensLand_NFTs_1.png"}
                        />
                      </div>
                      <div
                        className="cursor-pointer px-5"
                        onClick={async () => await startGame(3)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={"resources/maps/FrensLand_NFTs_2.png"}
                        />
                      </div>
                      <div
                        className="cursor-pointer px-5"
                        onClick={async () => await startGame(1)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={"resources/maps/FrensLand_NFTs_0.png"}
                        />
                      </div>
                      <div
                        className="cursor-pointer px-5"
                        onClick={async () => await startGame(4)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={"resources/maps/FrensLand_NFTs_3.png"}
                        />
                      </div>
                      <div
                        className="cursor-pointer px-5"
                        onClick={async () => await startGame(5)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={"resources/maps/FrensLand_NFTs_4.png"}
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
                hasLand == null &&
                BalanceNFTValue != null &&
                BalanceNFTValue.NFTbalance == 0 && (
                  <>
                    <div className="grid grid-col-1 px-8">
                      <div
                        className="cursor-pointer px-5"
                        onClick={async () => await startGame(0)}
                      >
                        <img
                          className="relative mx-auto pixelated nftImg hover:scale-110"
                          src={"resources/maps/FrensLand_NFTs_0.png"}
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
                  onClick={async () => await connectWallet()}
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
