import React from "react";
import useActiveNotifications from '../hooks/useNotifications'
import { NotifItem } from "./NotifItem";

export default function Notifications() {
  const activeNotifications = useActiveNotifications()

  if (activeNotifications) console.log('Transactions', activeNotifications)

  return (
    <>
    {activeNotifications.map((item) => (
      <NotifItem  key={item.transactionHash} content={item.metadata} status={item.status} notifKey={item.transactionHash} />
    ))}

    </>
  )
}
