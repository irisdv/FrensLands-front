import React, { useMemo } from "react";
import { useNewGameContext } from "../hooks/useNewGameContext";
import { NotifItem } from "./NotifItem";

export default function Notifications() {
  const { transactions } = useNewGameContext();

  const txToShow = useMemo(() => {
    const tx = transactions.filter((elem) => {
      return elem.show == true;
    });
    return tx;
  }, [transactions]);

  return (
    <>
      {txToShow.map((item: any) => {
        return (
          <NotifItem
            key={item.transaction_hash}
            transaction_hash={item.transaction_hash}
            code={item.code}
            show={item.true}
          />
        );
      })}
    </>
  );
}
