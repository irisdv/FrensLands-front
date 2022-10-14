// import React, { useEffect, useState } from "react";
// import { useQuery, gql } from "@apollo/client";

// import { hexToDecimalString } from "starknet/utils/number";
// import { allMetadata } from "../../data/metadata";
// import UI_Frames from "../../style/resources/front/Ui_Frames3.svg";

// export const TOKENS_QUERY = gql`
//   query tokens($owner: HexValue) {
//     tokens(owner: $owner) {
//       tokenId
//       owner
//     }
//   }
// `;

export default function MenuHome(props: any) {
  //   const { account } = props;
  //   const [loading, setLoading] = useState(true);
  //   const {
  //     data,
  //     loading: dataLoading,
  //     error,
  //   } = useQuery(TOKENS_QUERY, {
  //     variables: {
  //       owner: account as HexValue,
  //     },
  //   });
  //   useEffect(() => {
  //     if (!dataLoading) setLoading(dataLoading);
  //     console.log("data received", data);
  //     if (error) console.log("error", error);
  //   }, [data, dataLoading, error]);
  //   return (
  //     <>
  //       {!loading && data && data.tokens && data.tokens.length > 0 ? (
  //         <>
  //           <div className={`grid grid-cols-${data.tokens.length} px-8`}>
  //             {data.tokens.map((land: any) => {
  //               let _metadata = allMetadata.filter(
  //                 (res) => res.id == (land.tokenId as any)
  //               );
  //               return (
  //                 <div
  //                   className="cursor-pointer px-5"
  //                   key={land.tokenId}
  //                   // onClick={async () => await startGame(2)}
  //                 >
  //                   <img
  //                     className="relative mx-auto pixelated nftImg hover:scale-110"
  //                     src={`resources/maps/FrensLand_NFTs_${
  //                       _metadata[0].biome - 1
  //                     }.png`}
  //                   />
  //                 </div>
  //               );
  //             })}
  //           </div>
  //           <div className="messageNotifParent">
  //             <div
  //               className="messageNotif fontHPxl-sm mx-auto text-center"
  //               style={{
  //                 borderImage: `url(data:image/svg+xml;base64,${btoa(
  //                   UI_Frames
  //                 )}) 18 fill stretch`,
  //               }}
  //             >
  //               <p>Chose a land to start playing!</p>
  //             </div>
  //           </div>
  //         </>
  //       ) : (
  //         loading ?
  //         <div className="messageNotifParent">
  //           <div
  //             className="messageNotif fontHPxl-sm mx-auto text-center"
  //             style={{
  //               borderImage: `url(data:image/svg+xml;base64,${btoa(
  //                 UI_Frames
  //               )}) 18 fill stretch`,
  //             }}
  //           >
  //             <p>Loading your lands...</p>
  //           </div>
  //         </div>
  //         :
  //         error ? <div>Error while loading your lands</div> : <></>
  //       )}
  //     </>
  //   );
}
