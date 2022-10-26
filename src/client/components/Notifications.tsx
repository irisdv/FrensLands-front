import React from "react";
import { useNewGameContext } from "../hooks/useNewGameContext";
import { NotifItem } from "./NotifItem";

export default function Notifications() {
  const { transactions } = useNewGameContext();

  return (
    <>
      {transactions &&
        transactions.length > 0 &&
        transactions.map((item: any) => {
          if (item.show) {
            return (
              <NotifItem
                key={item.transaction_hash + "_" + Date.now()}
                transaction_hash={item.transaction_hash}
                code={item.code}
                show={item.true}
              />
            );
          }
        })}
    </>
  );
}
