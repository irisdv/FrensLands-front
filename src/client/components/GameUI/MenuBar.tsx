import { useStarknetBlock } from "@starknet-react/core";
import React, { useMemo, useState, useEffect } from "react";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";
// import useClaim from "../../hooks/invoke/useClaim";
// import useActiveNotifications from "../../hooks/useNotifications";
import Notifications from "../Notifications";
import { allBuildings } from "../../data/buildings";
import UI_Frames from "../../style/resources/front/Ui_Frames3.svg";

import useResourcesContext from "../../hooks/useResourcesContext";
import { useSelectContext } from "../../hooks/useSelectContext";
import useReinitialize from "../../hooks/invoke/useReinitialize";
import { useNewGameContext } from "../../hooks/useNewGameContext";
import { useResourcesContract } from "../../hooks/contracts/resources";
import { getPosFromId } from "../../utils/building";
import { number, uint256 } from "starknet";

// import { getStarknet } from "get-starknet";

export function MenuBar() {
  const { data: block } = useStarknetBlock();
  const {
    addAction,
    payloadActions,
    wallet,
    inventory,
    counters,
    playerBuilding,
    player,
    fullMap,
    staticResources,
    staticBuildings,
  } = useNewGameContext();
  const { zoomMode, updateZoom } = useSelectContext();
  const {
    tokenId,
    updateTokenId,
    setAddress,
    blockGame,
    buildingData,
    nonce,
    updateNonce,
    counterResources,
    accountContract,
  } = useGameContext();

  const { contract: resourcesContract } = useResourcesContract();

  const reinitializeInvoke = useReinitialize();

  const [claiming, setClaiming] = useState<any>(null);
  const [btnClaim, setBtnClaim] = useState(false);
  const [popUpInit, setPopUpInit] = useState(false);
  const [popUpTxCart, setPopUpTxCart] = useState(false);

  const [claimableResources, setClaimableResources] = useState<any[]>([]);

  // console.log("payload", payloadActions);

  // useEffect(() => {
  //   console.log('useEffect zoom menubar', zoomMode)
  // }, [zoomMode])

  useEffect(() => {
    if (wallet && wallet.isConnected) setAddress(wallet.account.address);
  }, [wallet]);

  useEffect(() => {
    if (wallet && wallet.isConnected && !tokenId) {
      updateTokenId(wallet.account.address);
    }
  }, [wallet, tokenId]);

  // Invoke claim resources
  const claimResources = () => {
    // Multicall
    console.log("actions = ", payloadActions);

    const _calls: any[] = [];
    payloadActions.forEach((action) => {
      // Build calldata
      // const _calldata: any[] = [];
      // const _data = action.calldata.split("|");
      // _data.forEach((elem: any) => {
      //   _calldata.push(elem);
      // });
      // _calls.push({
      //   contractAddress: resourcesContract?.address.toLowerCase() as string,
      //   entrypoint: action.entrypoint as string,
      //   calldata: _calldata,
      // });

      _calls.push({
        contractAddress: resourcesContract?.address.toLowerCase() as string,
        entrypoint: action.entrypoint as string,
        calldata: [uint256.bnToUint256(1), number.toFelt(16), number.toFelt(10)],
      });
    });

    wallet.account.getNonce().then((nonce: any) => {
      console.log("nonce", nonce);
      wallet.account.execute(_calls);
      // TODO : add nounce in execute multicall
    });

    // if (tokenId) {
    //   const tx_hash = claimingInvoke(tokenId, nonceValue);
    //   setClaiming(tx_hash);

    //   tx_hash.then((res) => {
    //     console.log("res", res);
    //     if (res != 0) {
    //       updateNonce(nonceValue);
    //     }
    //   });
    // } else {
    //   console.log("Missing tokenId");
    // }
    // setClaiming(true);
  };

  const nonceValue = useMemo(() => {
    console.log("new nonce value", nonce);
    return nonce;
  }, [nonce]);

  const reinitializeLand = () => {
    if (tokenId) {
      const tx_hash = reinitializeInvoke(tokenId, nonceValue);

      //     tx_hash.then((res) => {
      //       console.log("res", res);
      //       if (res != 0) {
      //         updateNonce(nonceValue);
      //       }
      //     });
    } else {
      console.log("Missing tokenId");
    }
  };

  const blockClaimable = useMemo(() => {
    if (buildingData != null) {
      let _newBlockClaimable = 0;
      const _resources: any[] = [];

      buildingData.active?.forEach((elem: any) => {
        if (elem.recharges) {
          // check lasr claim block number
          // current block - last_claim block > then add recharges
          if (block?.block_number) {
            const check =
              toBN(block?.block_number).toNumber() - elem.last_claim;
            let block2Claim = 0;
            if (check > elem.recharges) {
              block2Claim = elem.recharges;
            } else {
              block2Claim = check;
            }
            _newBlockClaimable += block2Claim;

            // Get resources to harvest for each claimable building
            if (block2Claim > 0) {
              allBuildings[elem.type - 1].daily_harvest?.[0].resources.map(
                (elem: any) => {
                  let _currValue = 0;
                  if (_resources[elem.id] && _resources[elem.id] > 0) {
                    _currValue = _resources[elem.id] + elem.qty * block2Claim;
                  } else {
                    _currValue += elem.qty * block2Claim;
                  }
                  _resources[elem.id] = _currValue;
                }
              );
            }
          }
        }
      });
      setClaimableResources(_resources);
      return _newBlockClaimable;
    }
  }, [buildingData]);

  // Btn Claim
  useEffect(() => {
    if (block != null && blockGame) {
      const current_block = toBN(block?.block_number).toNumber();
      if (current_block >= blockGame) {
        setBtnClaim(true);
      } else {
        setBtnClaim(false);
      }
    }
  }, [block?.block_number, blockGame, claiming]);

  const zoomValue = useMemo(() => {
    return zoomMode;
  }, [zoomMode, wallet]);

  const buildMulticall = () => {
    console.log("building multicall w/ actions = ", payloadActions);

    const _calls: any[] = [];
    payloadActions.forEach((action) => {
      // // Build calldata
      // const _calldata: any[] = [];
      // const _data = action.calldata.split("|");
      // _data.forEach((elem: any) => {
      //   _calldata.push(elem);
      // });
      // _calls.push({
      //   contractAddress: resourcesContract?.address.toLowerCase() as string,
      //   entrypoint: action.entrypoint as string,
      //   calldata: _calldata,
      // });

      _calls.push({
        contractAddress: resourcesContract?.address.toLowerCase() as string,
        entrypoint: action.entrypoint as string,
        calldata: [uint256.bnToUint256(1), number.toFelt(16), number.toFelt(10)],
      });
    });

    console.log('_calls', _calls)

    wallet.account.getNonce().then((nonce: any) => {
      console.log("nonce", nonce);
      wallet.account.execute(_calls);
      // TODO : add nounce in execute multicall
    });
  };

  return (
    <>
      <div
        className="btnBug pixelated selectDisable"
        onClick={() =>
          window.open("https://forms.gle/87Ldvb1UTw53iUhH7", "_blank")
        }
      ></div>
      <div
        className="btnDoc pixelated selectDisable"
        onClick={() =>
          window.open(
            "https://frenslands.notion.site/Frens-Lands-0e227f03fa8044638ebcfff414c6be1f",
            "_blank"
          )
        }
      ></div>
      <div className="absolute selectDisable" style={{ zIndex: "1" }}>
        <div className="flex flex-row justify-center inline-block">
          {/* {sound ?
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
          } */}

          <div
            id="menuBar"
            className="relative flex jutify-center items-center inline-block pixelated"
            style={{ fontSize: "16px" }}
          >
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px", marginLeft: "35px" }}
            >
              <div id="menuGold" className="pixelated"></div>
              <div
                className="flex items-center fontTom_PXL pb-1 menuItems pixelated"
                style={{ marginTop: "-2px", marginLeft: "-10px" }}
              >
                {inventory[6]}
              </div>
              <div
                className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"
                style={{
                  marginTop: "-11px",
                  marginLeft: "3px",
                  color: "#55813E",
                  fontSize: "16px",
                }}
              >
                {claimableResources[10] ? "+" + claimableResources[10] : ""}
              </div>
            </div>
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuWood" className="pixelated"></div>
              <div
                className="flex items-center fontTom_PXL pb-1 menuItems pixelated"
                style={{ marginTop: "-2px", marginLeft: "-10px" }}
              >
                {inventory[0]}
              </div>
              <div
                className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"
                style={{
                  marginTop: "-11px",
                  marginLeft: "3px",
                  color: "#55813E",
                  fontSize: "16px",
                }}
              >
                {claimableResources[1] ? "+" + claimableResources[1] : ""}
              </div>
            </div>
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuRock" className="pixelated"></div>
              <div
                className="flex items-center fontTom_PXL pb-1 menuItems pixelated"
                style={{ marginTop: "-2px", marginLeft: "-10px" }}
              >
                {inventory[1]}
              </div>
              <div
                className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"
                style={{
                  marginTop: "-11px",
                  marginLeft: "3px",
                  color: "#55813E",
                  fontSize: "16px",
                }}
              >
                {claimableResources[2] ? "+" + claimableResources[2] : ""}
              </div>
            </div>
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuMetal" className="pixelated"></div>
              <div
                className="flex items-center fontTom_PXL pb-1 menuItems pixelated"
                style={{ marginTop: "-2px", marginLeft: "-10px" }}
              >
                {inventory[3]}
              </div>
              <div
                className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"
                style={{
                  marginTop: "-11px",
                  marginLeft: "3px",
                  color: "#55813E",
                  fontSize: "16px",
                }}
              >
                {claimableResources[6] ? "+" + claimableResources[6] : ""}
              </div>
            </div>
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuCoal" className="pixelated"></div>
              <div
                className="flex items-center fontTom_PXL pb-1 menuItems pixelated"
                style={{ marginTop: "-2px", marginLeft: "-10px" }}
              >
                {inventory[4]}
              </div>
              <div
                className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"
                style={{
                  marginTop: "-11px",
                  marginLeft: "3px",
                  color: "#55813E",
                  fontSize: "16px",
                }}
              >
                {claimableResources[8] ? "+" + claimableResources[8] : ""}
              </div>
            </div>
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuPop" className="pixelated"></div>
              <div
                className="flex items-center fontTom_PXL pb-1 menuItems pixelated"
                style={{ marginTop: "-2px", marginLeft: "-10px" }}
              >
                {inventory[9] - inventory[8]}
              </div>
            </div>
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuPopFree" className="pixelated"></div>
              <div
                className="flex items-center fontTom_PXL pb-1 menuItems pixelated"
                style={{ marginTop: "-2px", marginLeft: "-10px" }}
              >
                {inventory[8]}
              </div>
            </div>
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuMeat" className="pixelated"></div>
              <div
                className="flex items-center fontTom_PXL pb-1 menuItems pixelated"
                style={{ marginTop: "-2px", marginLeft: "-10px" }}
              >
                {inventory[2]}
              </div>
              <div
                className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"
                style={{
                  marginTop: "-11px",
                  marginLeft: "3px",
                  color: "#55813E",
                  fontSize: "16px",
                }}
              >
                {claimableResources[3] ? "+" + claimableResources[3] : ""}
              </div>
            </div>
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              <div id="menuEnergy" className="pixelated"></div>
              <div
                className="flex items-center fontTom_PXL pb-1 menuItems pixelated"
                style={{ marginTop: "-2px", marginLeft: "-10px" }}
              >
                {inventory[5]}
              </div>
              <div
                className="flex items-center fontHpxl_JuicySmall pb-1 menuItems pixelated"
                style={{
                  marginTop: "-11px",
                  marginLeft: "3px",
                  color: "#55813E",
                  fontSize: "16px",
                }}
              >
                {claimableResources[11] ? "+" + claimableResources[11] : ""}
              </div>
            </div>
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              {/* {tokenId && blockClaimable && blockClaimable > 0 ? ( */}
              <div
                className="btnClaim pixelated"
                onClick={() => claimResources()}
              ></div>
              {/* ) : (
              //   <div className="btnClaimDisabled pixelated"></div>
              // )} */}
            </div>
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              {tokenId && (
                <div
                  className="btnInit pixelated"
                  onClick={() => setPopUpInit(true)}
                ></div>
              )}
            </div>

            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              {tokenId && (
                <div
                  className="btnInit pixelated"
                  onClick={() => setPopUpTxCart(true)}
                ></div>
              )}
            </div>
          </div>
          {/* <div
              className="btnBottom pixelated"
              style={{ left: "5px" }}
            >
              <div className="menuSettings pixelated"></div>
            </div> */}
        </div>
      </div>
      <div
        onClick={() => updateZoom(!zoomValue, player["id" as any] as string)}
      >
        {zoomValue ? (
          <div className="checkZoom1 pixelated"></div>
        ) : (
          <div className="checkZoom0 pixelated"></div>
        )}
        <div className="btnZoom pixelated"></div>
      </div>
      <div
        className="absolute selectDisable"
        style={{ zIndex: "1", pointerEvents: "none" }}
      >
        <div className="subBar">
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "268px" }}
          >
            {/* {buildingData != null &&
            buildingData.total &&
            buildingData.total > 0
              ? buildingData.total
              : 0} */}
            {playerBuilding.length}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "452px" }}
          >
            {counterResources && counterResources[3] ? counterResources[3] : 0}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "570px" }}
          >
            {counterResources && counterResources[2] ? counterResources[2] : 0}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "700px" }}
          >
            {counterResources && counterResources[27]
              ? counterResources[27]
              : 0}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "898px" }}
          >
            {buildingData != null && buildingData.inactive != null
              ? Object.keys(buildingData.inactive).length
              : 0}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "1078px" }}
          >
            {buildingData != null && buildingData.active != null
              ? Object.keys(buildingData.active).length
              : 0}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "1261px" }}
          >
            {blockClaimable}
          </div>
        </div>
      </div>

      <Notifications />

      {popUpInit && (
        <div className="flex justify-center selectDisable">
          <div className="parentNotifInit">
            <div
              className="popUpNotifsAchievement pixelated fontHPxl-sm"
              style={{
                zIndex: 1,
                borderImage: `url(data:image/svg+xml;base64,${btoa(
                  UI_Frames
                )}) 18 fill stretch`,
                textAlign: "center",
              }}
            >
              <div
                className="closeAchievement"
                onClick={() => setPopUpInit(false)}
              ></div>
              <p>Beware fren !!</p>
              <br />
              <p>
                Are you sure you want to reset your land ? You will loose the
                entirety of your progression (buildings & resources). This
                action is irreversible, there is no coming back.
              </p>
              <div
                className="btnInit pixelated"
                onClick={() => reinitializeLand()}
              ></div>
            </div>
          </div>
        </div>
      )}

      {popUpTxCart && (
        <div className="flex justify-center selectDisable">
          <div className="parentNotifTxCart">
            <div
              className="popUpNotifsTxCart pixelated fontHPxl-sm"
              style={{
                overflowY: "auto",
                zIndex: 1,
                borderImage: `url(data:image/svg+xml;base64,${btoa(
                  UI_Frames
                )}) 18 fill stretch`,
                textAlign: "center",
              }}
            >
              <div
                className="closeTxCart"
                onClick={() => setPopUpTxCart(false)}
              ></div>
              <p>Your transactions</p>
              <br />
              {payloadActions.length > 0 ? (
                payloadActions.map((action: any, key: number) => {
                  var calldata = action.calldata.split("|");
                  var posX = parseInt(calldata[2]);
                  var posY = parseInt(calldata[3]);
                  return (
                    <div className="flex flex-row" key={key}>
                      <div>
                        <p>
                          #{key} :{" "}
                          <span className="capitalize">
                            {action.entrypoint}
                          </span>
                          {action.entrypoint === "harvest" && (
                            <>
                              <span>
                                {" "}
                                {
                                  staticResources[
                                    fullMap[posY][posX].randType - 1
                                  ].name
                                }
                              </span>
                              <span>
                                ({posX}, {posY})
                              </span>
                              <span></span>
                            </>
                          )}
                          {action.entrypoint === "build" && (
                            <>
                              <span>
                                {" "}
                                {
                                  staticBuildings[parseInt(calldata[4]) - 1]
                                    .name
                                }
                              </span>
                              <span>
                                ({posX}, {posY})
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>You don't have any actions to validate on-chain yet.</p>
              )}
              <div
                className="btnCustom pixelated relative"
                onClick={() => buildMulticall()}
              >
                <p
                  className="relative fontHpxl_JuicyXL"
                  style={{ marginTop: "47px" }}
                >
                  Send TX
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
