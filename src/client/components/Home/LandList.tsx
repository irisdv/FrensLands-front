import React, { useEffect, useMemo, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { hexToDecimalString } from "starknet/utils/number";
import { allMetadata } from "../../data/metadata";
import UI_Frames from "../../style/resources/front/Ui_Frames3.svg";
import { getLandByTokenId, initGame } from "../../api/player";
// import { useNewGameContext } from "../../hooks/useNewGameContext";
import { useFLContract } from "../../hooks/contracts/frenslands";
import { useNavigate } from "react-router-dom";
import { useTestContract } from "../../hooks/contracts/test";

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
  const { account, userId, starknet } = props;
  const { contract: frenslands } = useFLContract();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [initArray, setInitArray] = useState<any[]>([]);
  // ! test
  const testContract = useTestContract();

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

  const startGame = async (_tokenId: number) => {
    console.log("starting game for tokendId", _tokenId);
    console.log("initArray defined", initArray);

    if (initArray && initArray[_tokenId]) {
      if (initArray[_tokenId].isInit) {
        console.log("isInit", initArray[_tokenId].isInit);
        navigate("/play", { state: { landId: _tokenId } });
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

        const result = await starknet.account.execute([
          {
            contractAddress: testContract.address as string,
            entrypoint: "harvest",
            calldata: [1],
          },
        ]);
        console.log("result", result);
        // const result = {
        //   code: "RECEIVED",
        //   transaction_hash:
        //     "0x1c4a2c6c3398cac008a66e727af63248b55aac85e6259308f059b34fc0ce311",
        // };

        // Init game in db
        let _initializeGame = await initGame(
          userId,
          initArray[_tokenId].id,
          initArray[_tokenId].biomeId,
          _tokenId,
          result
        );
        console.log("_initializeGame", _initializeGame);

        // Go the page play w/ tx ongoing tx information
        if (result)
          navigate("/play", {
            state: {
              landId: _tokenId,
            },
          });
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
