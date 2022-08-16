import React, { useCallback, useEffect } from "react";
import useActiveNotifications from '../hooks/useNotifications'
import { useNotifTransactionManager } from "../providers/transactions";
import UI_Frames from '../style/resources/front/Ui_Frames3.svg';
import { allBuildings } from "../data/buildings";

export function NotifItem(props: any) {
  const activeNotifications = useActiveNotifications()
  const { removeTransaction, transactions } = useNotifTransactionManager()
  const { content, notifKey, status} = props

  var index = activeNotifications.map(function(e) { return e.transactionHash; }).indexOf(notifKey);
  const removeThisTransaction = useCallback(() => removeTransaction(notifKey), [notifKey, status])

  console.log('transactions', transactions)

  // content.building_type_id

  let textNotif = "";
  if (content.method == "get_map") {
    textNotif = "Minting a map..."
  } else if (content.method  == "start_game") {
    textNotif = "Initializing game..."
  } else if (content.method == "harvest_resources") {
    textNotif = "Frens are harvesting a " + allBuildings[content.type_id - 1].name + "..."
  } else if (content.method == "claim_resources") {
    textNotif = "Your resources are on their way..."
  } else if (content.method == "build") {
    textNotif = "Frens are building your " + allBuildings[content.type_id - 1].name + "..."
  } else if (content.method == "approve") {
    textNotif = "Aproving..."
  } else if (content.method == "destroy_building") {
    textNotif = "Frens are on there way to destroy your building..."
  } else if (content.method == "upgrade") {
    textNotif = "Upgrading your cabin..."
  } else {
    textNotif = "Testing..."
  }

  return (
    <>
      <div className="parentNotifGame" style={{bottom: (index * 100 + 18)+"px"}}>
        <div className="popUpNotifsGame pixelated fontHPxl-sm" onClick={() => removeThisTransaction()}  style={{borderImage: `url(data:image/svg+xml;base64,${btoa(UI_Frames)}) 18 fill stretch` }} >
            <div className="closeNotif"></div>
            <p>{textNotif}</p>
            {status && status == "NOT_RECEIVED" && <p>tx not received yet</p>}
            {status && status == "PENDING" && <p>tx pending</p>}
            {status && status == "RECEIVED" && <p>tx received</p>}
            {status && status == "ACCEPTED_ON_L2" && <p>tx accepted on L2</p>}
            {status && status == "ACCEPTED_ON_L1" && <p>tx accepted on L1</p>}
            {status && status == "REJECTED" && <p>tx was rejected... try again</p>}
        </div>
      </div>
    </>
  )
}
