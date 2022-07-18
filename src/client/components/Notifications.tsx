import React, { useMemo } from "react";
import { useStarknet, InjectedConnector, useStarknetTransactionManager } from "@starknet-react/core";
import { MintMap } from "./Worlds/MintMap";

import useActiveNotifications from '../hooks/useNotifications'
import { NotifItem } from "./NotifItem";

export default function Notifications() {
  const activeNotifications = useActiveNotifications()

  // console.log('activeNotifications', activeNotifications)

  return (
    <>
    {activeNotifications.map((item) => (
      <NotifItem  key={item.key} content={item.content} notifKey={item.key} />
    ))}

    </>
  )
}
