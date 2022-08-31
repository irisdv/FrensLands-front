import React, { useEffect, useState, useMemo } from "react";
import MenuHome from "../components/MenuHome";

export default function Team() {

  return (
    <>

      <div style={{overflowY: "scroll", overflowX: 'hidden', height: '100vh'}}>
        <div className="bg-home selectDisable">

          <MenuHome />

          <div className='flex flex-col justify-center xl:w-[1080px] mx-auto'>

            <div className="aboutUs-title my-5 text-center mx-auto pixelated"></div>
            <p className="text-center md:w-2/3 w-4/5 fontHPxl-sm text-white mx-auto">Frens Lands is currently in <span className='text-fl-pink'>pre-alpha on StarkNet testnet.</span> The first version was built during the Matchbox hackathon beginning of July 2022 and polished through August. The contracts, costs of buildings are subject to change during the upcoming testing sessions.</p>

            <div className="aboutUs-img mt-5 text-center mx-auto pixelated"></div>
            <div className="aboutUs-line mb-5 text-center mx-auto pixelated"></div>

            <div className="aboutUs-team mb-5 text-center mx-auto pixelated"></div>

            <div className="grid md:grid-cols-3">
              <div className="flex flex-col justify-center">
                  <div className="img-iris mx-auto text-center"></div>
                  {/* <div className="team-desc fontHPxl-sm text-white mx-auto text-justify w-2/3">Lorem ipsum et dolor. Lorem ipsum et dolor. Lorem ipsum et dolor. Lorem ipsum et dolor.</div> */}
                  <a href="https://twitter.com/IrisdeVillars" target='_blank' className="mx-auto text-center"><div className="twitterIcon"></div></a>
              </div>
              <div className="flex flex-col justify-center">
                  <div className="img-thomas mx-auto text-center"></div>
                  {/* <div className="team-desc fontHPxl-sm text-white mx-auto text-justify w-2/3">Lorem ipsum et dolor. Lorem ipsum et dolor. Lorem ipsum et dolor. Lorem ipsum et dolor.</div> */}
                  <a href="https://twitter.com/Thomas7x7" target='_blank' className="mx-auto text-center"><div className="twitterIcon"></div></a>
              </div>
              <div className="flex flex-col justify-center">
                  <div className="img-hpmnk mx-auto text-center"></div>
                  {/* <div className="team-desc fontHPxl-sm text-white mx-auto text-justify w-2/3">Lorem ipsum et dolor. Lorem ipsum et dolor. Lorem ipsum et dolor. Lorem ipsum et dolor.</div> */}
                  <a href="https://twitter.com/HPMNK_One" target='_blank' className="mx-auto text-center"><div className="twitterIcon"></div></a>
              </div>
            </div>

            <div className="aboutUs-line text-center mx-auto pixelated"></div>
            <div className="aboutUs-social my-5 text-center mx-auto pixelated"></div>

            <div className="flex flex-col justify-center">
              <div className="text-center mx-auto">
                <a href="https://twitter.com/FrensLands" target='_blank' className="mx-auto text-center"><div className="twitterIcon-xl mx-2 pixelated"></div></a>
                <a href="https://discord.gg/gehYZU9Trf" target='_blank' className="mx-auto text-center"><div className="discordIcon-xl mx-2 pixelated"></div></a>
              </div>
            </div>

          </div>

        </div>

      </div>
      
    </>
  )
}
