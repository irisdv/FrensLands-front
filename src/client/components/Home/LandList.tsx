import React, { useEffect, useMemo, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { hexToDecimalString } from "starknet/utils/number";
import { allMetadata } from "../../data/metadata";
import UI_Frames from "../../style/resources/front/Ui_Frames3.svg";
import { useNavigate } from "react-router-dom";
import { useFLContract } from "../../hooks/contracts/frenslands";
import { number } from "starknet";

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
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const frenslandsContract = useFLContract();

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
      const _tokenIds: any[] = [];
      console.log("data", data);
      data.tokens.map((land: any) => {
        _tokenIds.push(parseInt(hexToDecimalString(land.tokenId)));
      });
      console.log("_tokenIds array", _tokenIds);

      return _tokenIds;
    }
  }, [data, isReady]);

  useEffect(() => {
    if (tokenIdsArray && tokenIdsArray.length > 0) setIsReady(true);
  }, [tokenIdsArray]);

  const startGame = async (_tokenId: number) => {
    console.log("starting game for tokendId", _tokenId);

    if (tokenIdsArray && tokenIdsArray.includes(_tokenId)) {
      const _res = await starknet.account.callContract({
        contractAddress: frenslandsContract.address,
        entrypoint: "get_building_counter",
        calldata: [number.toFelt(_tokenId)],
      });
      console.log("building counter", Number(_res.result[0]));

      navigate("/play", {
        state: {
          landId: _tokenId,
          wasInit: Number(_res.result[0]) === 0 ? false : true,
        },
      });
    }
  };

  if (!isReady) {
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
  }

  if (error != null) {
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
  }

  return (
    <>
      {data && data.tokens && isReady && tokenIdsArray && (
        <>
          <div className={`grid grid-cols-${data.tokens.length} px-8`}>
            {data.tokens.map((land: any) => {
              const _metadata = allMetadata.filter(
                (res) => res.id == land.tokenId
              );
              return (
                <div
                  className="cursor-pointer px-5"
                  key={land.tokenId}
                  onClick={async () =>
                    await startGame(parseInt(hexToDecimalString(land.tokenId)))
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
