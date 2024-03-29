import React, { useCallback, useEffect, useState } from "react";
import UI_Frames from "../style/resources/front/Ui_Frames3.svg";
import { useNewGameContext } from "../hooks/useNewGameContext";

export function NotifItem(props: any) {
  const { transactions, removeTransaction } = useNewGameContext();
  const { transaction_hash, code, show } = props;
  const [showNotif, setShowNotif] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowNotif(false);
      if (transactions && transactions[index]) {
        if (transactions[index].code == "TRANSACTION_RECEIVED") {
          transactions[index].show = false;
        } else if (
          transactions[index].code == "ACCEPTED_ON_L2" ||
          transactions[index].code == "REJECTED"
        ) {
          transactions.splice(index, 1);
        }
      }
    }, 10000);
  }, []);

  const index = transactions
    .map(function (e) {
      return e.transaction_hash;
    })
    .indexOf(transaction_hash);

  const removeThisTransaction = useCallback(() => {
    // removeTransaction(transaction_hash)
    if (transactions[index].code == "TRANSACTION_RECEIVED") {
      transactions[index].show = false;
    } else if (
      transactions[index].code == "ACCEPTED_ON_L2" ||
      transactions[index].code == "REJECTED"
    ) {
      transactions.splice(index, 1);
      console.log("transactions after splice", transactions);
    }
    setShowNotif(false);
  }, [transaction_hash, show]);

  let textNotif = "";
  if (code == "TRANSACTION_RECEIVED") {
    textNotif = "Transaction was received.";
  } else if (code == "ACCEPTED_ON_L2") {
    textNotif = "Your transaction was accepted on L2.";
  } else if (code == "REJECTED") {
    textNotif = "Your transaction was rejected. Try again.";
  }

  const explorerUri = "https://testnet.starkscan.co/tx/" + transaction_hash;

  if (show == false) {
    return <></>;
  }

  return (
    <>
      {showNotif && (
        <div
          className="parentNotifGame"
          style={{ bottom: index * 100 + 70 + "px" }}
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
            <a
              href={explorerUri}
              target="_blank"
              style={{ color: "#964489" }}
              className="cursor-pointer underline"
              rel="noreferrer"
            >
              Tx information
            </a>
          </div>
        </div>
      )}
    </>
  );
}
