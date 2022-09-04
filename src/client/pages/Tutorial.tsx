import React from "react";
import MenuHome from "../components/MenuHome";

export default function Team() {

  return (
    <>

      <div style={{overflowY: "scroll", overflowX: 'hidden', height: '100vh'}}>
        <div className="bg-home selectDisable">

        <MenuHome />
        
          <div className='flex flex-col justify-center xl:w-[1080px] mx-auto'>

            <div className="tuto-title my-5 text-center mx-auto pixelated"></div>

            <p className="text-justify fontHPxl-sm text-white md:w-2/3 mx-2 md:mx-auto mb-7 mt-3">
                Frens Lands is a fully onchain world builder <span className='text-fl-yellow'>idle RTS game </span> built on StarkNet. <span className='text-fl-yellow'>Harvest</span> resources and <span className='text-fl-yellow'>create your dream community</span>.
            </p>
            <p className="text-justify fontHPxl-sm text-white md:w-2/3 mx-2 md:mx-auto">Your <span className='text-fl-yellow'>start alone</span>, but if you give some love to your lands <span className='text-fl-yellow'>more frens might choose to join you</span> and grow your community. The more your lands have access to ressources, entertainment, health and security, the more frens will choose to join you and work for it to make it better. </p>

            <div className="grid md:grid-cols-3 my-5">
              <div className="flex flex-col justify-center mb-10">
                  <img src="resources/front/Tutorial_harvesting.gif" className="mx-auto text-center mb-2" style={{height: '214px', width: '214px'}} />
                  <div className="harvestT mx-auto text-center "></div>
                  <div className="team-desc fontHPxl-sm text-fl-yellow mx-auto text-justify w-2/3">Chop trees and break rocks to gather resources to build from.</div>
              </div>
              <div className="flex flex-col justify-center mb-10">
                    <img src="resources/front/Tutorial_Build.gif" className="mx-auto text-center mb-2" style={{height: '214px', width: '214px'}} />
                    <div className="buildT mx-auto text-center "></div>
                    <div className="team-desc fontHPxl-sm text-fl-yellow mx-auto text-justify w-2/3">Create various buildings and unlock many more ! Each buildings will have a purpose in your lands.</div>
              </div>
              <div className="flex flex-col justify-center mb-10">
                    <img src="resources/front/Tutorial_Harvest2.gif" className="mx-auto text-center mb-2" style={{height: '214px', width: '214px'}} />
                    <div className="claimT mx-auto text-center "></div>
                    <div className="team-desc fontHPxl-sm text-fl-yellow mx-auto text-justify w-2/3">You can claim the resources produced by your buildings to progress even more.</div>
              </div>
            </div>

            <div className="line-xl text-center mx-auto pixelated"></div>
            <div className="tutoTestT my-5 text-center mx-auto pixelated"></div>

            <div className="md:flex mx-auto justify-center">
                <div className="mx-auto text-center md:text-right" style={{width: '256px'}}><a href="https://discord.gg/gehYZU9Trf" target='_blank'><div className="discordIcon-square mx-auto text-center"></div></a></div>
                <p className="fontHPxl-sm text-white md:w-2/3 md:mt-3 md:mr-10 mx-2 text-justify"> - Join our discord server by clicking the icon on the left. We will regularly accept more playtests as the development progress. The earlier you join, the more chances you have to get OG rewards !</p>
            </div>

            <div className="aboutUs-line mb-5 text-center mx-auto pixelated"></div>

            <div className="md:flex mx-auto justify-center">
                <div className="mx-auto flex justify-center" style={{width: '256px'}}>
                  <a href="https://www.argent.xyz/argent-x/" target='_blank'><div className="argentXIcon" ></div></a>
                  <a href="https://braavos.app/" target='_blank'><div className="braavosIcon" ></div></a>
                </div>
                <p className="fontHPxl-sm text-white md:w-2/3 md:mr-10 md:mt-3 mx-2 text-justify"> 
                    - You will need a StarkNet wallet to play Frens Lands. You can use either ArgentX or Braavos.
                    <br/>
                    - The first version of the game runs on StarkNet testnet. You will need to get some goerli ETH by <a href="https://faucet.goerli.starknet.io/" target="_blank" className="text-fl-blue">clicking here</a>
                </p>
            </div>

            <div className="aboutUs-line mb-5 text-center mx-auto pixelated"></div>

            <div className="md:flex mx-auto justify-center">
                <div className="mx-auto text-center md:text-right" style={{width: '256px'}}><div className="nftmaps"></div></div>
                <p className="fontHPxl-sm text-white md:w-2/3 mx-2 md:mt-3 md:mr-10 text-justify"> 
                    - You need to own a land NFT to be able to play the game. While we're on testnet we'll give a free land to every playtester. Follow the discord to stay informed about the upcoming testing sessions.
                </p>
            </div>

            <div className="aboutUs-line mb-5 text-center mx-auto pixelated"></div>

            <p className="text-center fontHPxl text-white">For more details you can <a href="https://frenslands.notion.site/Documentation-223bb36338434bca9ee442048976d397" target="_blank" className="text-fl-blue">click here</a></p>


            <p className="text-center fontHPxl-sm text-fl-light-blue md:w-1/2 mx-auto mt-10 mb-5">Frens Lands is currently in pre-alpha on StarkNet testnet. This first version was built during the Matchbox hackathon beginning of July and polished through August. The contracts, costs of buildings are subject to changes during the upcoming testing sessions.</p>
          </div>

        </div>

      </div>
      
    </>
  )
}
