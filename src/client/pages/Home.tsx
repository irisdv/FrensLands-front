import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { number } from "starknet";
import { getStarknet, IStarknetWindowObject } from "get-starknet";
import Notifications from "../components/Notifications";
import MenuHome from "../components/Home/MenuHome";
import LandList from "../components/Home/LandList";
import { useMapsContract } from "../hooks/contracts/maps";
import { ILand } from "../providers/NewGameContext";
import { gsap } from "gsap";
import UI_Frames from "../style/resources/front/Ui_Frames3.svg";

export default function Home() {
  const [wallet, setWallet] = useState<IStarknetWindowObject>();
  const [hasLand, setHasLand] = useState<ILand>();
  const [balance, setBalance] = useState<any>(null);
  const navigate = useNavigate();
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const mapsContract = useMapsContract();

  const connectWallet = async () => {
    const _wallet = await getStarknet();
    await _wallet.enable({ showModal: true });
    setWallet(_wallet);
  };

  useEffect(() => {
    if (wallet != null && wallet.account && wallet.account.address) {
      wallet.account
        .callContract(
          {
            contractAddress: mapsContract.address,
            entrypoint: "balanceOf",
            calldata: [number.toFelt(wallet.account.address)],
          },
          { blockIdentifier: "pending" }
        )
        .then((res: any) => {
          console.log("result balanceOf player", res);
          setBalance(Number(res.result[0]));
        })
        .catch((error: any) => {
          console.log("error while fetching balance NFT lands", error);
        });
    }
  }, [wallet]);

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
              {wallet?.isConnected && hasLand != null && (
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
              {wallet?.isConnected && hasLand == null && balance > 0 ? (
                <>
                  <LandList account={wallet.account.address} />
                </>
              ) : (
                <></>
              )}
              {/* User is connected and does not have a land and doesn't have a NFT either  */}
              {wallet?.isConnected && hasLand == null && balance == 0 ? (
                <>
                  <div className="messageNotifParentNoLand">
                    <div
                      className="messageNotifNoLand fontHPxl-sm mx-auto text-center"
                      style={{
                        borderImage: `url(data:image/svg+xml;base64,${btoa(
                          UI_Frames
                        )}) 18 fill stretch`,
                      }}
                    >
                      <p>You don't own a map... </p>
                      <br />
                      <p>
                        Join the{" "}
                        <a
                          className="cursor-pointer"
                          style={{ color: "#964489" }}
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Frens Lands discord server
                        </a>{" "}
                        to take part in the next testing sessions.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              {/* Connect Wallet */}
              {!wallet?.isConnected && (
                <button
                  onClick={async () => await connectWallet()}
                  className="relative mx-auto btnPlay pixelated"
                  style={{ marginTop: "300px" }}
                ></button>
                // <>
                // <button
                //   onClick={() => setShowNotifPause(true)}
                //   className="relative mx-auto btnPlay pixelated"
                //   style={{ marginTop: "300px" }}
                // ></button>
                // {showNotifPause ?
                // <div className="messageNotifParentNoLand">
                //     <div
                //       className="messageNotifPause fontHPxl-sm mx-auto text-center"
                //       style={{
                //         borderImage: `url(data:image/svg+xml;base64,${btoa(
                //           UI_Frames
                //         )}) 18 fill stretch`,
                //       }}
                //     >
                //       <p>Due to the state of the network we're temporary pausing the game. We'll notify you as soon as testnet comes back to normal.</p>
                //     </div>
                //   </div>
                //   : <></>}
                //   </>
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
