import { useStarknet, useStarknetCall } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/contracts/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";
import { useSelectContext } from "../../hooks/useSelectContext";

// import { BuildingFrame } from "./BuildingFrame";

export function BottomBar() {
  // const { address, showFrame, updateBuildingFrame } = useGameContext();
  const { address } = useGameContext();
  const { showFrame, updateBuildingFrame, frameData } = useSelectContext();
  const [displayNature, setDisplayNature] = useState(false)
  const [displayEntertainment, setDisplayEntertainment] = useState(false)
  const [displayHousing, setDisplayHousing] = useState(false)
  const [displaySecurity, setDisplaySecurity] = useState(false)
  const [displayShop, setDisplayShop] = useState(false)
  const [displayFrame, setDisplayFrame] = useState(false)
  const [oldFrame, setOldFrame] = useState<any>()
  
  // 0 : build a new building
  // 1: update a building 


  const frameValue = useMemo(() => {
    if (frameData) {
      setOldFrame(frameData.id)
      return { frameValue: frameData };
    }
  }, [frameData]);
  // console.log('FRAME VALUE', frameValue)

  const setDisplayingFrame = (level: number, id : any) => {
    // console.log('displayFrame', displayFrame)
    // console.log('FRAME DATA', frameData?.id)

    // on clique sur le même bouton
    if (frameValue && id == oldFrame) {
      if (displayFrame == true) updateBuildingFrame(false, {"id": id, "level": level, "posX": 0, "posY": 0, "selected": 0});
      if (displayFrame == false) updateBuildingFrame(true, {"id": id, "level": level, "posX": 0, "posY": 0, "selected": 0});
      setDisplayFrame(!displayFrame);
    } else if (id == 0) {
      setDisplayFrame(false)
      updateBuildingFrame(false, {"id": id, "level": level, "posX": 0, "posY": 0, "selected": 0});
    } else {
      if (displayFrame == true) {
        updateBuildingFrame(true, {"id": id, "level": level, "posX": 0, "posY": 0, "selected": 0});
        setDisplayFrame(true);
      } else {
        updateBuildingFrame(true, {"id": id, "level": level, "posX": 0, "posY": 0, "selected": 0});
        setDisplayFrame(true);
      }
    }
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
      <div className="absolute" style={{ bottom: "60px", right: "0px", display: `${displayNature ? "block" : "none"}`, zIndex: "1" }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnCategory pixelated relative" onClick={() => setDisplayingFrame(1, 17)}>
            <div className="building17 pixelated absolute" style={{bottom: "-31px", left: "-29px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 18)}>
            <div className="building18 pixelated absolute" style={{bottom: "-28px", left: "32px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 19)}>
            <div className="building19 pixelated absolute" style={{bottom: "-36px", left: "95px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 21)}>
            <div className="building21 pixelated absolute" style={{bottom: "-35px", right: "-34px"}}></div>
          </div>
        </div>
      </div>
      {/* Menu Security */}
      {/* - **Hospital 23
- **police station 22
- **agriculture/biology lab (cure disease, unlock new farms and updates, etc 24 */}
      <div className="absolute" style={{ bottom: "60px", right: "0px", display: `${displaySecurity ? "block" : "none"}` }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 22)}>
            <div className="building22 pixelated absolute" style={{bottom: "-30px", left: "-30px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 23)}>
            <div className="building23 pixelated absolute" style={{bottom: "-31px", left: "34px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 24)}>
            <div className="building24 pixelated absolute" style={{bottom: "-28px", right: "-30px"}}></div>
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
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 11)}>
            <div className="building11 pixelated absolute" style={{bottom: "-30px", left: "-31px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 12)}>
            <div className="building12 pixelated absolute" style={{bottom: "-31px", left: "31px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 13)}>
            <div className="building13 pixelated absolute" style={{bottom: "-31px", right: "34px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 14)}>
            <div className="building14 pixelated absolute" style={{bottom: "-31px", right: "-33px"}}></div>
          </div>
        </div>
      </div>
      {/* Menu House */}
      {/* - **house (different sizes)** 4
- **apartments building (different sizes)** 5
- **hotels** 6 */} 
      <div className="absolute" style={{ bottom: "60px", right: "0px", display: `${displayHousing ? "block" : "none"}` }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnCategory pixelated relative" onClick={() => setDisplayingFrame(1, 4)}>
            <div className="building4 pixelated absolute" style={{bottom: "-35px", left: "-32px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 5)}>
            <div className="building5 pixelated absolute" style={{bottom: "-30px", left: "34px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 6)}>
            <div className="building6 pixelated absolute" style={{bottom: "-32px", left: "95px"}}></div>
          </div>
        </div>
      </div>
      {/* Menu Shops */}
      <div className="absolute" style={{ bottom: "60px", right: "0px", display: `${displayShop ? "block" : "none"}` }}>
        <div className="flex flex-row justify-center inline-block">
          <div className="btnCategory pixelated relative" onClick={() => setDisplayingFrame(1, 7)}>
            <div className="building7 pixelated absolute" style={{bottom: "-31px", left: "-31px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 8)}>
            <div className="building8 pixelated absolute" style={{bottom: "-32px", left: "95px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 9)}>
            <div className="building9 pixelated absolute" style={{bottom: "-32px", right: "30px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 15)}>
            <div className="building15 pixelated absolute" style={{bottom: "-26px", right: "-41px"}}></div>
          </div>
          <div className="btnCategory pixelated" onClick={() => setDisplayingFrame(1, 10)}>
            <div className="building10 pixelated absolute" style={{bottom: "-30px", left: "34px"}}></div>
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
              // updateBuildingFrame(false, {"id": oldFrame.id as number, "selected": 0})
              setDisplayingFrame(0, 0)
            }}>
            <div className="menuNature pixelated"></div>
          </div>
          <div className="btnBottom pixelated" onClick={() => {
            setDisplayHousing(!displayHousing)
            setDisplaySecurity(false)
            setDisplayNature(false)
            setDisplayEntertainment(false)
            setDisplayShop(false)
            setDisplayFrame(false)
            }}>
            <div className="menuHouse pixelated"></div>
          </div>
          <div className="btnBottom pixelated" onClick={() => {
            setDisplayShop(!displayShop)
            setDisplaySecurity(false)
            setDisplayNature(false)
            setDisplayEntertainment(false)
            setDisplayHousing(false)
            setDisplayFrame(false)
          }}>
            <div className="menuShop pixelated"></div>
          </div>
          <div className="btnBottom pixelated" onClick={() => {
            setDisplaySecurity(!displaySecurity)
            setDisplayNature(false)
            setDisplayEntertainment(false)
            setDisplayHousing(false)
            setDisplayShop(false)
            setDisplayFrame(false)
            setDisplayingFrame(0, 0)
          }}>
            <div className="menuSecurity pixelated"></div>
          </div>
          <div className="btnBottom pixelated" onClick={() => {
            setDisplayEntertainment(!displayEntertainment)
            setDisplaySecurity(false)
            setDisplayNature(false)
            setDisplayHousing(false)
            setDisplayShop(false)
            setDisplayFrame(false)
          }}>
            <div className="menuEntertainment pixelated"></div>
          </div>
        </div>
      </div>
    </>
  );
}
