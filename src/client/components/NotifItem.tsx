import React, { useCallback, useEffect } from "react";
import useActiveNotifications from '../hooks/useNotifications'
import { useNotifTransactionManager } from "../providers/transactions";

// export default function NotifItem({ content }) {
export function NotifItem(props: any) {
  const activeNotifications = useActiveNotifications()
  const { removeNotif, removeTransaction } = useNotifTransactionManager()

  const content = props.content;
  const notifKey = props.notifKey
  var index = activeNotifications.map(function(e) { return e.key; }).indexOf(notifKey);

  const removeThisNotif = useCallback(() => removeNotif(notifKey), [notifKey, removeNotif])
  const removeThisTransaction = useCallback(() => removeTransaction(content.description.transactionHash), [content.description.transactionHash, removeNotif])

  // useEffect(() => {
  //   // if (removeAfterMs === null) return undefined

  //   if (content.status && content.status == "ACCEPTED_ON_L2") {
  //       // const timeout = setTimeout(() => {
  //       //     removeThisNotif()
  //       // }, 5000)
    
  //       // return () => {
  //       //   clearTimeout(timeout)
  //       // }
  //       return undefined;
  //   }
  // }, [removeThisNotif, content.status])

  // console.log('activeNotifications', activeNotifications)
  // console.log('props', props)

  let textNotif = "";
  if (content.description.method == "get_map") {
    textNotif = "Minting a map..."
  } else if (content.description.method  == "start_game") {
    textNotif = "Initializing game..."
  } else if (content.description.method == "harvest_resources") {
    textNotif = "Frens are harvesting..."
  } else if (content.description.method == "claim_resources") {
    textNotif = "Your resources are on it's way..."
  } else if (content.description.method == "build") {
    textNotif = "Frens are building hard... Almost ready..."
  } else if (content.description.method == "approve") {
    textNotif = "Aproving... Almost ready..."
  } else {
    textNotif = "Testing..."
  }

  return (
    <>
        <div className="popUpNotifsGame pixelated fontHPxl-sm" onClick={() => removeThisNotif()}  style={{zIndex: index+1 }} >
            <p>{textNotif}</p>
            {content.status && content.status == "NOT_RECEIVED" && <p>tx not received yet</p>}
            {content.status && content.status == "PENDING" && <p>tx pending</p>}
            {content.status && content.status == "RECEIVED" && <p>tx received</p>}
            {content.status && content.status == "ACCEPTED_ON_L2" && <p>tx accepted on L2</p>}
            {content.status && content.status == "ACCEPTED_ON_L1" && <p>tx accepted on L1</p>}
            {content.status && content.status == "REJECTED" && <p>tx was rejected... try again</p>}
         </div>
    </>
  )
}
