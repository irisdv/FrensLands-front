import { useStarknet, useStarknetCall } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";

// import { BuildingFrame } from "./BuildingFrame";

export function BottomBar() {
  const { address, showFrame, updateBuildingFrame } = useGameContext();
  const [displayNature, setDisplayNature] = useState(false)
  const [displayEntertainment, setDisplayEntertainment] = useState(false)
  const [displayHousing, setDisplayHousing] = useState(false)
  const [displaySecurity, setDisplaySecurity] = useState(false)
  const [displayShop, setDisplayShop] = useState(false)
  const [displayFrame, setDisplayFrame] = useState(false)
  
  // 0 : build a new building
  // 1: update a building 
  const setDisplayingFrame = (type: number, id : any) => {
    console.log('displayFrame', displayFrame)
    setDisplayFrame(!displayFrame);
    updateBuildingFrame(!displayFrame, {"id": id, "type": type, "posX": 0, "posY": 0, "selected": 0});
  };
  return (
    <>
      {/* Menu Nature */}
      {/* - **cereal farm : game art done**
- **vegetable farm** 17
- **cow farm** 18
- **tree farm** 19
- **Mines** 20
- **coal plant** 21 */}
      <div className="absolute" style={{ bottom: "60px", right: "0px", display: `${displayNature ? "block" : "none"}` }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnCategory pixelated relative" onClick={() => setDisplayingFrame(0, 17)}>
            <div className="building17 pixelated absolute" style={{bottom: "-30px", left: "-29px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 18)}>
            <div className="building18 pixelated absolute" style={{bottom: "-30px", left: "35px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 19)}>
            <div className="building19 pixelated absolute" style={{bottom: "-30px", left: "99px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 20)}>
            <div className="building20 pixelated absolute" style={{bottom: "0x", right: "58px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 21)}>
            <div className="building21 pixelated absolute" style={{bottom: "1px", right: "-4px"}}></div>
          </div>
        </div>
      </div>
      {/* Menu Security */}
      {/* - **Hospital 23
- **police station 22
- **agriculture/biology lab (cure disease, unlock new farms and updates, etc 24 */}
      <div className="absolute" style={{ bottom: "60px", right: "0px", display: `${displaySecurity ? "block" : "none"}` }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 22)}>
            <div className="building22 pixelated absolute" style={{bottom: "0px", left: "0px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 23)}>
            <div className="building23 pixelated absolute" style={{bottom: "0px", left: "68px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 24)}>
            <div className="building24 pixelated absolute" style={{bottom: "0px", right: "29px"}}></div>
          </div>
        </div>
      </div>
      {/* Menu Entertainment */}
      {/* - **cinema 14
- **bars** 11
- **library** 12
- **swimming pool** 13 */}
      <div className="absolute" style={{ bottom: "60px", right: "0px", display: `${displayEntertainment ? "block" : "none"}` }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 11)}>
            <div className="building11 pixelated absolute" style={{bottom: "-30px", left: "35px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 12)}>
            <div className="building12 pixelated absolute" style={{bottom: "-30px", left: "99px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 13)}>
            <div className="building13 pixelated absolute" style={{bottom: "-30px", right: "29px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 14)}>
            <div className="building14 pixelated absolute" style={{bottom: "-30px", right: "-35px"}}></div>
          </div>
        </div>
      </div>
      {/* Menu House */}
      {/* - **house (different sizes)** 4
- **apartments building (different sizes)** 5
- **hotels** 6 */} 
      <div className="absolute" style={{ bottom: "60px", right: "0px", display: `${displayHousing ? "block" : "none"}` }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnCategory pixelated relative" onClick={() => setDisplayingFrame(0, 4)}>
            <div className="building4 pixelated absolute" style={{bottom: "-30px", left: "-29px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 5)}>
            <div className="building5 pixelated absolute" style={{bottom: "-30px", left: "35px"}}></div>
          </div>
          <div className="btnCategory pixelated">
            <div className="building6 pixelated absolute" style={{bottom: "-30px", left: "95px"}}></div>
          </div>
        </div>
      </div>
      {/* Menu Shops */}
      <div className="absolute" style={{ bottom: "60px", right: "0px", display: `${displayShop ? "block" : "none"}` }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnCategory pixelated relative" onClick={() => setDisplayingFrame(0, 7)}>
            <div className="building7 pixelated absolute" style={{bottom: "-31px", left: "-31px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 10)}>
            <div className="building10 pixelated absolute" style={{bottom: "-33px", left: "34px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 8)}>
            <div className="building8 pixelated absolute" style={{bottom: "-30px", left: "95px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 9)}>
            <div className="building9 pixelated absolute" style={{bottom: "-30px", right: "29px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(0, 15)}>
            <div className="building15 pixelated absolute" style={{bottom: "-15px", right: "-39px"}}></div>
          </div>
        </div>
      </div>
      <div className="absolute" style={{ bottom: "0px", right: "0px" }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnBottom pixelated"onClick={() => {
              setDisplayNature(!displayNature) 
              setDisplaySecurity(false)
              setDisplayEntertainment(false)
              setDisplayHousing(false)
              setDisplayShop(false)
            }}>
            <div className="menuNature pixelated"></div>
          </div>
          <div className="btnBottom pixelated" onClick={() => {
            setDisplaySecurity(!displaySecurity)
            setDisplayNature(false)
            setDisplayEntertainment(false)
            setDisplayHousing(false)
            setDisplayShop(false)
          }}>
            <div className="menuSecurity pixelated"></div>
          </div>
          <div className="btnBottom pixelated" onClick={() => {
            setDisplayEntertainment(!displayEntertainment)
            setDisplaySecurity(false)
            setDisplayNature(false)
            setDisplayHousing(false)
            setDisplayShop(false)
          }}>
            <div className="menuEntertainment pixelated"></div>
          </div>
          <div className="btnBottom pixelated" onClick={() => {
            setDisplayHousing(!displayHousing)
            setDisplaySecurity(false)
            setDisplayNature(false)
            setDisplayEntertainment(false)
            setDisplayShop(false)
            }}>
            <div className="menuHouse pixelated"></div>
          </div>
          <div className="btnBottom pixelated" onClick={() => {
            setDisplayShop(!displayShop)
            setDisplaySecurity(false)
            setDisplayNature(false)
            setDisplayEntertainment(false)
            setDisplayHousing(false)
          }}>
            <div className="menuShop pixelated"></div>
          </div>
        </div>
      </div>
    </>
  );
}
