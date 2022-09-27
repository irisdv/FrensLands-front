import React, { useCallback, useEffect } from "react";
import useActiveNotifications from "../hooks/useNotifications";
import { useNotifTransactionManager } from "../providers/transactions";
import UI_Frames from "../style/resources/front/Ui_Frames3.svg";
import { allBuildings } from "../data/buildings";

export function NotifItem(props: any) {
  const activeNotifications = useActiveNotifications();
  const { removeTransaction, transactions } = useNotifTransactionManager();
  const { content, notifKey, status } = props;

  const index = activeNotifications
    .map(function (e) {
      return e.transactionHash;
    })
    .indexOf(notifKey);
  const removeThisTransaction = useCallback(
    () => removeTransaction(notifKey),
    [notifKey, status]
  );

  let textNotif = "";
  if (
    status &&
    (status == "NOT_RECEIVED" || status == "PENDING" || status == "RECEIVED")
  ) {
    if (content.method == "get_map") {
      textNotif = "Minting a map...";
    } else if (content.method == "start_game") {
      textNotif = "IN Launched initialization of your game.";
    } else if (content.method == "harvest_resources") {
      textNotif =
        "IN Launched harvest on " +
        allBuildings[content.type_id - 1].name +
        " " +
        content.posX +
        " " +
        content.posY;
    } else if (content.method == "claim_resources") {
      textNotif = "IN Launched claim resources.";
    } else if (content.method == "build") {
      textNotif =
        "IN Launched build a " +
        allBuildings[content.type_id - 1].name +
        " on " +
        content.posX +
        " " +
        content.posY;
    } else if (content.method == "approve") {
      textNotif = "IN Launched setting approval.";
    } else if (content.method == "destroy_building") {
      textNotif =
        "IN Launched destroy " +
        allBuildings[content.type_id - 1].name +
        " on " +
        content.posX +
        " " +
        content.posY;
    } else if (content.method == "upgrade") {
      textNotif = "IN Launched upgrade cabin.";
    } else if (content.method == "reinitialize") {
      textNotif = "IN Launched reset land.";
    } else if (content.method == "recharge_building") {
      textNotif =
        "IN Launched recharge production of " +
        allBuildings[content.type_id - 1].name +
        " on " +
        content.posX +
        " " +
        content.posY;
    } else {
      textNotif = "IN Testing...";
    }
  } else if (status && status == "ACCEPTED_ON_L2") {
    if (content.method == "get_map") {
      textNotif =
        "OUT You received your map. Now you can initialize your game.";
    } else if (content.method == "start_game") {
      textNotif = "OUT Your game was initialized.";
    } else if (content.method == "harvest_resources") {
      textNotif =
        "OUT Harvest completed for " +
        allBuildings[content.type_id - 1].name +
        " " +
        content.posX +
        " " +
        content.posY;
    } else if (content.method == "claim_resources") {
      textNotif = "OUT Claim resources completed.";
    } else if (content.method == "build") {
      textNotif =
        "OUT Build completed for " +
        allBuildings[content.type_id - 1].name +
        " " +
        content.posX +
        " " +
        content.posY;
    } else if (content.method == "approve") {
      textNotif =
        "OUT Set approval completed. You're all set, you can now start playing!";
    } else if (content.method == "destroy_building") {
      textNotif =
        "OUT Destroy completed for " +
        allBuildings[content.type_id - 1].name +
        " on " +
        content.posX +
        " " +
        content.posY;
    } else if (content.method == "upgrade") {
      textNotif = "OUT Upgrade cabin completed.";
    } else if (content.method == "reinitialize") {
      textNotif = "OUT Reset land completed.";
    } else if (content.method == "recharge_building") {
      textNotif =
        "OUT Recharge production completed for " +
        allBuildings[content.type_id - 1].name +
        " on " +
        content.posX +
        " " +
        content.posY;
    } else {
      textNotif = "OUT Test tx accepted.";
    }
  } else if (status && status == "REJECTED") {
    textNotif =
      "OUT Your transaction " + content.method + "was rejected... Try again.";
  }

  if (status && status == "ACCEPTED_ON_L1") {
    return <></>;
  }

  return (
    <>
      <div
        className="parentNotifGame"
        style={{ bottom: index * 100 + 18 + "px" }}
      >
        <div
          className="popUpNotifsGame pixelated fontHPxl-sm"
          onClick={() => removeThisTransaction()}
          style={{
            borderImage: `url(data:image/svg+xml;base64,${btoa(
              UI_Frames
            )}) 18 fill stretch`,
          }}
        >
          <div className="closeNotif"></div>
          <p>{textNotif}</p>
          {/* {status && status == "NOT_RECEIVED" && <p>tx not received yet</p>}
            {status && status == "PENDING" && <p>tx pending</p>}
            {status && status == "RECEIVED" && <p>tx received</p>}
            {status && status == "ACCEPTED_ON_L2" && <p>tx accepted on L2</p>}
            {status && status == "ACCEPTED_ON_L1" && <p>tx accepted on L1</p>} */}
        </div>
      </div>
    </>
  );
}
