import React, { useEffect, useMemo, useState } from "react";
import { useQuery, gql } from "@apollo/client";

import { hexToDecimalString } from "starknet/utils/number";
import { allMetadata } from "../../data/metadata";
import UI_Frames from "../../style/resources/front/Ui_Frames3.svg";
import { getLandByTokenId, initGame } from "../../api/player";
import { useNewGameContext } from "../../hooks/useNewGameContext";
import { useFLContract } from "../../hooks/contracts/frenslands";
import { useNavigate } from "react-router-dom";

export const TOKENS_QUERY = gql`
  query tokens($owner: HexValue) {
    tokens(owner: $owner) {
      tokenId
      owner
    }
  }
`;

export const INIT_QUERY = gql`
  query tokens($owner: HexValue) {
    tokens(owner: $owner) {
      tokenId
      owner
    }
  }
`;

export default function MenuHome(props: any) {
  const { account, userId } = props;
  const { wallet } = useNewGameContext();
  const { contract: frenslands } = useFLContract();
  const navigate = useNavigate();

  const [isReady, setIsReady] = useState(false);
  const [initArray, setInitArray] = useState<any[]>([]);

  const {
    data,
    loading: dataLoading,
    error,
  } = useQuery(TOKENS_QUERY, {
    variables: {
      owner: account as HexValue,
    },
  });

  const tokenIdsArray = useMemo(() => {
    if (data && data.tokens && data.tokens.length > 0) {
      let _tokenIds: any[] = [];
      console.log("data", data);
      data.tokens.map((land: any) => {
        _tokenIds.push(parseInt(hexToDecimalString(land.tokenId)));
      });
      console.log("_tokenIds array", _tokenIds);

      return _tokenIds;
    }
  }, [data, isReady]);

  useEffect(() => {
    if (tokenIdsArray && tokenIdsArray.length > 0) {
      let _initArray: any[] = [];
      getLandByTokenId(tokenIdsArray).then((res: any) => {
        res.map((elem: any) => {
          _initArray[elem.tokenId] = elem;
        });
        setInitArray(_initArray);
      });
    }
  }, [tokenIdsArray]);

  useEffect(() => {
    if (initArray && initArray.length > 0) setIsReady(true);
  }, [initArray]);

  const startGame = (_tokenId: number) => {
    // console.log("starting game for tokendId", _tokenId);
    // console.log("initArray defined", initArray);

    if (initArray && initArray[_tokenId]) {
      if (initArray[_tokenId].isInit) {
        console.log("isInit", initArray[_tokenId].isInit);
        navigate("/play", { state: { id: _tokenId } });

        // ? const {state} = useLocation();
        // ? const { id, color } = state; // Read values passed on state

      } else {
        // If not init onchain send tx

        // Send tx to init game onchain
        // let nonce = await wallet.account.getNonce();
        // const result = await wallet.account.execute(
        //   [
        //     {
        //       contractAddress: frenslands?.address as string,
        //       entrypoint: "start_game",
        //       calldata: [_tokenId, 0, initArray[_tokenId].biomeId],
        //     },
        //   ],
        //   undefined,
        //   { maxFee: 500, nonce }
        // );
        // console.log("result from tx", result);

        // TODO init game in DB
        let _initializeGame = initGame(initArray[_tokenId].id);
        console.log("init", _initializeGame);
      }
    }
  };

  if (!isReady)
    return (
      <>
        <div className="messageNotifParent">
          <div
            className="messageNotif fontHPxl-sm mx-auto text-center"
            style={{
              borderImage: `url(data:image/svg+xml;base64,${btoa(
                UI_Frames
              )}) 18 fill stretch`,
            }}
          >
            <p>Loading your lands...</p>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <div className="messageNotifParent">
          <div
            className="messageNotif fontHPxl-sm mx-auto text-center"
            style={{
              borderImage: `url(data:image/svg+xml;base64,${btoa(
                UI_Frames
              )}) 18 fill stretch`,
            }}
          >
            <p>Error while loading your lands</p>
          </div>
        </div>
      </>
    );

  return (
    <>
      {data && data.tokens && isReady && initArray && (
        <>
          <div className={`grid grid-cols-${data.tokens.length} px-8`}>
            {data.tokens.map((land: any) => {
              let _metadata = allMetadata.filter(
                (res) => res.id == (land.tokenId as any)
              );
              return (
                <div
                  className="cursor-pointer px-5"
                  key={land.tokenId}
                  onClick={() =>
                    startGame(parseInt(hexToDecimalString(land.tokenId)))
                  }
                >
                  <img
                    className="relative mx-auto pixelated nftImg hover:scale-110"
                    src={`resources/maps/FrensLand_NFTs_${
                      _metadata[0].biome - 1
                    }.png`}
                  />
                </div>
              );
            })}
          </div>
          <div className="messageNotifParent">
            <div
              className="messageNotif fontHPxl-sm mx-auto text-center"
              style={{
                borderImage: `url(data:image/svg+xml;base64,${btoa(
                  UI_Frames
                )}) 18 fill stretch`,
              }}
            >
              <p>Chose a land to start playing!</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
