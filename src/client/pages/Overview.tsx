import React, { useEffect, useState, useMemo } from "react";
import MenuHome from '../components/MenuHome'

export default function Overview() {

  return (
    <>

      <div style={{overflowY: "scroll", overflowX: 'hidden', height: '100vh'}}>
        <div className="bg-home selectDisable">

            <MenuHome />

          <div className='flex flex-col justify-center xl:w-[1080px] mx-auto'>

            <div className="overviewT my-5 text-center mx-auto pixelated"></div>
            <p className="text-justify md:w-2/5 w-4/5 fontHPxl-sm text-white mx-auto">Frens Lands is currently in <span className='text-fl-green'>pre-alpha on StarkNet testnet.</span> The first version was built during the Matchbox hackathon beginning of July 2022 and polished through August. The contracts, costs of buildings are subject to change during the upcoming testing sessions.</p>

            <div className="md:flex justify-center my-5">
                    <div className="md:mx-2 mx-auto text-center md:my-0 my-3" style={{maxWidth: '400px', height: 'auto'}}><img src="resources/screens/1.png" /></div>
                    <div className="md:mx-2 mx-auto text-center md:my-0 my-"  style={{maxWidth: '400px', height: 'auto'}}><img src="resources/screens/2.png" /></div>
            </div>

            <div className="aboutUs-line mb-5 text-center mx-auto pixelated"></div>


            <div className="grid md:grid-cols-3 my-3">
              <div className="flex flex-col justify-center mx-2 md:my-0 my-3">
                    <img src="resources/front/Gif_Population.gif" style={{height: "214px", width: "214px"}} className="mx-auto text-center" />
                    <p className="text-center fontHpxl_JuicyXL text-fl-yellow uppercase mb-3">An RTS/builder in a persistent world</p>
                    <p className="mx-auto text-center fontHPxl-sm text-white"></p>
              </div>
              <div className="flex flex-col justify-center mx-2 md:my-0 my-3">
                    <p className="text-center fontHpxl_JuicyXL text-fl-blue uppercase mb-3">Building first</p>
                    <p className="mx-auto text-center fontHPxl-sm text-white">Our team is focused on building a fun and testable game. We use StarkNet testnet to take the time to build a balanced economy and we'll launch NFT mint and tokens as soon as they are fully understansable and usable by our community.</p>
              </div>
              <div className="flex flex-col justify-center mx-2 md:my-0 my-3">
                    <img src="resources/front/Gif_Commnity2-export.gif" style={{height: "214px", width: "214px"}} className="mx-auto text-center" />
                    <p className="text-center fontHpxl_JuicyXL text-fl-yellow uppercase mb-3">A game built with the community</p>
                    <p className="mx-auto text-center fontHPxl-sm text-white"></p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 my-5">
              <div className="flex flex-col mx-2 md:my-0 my-3">
                    <img src="resources/maps/FrensLand_NFTs_0.png" style={{height: "214px", width: "214px"}} className="mx-auto text-center" />
                    <p className="text-center fontHpxl_JuicyXL text-fl-yellow uppercase mb-3">Buy the NFT when the game is fun and playable</p>
                    <p className="mx-auto text-center fontHPxl-sm text-white"></p>
              </div>
              <div className="flex flex-col mx-2 md:my-0 my-3">
              <img src="resources/front/Gif_Commnity4.gif" style={{height: "214px", width: "214px"}} className="mx-auto text-center" />
                    <p className="text-center fontHpxl_JuicyXL text-fl-yellow uppercase mb-3">Cross-usage and SBT</p>
                    <p className="mx-auto text-center fontHPxl-sm text-white"></p>
              </div>
              <div className="flex flex-col mx-2 md:my-0 my-3">
                    <img src="resources/front/Gif_Commnity3.gif" style={{height: "214px", width: "214px"}} className="mx-auto text-center" />
                    <p className="text-center fontHpxl_JuicyXL text-fl-yellow uppercase mb-3">Fully onchain day 1</p>
                    <p className="mx-auto text-center fontHPxl-sm text-white"></p>
              </div>
            </div>

          </div>

        </div>

      </div>
      
    </>
  )
}
