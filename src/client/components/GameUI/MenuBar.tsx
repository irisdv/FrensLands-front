import React, { useMemo, useState, useEffect } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import Notifications from "../Notifications";
import UI_Frames from "../../style/resources/front/Ui_Frames3.svg";
import { useSelectContext } from "../../hooks/useSelectContext";
// import useReinitialize from "../../hooks/invoke/useReinitialize";
import { useNewGameContext } from "../../hooks/useNewGameContext";
import { useFLContract } from "../../hooks/contracts/frenslands";
import { bulkUpdateActions, reinitLand } from "../../api/player";
import { TransactionItem } from "./transactionItem";

export function MenuBar(props: any) {
  const { payloadActions } = props;
  const {
    addAction,
    // payloadActions,
    wallet,
    inventory,
    counters,
    playerBuilding,
    player,
    fullMap,
    staticResources,
    staticBuildings,
    transactions,
    updateActions,
  } = useNewGameContext();
  const { zoomMode, updateZoom } = useSelectContext();
  const {
    tokenId,
    updateTokenId,
    setAddress,
    // blockGame,
    buildingData,
    // nonce,
    // updateNonce,
    // counterResources,
    accountContract,
  } = useGameContext();

  const frenslandsContract = useFLContract();
  // const [claiming, setClaiming] = useState<any>(null);
  // const [btnClaim, setBtnClaim] = useState(false);
  const [popUpInit, setPopUpInit] = useState(false);
  const [popUpTxCart, setPopUpTxCart] = useState(false);
  const [claimableResources, setClaimableResources] = useState<any[]>([]);

  useEffect(() => {
    if (wallet && wallet.isConnected) setAddress(wallet.account.address);
  }, [wallet]);

  useEffect(() => {
    console.log("payloadActions useEffect", payloadActions);
  }, [payloadActions]);

  useEffect(() => {
    if (wallet && wallet.isConnected && !tokenId) {
      updateTokenId(wallet.account.address);
    }
  }, [wallet, tokenId]);

  // Invoke claim resources
  const claimResources = () => {
    // Multicall
    console.log("actions = ", payloadActions);

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

  // const nonceValue = useMemo(() => {
  //   console.log("new nonce value", nonce);
  //   return nonce;
  // }, [nonce]);

  const reinitializeLand = async () => {
    if (tokenId) {
      // const result = await wallet.account.execute([
      //   {
      //     contractAddress: frenslandsContract?.address as string,
      //     entrypoint: "reinit_game",
      //     calldata: [tokenId, 0],
      //   },
      // ]);
      // console.log("result from tx reinit", result);

      const result = {
        code: "TRANSACTION_RECEIVED",
        transaction_hash:
          "0x1c4a2c6c3398cac008a66e727af63248b55aac85e6259308f059b34fc0ce311",
      };

      let _reinitializeGame = await reinitLand(player, playerBuilding, result);
      console.log("_initializeGame", _reinitializeGame);

      window.location.reload();
    }
  };

  const blockClaimable = useMemo(() => {
    if (buildingData != null) {
      let _newBlockClaimable = 0;
      const _resources: any[] = [];

      // buildingData.active?.forEach((elem: any) => {
      //   if (elem.recharges) {
      //     // check lasr claim block number
      //     // current block - last_claim block > then add recharges
      //     if (block?.block_number) {
      //       const check =
      //         toBN(block?.block_number).toNumber() - elem.last_claim;
      //       let block2Claim = 0;
      //       if (check > elem.recharges) {
      //         block2Claim = elem.recharges;
      //       } else {
      //         block2Claim = check;
      //       }
      //       _newBlockClaimable += block2Claim;

      //       // Get resources to harvest for each claimable building
      //       if (block2Claim > 0) {
      //         allBuildings[elem.type - 1].daily_harvest?.[0].resources.map(
      //           (elem: any) => {
      //             let _currValue = 0;
      //             if (_resources[elem.id] && _resources[elem.id] > 0) {
      //               _currValue = _resources[elem.id] + elem.qty * block2Claim;
      //             } else {
      //               _currValue += elem.qty * block2Claim;
      //             }
      //             _resources[elem.id] = _currValue;
      //           }
      //         );
      //       }
      //     }
      //   }
      // });
      setClaimableResources(_resources);
      return _newBlockClaimable;
    }
  }, [buildingData]);

  // Btn Claim
  // useEffect(() => {
  //   if (block != null && blockGame) {
  //     const current_block = toBN(block?.block_number).toNumber();
  //     if (current_block >= blockGame) {
  //       setBtnClaim(true);
  //     } else {
  //       setBtnClaim(false);
  //     }
  //   }
  // }, [block?.block_number, blockGame, claiming]);

  const zoomValue = useMemo(() => {
    return zoomMode;
  }, [zoomMode, wallet]);

  const buildMulticall = () => {
    console.log("building multicall w/ actions = ", payloadActions);

    const _calls: any[] = [];
    payloadActions.forEach((action: any) => {
      // Build calldata
      const _calldata: any[] = [];
      const _data = action.calldata.split("|");
      _data.forEach((elem: any) => {
        _calldata.push(elem);
      });
      _calls.push({
        contractAddress: frenslandsContract.address.toLowerCase() as string,
        entrypoint: action.entrypoint as string,
        calldata: _calldata,
      });
    });

    console.log("_calls", _calls);

    // wallet.account.getNonce().then((nonce: any) => {
    // console.log("nonce", nonce);
    wallet.account.execute(_calls).then((response: any) => {
      console.log("response", response);

      transactions.push(response);

      payloadActions.map((action: any) => {
        action.status = response.code;
        action.transaction_hash = response.transaction_hash;
      });
      console.log("payloadActions menubar", payloadActions);
      // Update payload in context
      // updateActions(payloadActions);

      // Update in DB
      let _updatedActions = bulkUpdateActions(player, payloadActions);

      // Update context status to onhoing / tx hash
    });
    // });
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
            {/* <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              {tokenId && (
                <div
                  className="btnInit pixelated"
                  onClick={() => setPopUpInit(true)}
                ></div>
              )}
            </div> */}

            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              {tokenId && (
                <div
                  className="btnCustom pixelated relative"
                  onClick={() => setPopUpTxCart(true)}
                  style={{ marginTop: "-40px" }}
                >
                  <p
                    className="relative fontHpxl_JuicyXL"
                    style={{ marginTop: "47px", marginLeft: "63px" }}
                  >
                    My tx
                  </p>
                </div>
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
        className="flex jutify-center absolute mx-auto"
        style={{ bottom: "0px", left: "0px", zIndex: "1" }}
      >
        {tokenId && (
          <div
            className="btnInit pixelated"
            onClick={() => setPopUpInit(true)}
          ></div>
        )}
      </div>
      <div className="snackbar-centered">
        <div id="snackbar-fixed-container">
          <Notifications />
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
            {playerBuilding.length}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "452px" }}
          >
            {counters[1][1]}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "570px" }}
          >
            {counters[1][2]}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "700px" }}
          >
            {counters[1][3]}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "898px" }}
          >
            {/* // TODO update inactive buildings */}
            {buildingData != null && buildingData.inactive != null
              ? Object.keys(buildingData.inactive).length
              : 0}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "1078px" }}
          >
            {/* // TODO update active buildings */}
            {buildingData != null && buildingData.active != null
              ? Object.keys(buildingData.active).length
              : 0}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "1261px" }}
          >
            {/* // TODO update blocks claimable */}
            {blockClaimable}
          </div>
        </div>
      </div>

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
              <div style={{ overflowY: "auto", height: "310px" }}>
                {payloadActions.length > 0 ? (
                  payloadActions.map((action: any, key: number) => {
                    var calldata = action.calldata.split("|");
                    var status = 0;
                    if (action.status == "TRANSACTION_RECEIVED") {
                      status = 1;
                    } else if (action.status == "ACCEPTED_ON_L2") {
                      status = 2;
                    }
                    if (
                      action.status != "ACCEPTED_ON_L2" ||
                      action.status != "ACCEPTED_ON_L1"
                    )
                      return (
                        <TransactionItem
                          key={key}
                          index={key}
                          status={status}
                          calldata={calldata}
                          entrypoint={action.entrypoint}
                        />
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
        </div>
      )}
    </>
  );
}
