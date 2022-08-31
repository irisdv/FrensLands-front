import React, { useEffect, useState, useMemo } from "react";
import MenuHome from "../components/MenuHome";

export default function Roadmap() {

  return (
    <>

      <div style={{overflowY: "scroll", overflowX: 'hidden', height: '100vh'}}>

        <div className="bg-home selectDisable">

        <MenuHome />

        <div className='flex flex-col justify-center'>
            
          <div className="pixelated mx-auto roadmapT my-5"></div>
          {/* <hr></hr> */}
          
          <div className="flex flex-row justify-center inline-block mx-auto mt-5">
            <img src="resources/front/Gif_Population.gif" className="mt-7 roadmapGif" />
            <div className="grid">
              <div className="lineWTop">
                  <div className="lineG pixelated"></div>
              </div>
            </div>
            <div className="HBSection">
              <div className="hackT pixelated md:mt-3 mt-0"></div>
              <div className="fontHPxl HBText">
                <p>Creation of the prototype</p>
                <ul style={{listStyle: 'disc', paddingLeft: '20px'}}>
                  <li>20 buildings</li>
                  <li>10 different resources</li>
                  <li>5 different biomes</li>
                </ul>
              </div>
              <div className="currentB pixelated"></div>
            </div>
          </div>


          <div className="flex flex-row justify-center inline-block mx-auto">
            <img src="resources/front/Gif_Community.gif" className="mt-16 roadmapGif" />
            <div className="grid">
              <div className="lineWTopS" style={{'transform': 'rotate(180deg)', marginTop: '-27px'}}></div>
              <div className="lineWxs" style={{'transform': 'rotate(180deg)'}}></div>
              <div className="lineWTop" style={{'transform': 'rotate(180deg)'}}></div>
            </div>

            <div className="QATSection">
              <div className="QAT pixelated md:mt-7 mt-0"></div>
              <div className="fontHPxl QATText">
                <p>Testing sessions of the game with early adopters. We gather feedback from our community and build our game features and economy accordingly.</p>
              </div>
            </div>

          </div>

          <div className="flex flex-row justify-center inline-block mx-auto">
            <img src="resources/front/Gif_FrensEvents.gif" className="roadmapGif" style={{width: "190px", height: "190px", marginTop: '-37px'}} />

            <div className="grid">
              <div className="lineWxs lineMargin" style={{'transform': 'rotate(180deg)'}}></div>
              <div className="lineWTop" style={{'transform': 'rotate(180deg)'}}></div>
            </div>

            <div className="" style={{marginLeft: '-20px', marginTop: '-15px'}}>
            <div className="V01 pixelated" style={{marginTop: '-50px'}}></div>
              <div className="fontHPxl V01Text">
              <ul>
                  <li>Cleaning of the hackathon code</li>
                  <li>Level system</li>
                  <li>Finish all buildings, frens & resources</li>
                  <li>Buildings upgrades</li>
                  <li>Add animations</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center inline-block mx-auto">
            <img src="resources/front/Gif_TradeRessource.gif" className="roadmapGif" style={{marginTop: '-37px'}} />
            <div className="grid">
              <div className="lineWxs lineMargin" style={{'transform': 'rotate(180deg)'}}></div>
              <div className="lineWTop" style={{'transform': 'rotate(180deg)'}}></div>
            </div>

            <div className="" style={{marginLeft: '-20px', marginTop: '-15px'}}>
            <div className="V02 pixelated" style={{marginTop: '-50px'}}></div>
              <div className="fontHPxl V02Text">
              <ul>
                  <li>Event system (disease, weather...)</li>
                  <li>Save worlds in NFT/land format</li>
                  <li>Marketplace to sell resources</li>
                  <li>Optimization</li>
                  <li>More biomes!</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center inline-block mx-auto">
            <img src="resources/front/Gif_Combine.gif" className="roadmapGif" style={{marginTop: '-37px'}} />

            <div className="grid">
              <div className="lineWxs lineMargin" style={{'transform': 'rotate(180deg)'}}></div>
              <div className="lineWxs" style={{'transform': 'rotate(180deg)', marginTop: '-9px'}}></div>
              <div className="lineWxs" style={{'transform': 'rotate(180deg)', marginTop: '-9px'}}></div>
            </div>

            <div className="" style={{marginLeft: '-20px', marginTop: '-15px'}}>
              <div className="V03 pixelated" style={{marginTop: '-50px'}}></div>
              <div className="fontHPxl V03Text">
              <ul>
                  <li>Optimization to make lands bigger</li>
                  <li>Combine / join your lands together</li>
                  <li>Multiplayer suppport</li>
                </ul>
              </div>
            </div>
          </div>


        </div>
      </div>

        {/* </div> */}

      </div>
      
    </>
  )
}
