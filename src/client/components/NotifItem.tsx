import React, { useMemo } from "react";
import { useStarknet, InjectedConnector, useStarknetTransactionManager } from "@starknet-react/core";
import { MintMap } from "./Worlds/MintMap";

import useActiveNotifications from '../hooks/useNotifications'

// export default function NotifItem({ content }) {
export function NotifItem(props: any) {
  const activeNotifications = useActiveNotifications()

  console.log('activeNotifications', activeNotifications)

  console.log('props', props)
  const content = props.content;

  let textNotif = "";
  if (content.description.methods == "get_map") {
    textNotif = "Minting a map..."
  } else if (content.description.methods == "start_game") {
    textNotif = "Initializing game..."
  } else {
    textNotif = "Testing..."
  }

  return (
    <>
        <p>{textNotif}</p>
         {content.status && content.status == "NOT_RECEIVED" && <p>tx not received yet</p>}
         {content.status && content.status == "PENDING" && <p>tx pending</p>}
         {content.status && content.status == "RECEIVED" && <p>tx received</p>}
         {content.status && content.status == "ACCEPTED_ON_L2" && <p>tx accepted on L2</p>}
         {content.status && content.status == "ACCEPTED_ON_L1" && <p>tx accepted on L1</p>}
    </>
  )
}
