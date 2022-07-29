import React, { useCallback, useEffect } from "react";
import useActiveNotifications from '../hooks/useNotifications'
import { useNotifTransactionManager } from "../providers/transactions";

// export default function NotifItem({ content }) {
export function NotifItem(props: any) {
  const activeNotifications = useActiveNotifications()
  const { removeTransaction, transactions } = useNotifTransactionManager()
  const { content, notifKey, status} = props

  var index = activeNotifications.map(function(e) { return e.transactionHash; }).indexOf(notifKey);
  const removeThisTransaction = useCallback(() => removeTransaction(notifKey), [notifKey, status])

  console.log('transactions', transactions)

  let textNotif = "";
  if (content.method == "get_map") {
    textNotif = "Minting a map..."
  } else if (content.method  == "start_game") {
    textNotif = "Initializing game..."
  } else if (content.method == "harvest_resources") {
    textNotif = "Frens are harvesting..."
  } else if (content.method == "claim_resources") {
    textNotif = "Your resources are on it's way..."
  } else if (content.method == "build") {
    textNotif = "Frens are building hard... Almost ready..."
  } else if (content.method == "approve") {
    textNotif = "Aproving... Almost ready..."
  } else if (content.method == "destroy_building") {
    textNotif = "Frens are on there way to destroy your building..."
  } else {
    textNotif = "Testing..."
  }

  return (
    <>
        <div className="popUpNotifsGame pixelated fontHPxl-sm" onClick={() => removeThisTransaction()}  style={{zIndex: index+1, bottom: (index * 128)+"px" }} >
            <div className="closeNotif"></div>
            <p>{textNotif}</p>
            {status && status == "NOT_RECEIVED" && <p>tx not received yet</p>}
            {status && status == "PENDING" && <p>tx pending</p>}
            {status && status == "RECEIVED" && <p>tx received</p>}
            {status && status == "ACCEPTED_ON_L2" && <p>tx accepted on L2</p>}
            {status && status == "ACCEPTED_ON_L1" && <p>tx accepted on L1</p>}
            {status && status == "REJECTED" && <p>tx was rejected... try again</p>}
         </div>
    </>
  )
}
