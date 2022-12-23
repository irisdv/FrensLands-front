import React, { useMemo, useState } from "react";
import Notifications from "../Notifications";
import UI_Frames from "../../style/resources/front/Ui_Frames3.svg";
import { useSelectContext } from "../../hooks/useSelectContext";
import { useNewGameContext } from "../../hooks/useNewGameContext";
import { useFLContract } from "../../hooks/contracts/frenslands";
import {
  bulkUpdateActions,
  // claimResourcesQuery,
  // reinitLand,
} from "../../api/player";
import { TransactionItem } from "./transactionItem";
import { initMapArr } from "../../utils/land";

export function MenuBar(props: any) {
  const {
    addAction,
    payloadActions,
    wallet,
    inventory,
    counters,
    playerBuilding,
    player,
    transactions,
    updateActions,
    updateCounters,
    updateClaimRegister,
    updateInventory,
    updatePlayerBuildings,
    updateMapBlock,
    fullMap,
  } = useNewGameContext();
  const { zoomMode, updateZoom } = useSelectContext();
  const frenslandsContract = useFLContract();
  const [popUpInit, setPopUpInit] = useState(false);
  const [popUpTxCart, setPopUpTxCart] = useState(false);

  const initialMap = useMemo(() => {
    return initMapArr(wallet.account.address);
  }, [wallet]);

  const claimResources = async () => {
    // Multicall
    console.log("actions before claiming = ", payloadActions);

    if (wallet.isConnected && player.tokenId > 0) {
      wallet.account.getBlock().then((block: any) => {
        // Update player inventory
        for (let i = 0; i < 7; i++) {
          inventory[i] += counters["incomingInventory" as any][i];
        }

        // Update lastClaimedRegister
        if (player.claimRegister == 0) {
          player.claimRegister = block.block_number.toString();
        } else {
          player.claimRegister += "|" + block.block_number.toString();
        }
        console.log("player claimRegister", player.claimRegister);
        updateClaimRegister(player.claimRegister);

        // Reinit counters in context
        counters["incomingInventory" as any][0] = 0;
        counters["incomingInventory" as any][1] = 0;
        counters["incomingInventory" as any][2] = 0;
        counters["incomingInventory" as any][3] = 0;
        counters["incomingInventory" as any][4] = 0;
        counters["incomingInventory" as any][5] = 0;
        counters["incomingInventory" as any][6] = 0;
        counters["incomingInventory" as any][7] = 0;
        counters["nbBlocksClaimable" as any] = 0;
        updateCounters(counters);

        const calldata = player.tokenId + "|0|" + block.block_number;
        addAction({
          entrypoint: "claim_production",
          calldata: calldata,
          status: "",
          txHash: "",
          validated: false,
        });
      });
    } else {
      console.log("missing tokenId");
    }
  };

  const reinitializeLand = async () => {
    if (player.tokenId) {
      // Update inventory
      inventory.map((elem: any, index: any) => {
        inventory[index] = 0;
      });
      console.log("inventory", inventory);
      updateInventory(inventory);

      // Update buildings
      let _buildings = playerBuilding.filter((res) => {
        return res.gameUid == 1;
      });
      updatePlayerBuildings(_buildings);

      updateMapBlock(initialMap);

      counters[1] = [];
      counters[2] = [];
      counters["incomingInventory" as any] = [];
      counters["inactive" as any] = 0;
      counters["active" as any] = 0;
      counters["blockClaimable" as any] = 0;
      updateCounters(counters);

      let hasStarted = true;
      const _hasStarted = payloadActions.filter((action: any) => {
        return action.entrypoint == "start_game";
      });
      if (_hasStarted && _hasStarted.length > 0) hasStarted = false;

      let _actions = [
        {
          entrypoint: hasStarted ? "reinit_game" : "start_game",
          calldata: player.tokenId + "|0",
          status: "",
          txHash: "",
          validated: false,
        },
      ];
      updateActions(_actions);
      setPopUpInit(false);
    }
  };

  const zoomValue = useMemo(() => {
    return zoomMode;
  }, [zoomMode, wallet]);

  const buildMulticall = async () => {
    console.log("building multicall w/ actions = ", payloadActions);

    const _calls: any[] = [];
    payloadActions.forEach((action: any) => {
      // Build calldata
      if (
        action.status != "TRANSACTION_RECEIVED" &&
        action.status != "ACCEPTED_ON_L2"
      ) {
        const _calldata: any[] = [];
        const _data = action.calldata.split("|");

        _data.forEach((elem: any) => {
          _calldata.push(elem);
        });
        _calls.push({
          contractAddress: frenslandsContract.address.toLowerCase(),
          entrypoint: action.entrypoint as string,
          calldata: _calldata,
        });
      }
    });

    wallet.account.execute(_calls).then((response: any) => {
      console.log("response", response);
      response.show = true;
      transactions.push(response);

      payloadActions.map((action: any) => {
        action.status = response.code;
        action.txHash = response.transaction_hash;
      });
      updateActions(payloadActions);

      // Update in DB
      // const _updatedActions = bulkUpdateActions(player, payloadActions);
      setPopUpTxCart(false);
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
                {counters &&
                counters["incomingInventory" as any] &&
                counters["incomingInventory" as any][6]
                  ? "+" + counters["incomingInventory" as any][6]
                  : ""}
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
                {counters &&
                counters["incomingInventory" as any] &&
                counters["incomingInventory" as any][0]
                  ? "+" + counters["incomingInventory" as any][0]
                  : ""}
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
                {counters &&
                counters["incomingInventory" as any] &&
                counters["incomingInventory" as any][1]
                  ? "+" + counters["incomingInventory" as any][1]
                  : ""}
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
                {counters &&
                counters["incomingInventory" as any] &&
                counters["incomingInventory" as any][3]
                  ? "+" + counters["incomingInventory" as any][3]
                  : ""}
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
                {counters &&
                counters["incomingInventory" as any] &&
                counters["incomingInventory" as any][4]
                  ? "+" + counters["incomingInventory" as any][4]
                  : ""}
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
                {counters &&
                counters["incomingInventory" as any] &&
                counters["incomingInventory" as any][2]
                  ? "+" + counters["incomingInventory" as any][2]
                  : ""}
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
                {counters &&
                counters["incomingInventory" as any] &&
                counters["incomingInventory" as any][5]
                  ? "+" + counters["incomingInventory" as any][5]
                  : ""}
              </div>
            </div>
            <div
              className="flex jutify-center relative mx-auto"
              style={{ marginTop: "-13px" }}
            >
              {counters["incomingInventory" as any].filter((elem: any) => {
                return elem > 0;
              }).length > 0 ? (
                <div
                  className="btnClaim pixelated"
                  onClick={async () => await claimResources()}
                ></div>
              ) : (
                <div className="btnClaimDisabled pixelated"></div>
              )}
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
              {player.tokenId && (
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
        {player.tokenId && (
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
      <div onClick={() => updateZoom(!zoomValue)}>
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
            {Object.keys(playerBuilding).length}
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
            {counters && counters["inactive" as any]}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "1078px" }}
          >
            {counters && counters["active" as any]}
          </div>
          <div
            className="fontHpxl_JuicySmall absolute"
            style={{ marginTop: "16px", marginLeft: "1261px" }}
          >
            {counters && counters["blockClaimable" as any]}
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
                onClick={async () => await reinitializeLand()}
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
                    const calldata = action.calldata.split("|");
                    let status = "not sent";
                    if (action.status == "TRANSACTION_RECEIVED") {
                      status = "ongoing";
                    } else if (action.status == "ACCEPTED_ON_L2") {
                      status = "accepted";
                    }
                    if (
                      action.status != "ACCEPTED_ON_L2" ||
                      action.status != "ACCEPTED_ON_L1"
                    ) {
                      return (
                        <TransactionItem
                          key={key}
                          index={key}
                          status={status}
                          calldata={calldata}
                          entrypoint={action.entrypoint}
                          initialMap={initialMap}
                        />
                      );
                    }
                  })
                ) : (
                  <p>You don't have any actions to validate on-chain yet.</p>
                )}
                {payloadActions.filter((action: any) => {
                  return action.status != "TRANSACTION_RECEIVED";
                }).length > 0 && (
                  <div
                    className="btnCustom pixelated relative"
                    onClick={async () => await buildMulticall()}
                  >
                    <p
                      className="relative fontHpxl_JuicyXL"
                      style={{ marginTop: "47px" }}
                    >
                      Send TX
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
