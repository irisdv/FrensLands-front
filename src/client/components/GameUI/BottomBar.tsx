import React, { useEffect, useMemo, useState } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { useSelectContext } from "../../hooks/useSelectContext";
import { allBuildings } from "../../data/buildings";

export function BottomBar(props: any) {
  const { address } = useGameContext();
  const { showFrame, updateBuildingFrame, frameData } = useSelectContext();
  const { level } = props;

  const [displayNature, setDisplayNature] = useState(false);
  const [displayEntertainment, setDisplayEntertainment] = useState(false);
  const [displayHousing, setDisplayHousing] = useState(false);
  const [displaySecurity, setDisplaySecurity] = useState(false);
  const [displayShop, setDisplayShop] = useState(false);
  const [displayFrame, setDisplayFrame] = useState(false);
  const [oldFrame, setOldFrame] = useState<any>();

  // 0 : build a new building
  // 1: update a building

  const frameValue = useMemo(() => {
    if (frameData != null) {
      setOldFrame(frameData.id);
      return { frameValue: frameData };
    }
  }, [frameData]);

  const setDisplayingFrame = (level: number, id: any) => {
    if (frameValue != null && id == oldFrame) {
      if (displayFrame) {
        updateBuildingFrame(false, {
          id,
          level,
          posX: 0,
          posY: 0,
          selected: 0,
        });
      }
      if (!displayFrame) {
        updateBuildingFrame(true, { id, level, posX: 0, posY: 0, selected: 0 });
      }
      setDisplayFrame(!displayFrame);
    } else if (id == 0) {
      setDisplayFrame(false);
      updateBuildingFrame(false, { id, level, posX: 0, posY: 0, selected: 0 });
    } else {
      if (displayFrame) {
        updateBuildingFrame(true, { id, level, posX: 0, posY: 0, selected: 0 });
        setDisplayFrame(true);
      } else {
        updateBuildingFrame(true, { id, level, posX: 0, posY: 0, selected: 0 });
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
      <div
        className="absolute"
        style={{
          bottom: "60px",
          right: "0px",
          display: `${displayNature ? "block" : "none"}`,
          zIndex: "1",
        }}
      >
        <div className="flex flex-row justify-center inline-block">
          {level >= (allBuildings[16 - 1].level as any) ? (
            <div
              className="btnCategory pixelated relative"
              onClick={() => setDisplayingFrame(1, 16)}
            >
              <div
                className="building16 pixelated absolute"
                style={{ bottom: "-29px", left: "-29px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[18 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 18)}
            >
              <div
                className="building18 pixelated absolute"
                style={{ bottom: "-25px", left: "31px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[19 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 19)}
            >
              <div
                className="building19 pixelated absolute"
                style={{ bottom: "-34px", left: "95px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[17 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 17)}
            >
              <div
                className="building17 pixelated absolute"
                style={{ bottom: "-30px", left: "161px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[21 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 21)}
            >
              <div
                className="building21 pixelated absolute"
                style={{ bottom: "-33px", left: "218px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[25 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 25)}
            >
              <div
                className="building25 pixelated absolute"
                style={{ bottom: "-34px", right: "35px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[26 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 26)}
            >
              <div
                className="building26 pixelated absolute"
                style={{ bottom: "-34px", right: "-33px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
        </div>
      </div>
      {/* Menu Security */}
      {/* - **Hospital 23
- **police station 22
- **agriculture/biology lab (cure disease, unlock new farms and updates, etc 24 */}
      <div
        className="absolute"
        style={{
          bottom: "60px",
          right: "0px",
          display: `${displaySecurity ? "block" : "none"}`,
        }}
      >
        <div className="flex flex-row justify-center inline-block">
          {level >= (allBuildings[22 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 22)}
            >
              <div
                className="building22 pixelated absolute"
                style={{ bottom: "-30px", left: "-30px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[23 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 23)}
            >
              <div
                className="building23 pixelated absolute"
                style={{ bottom: "-31px", left: "34px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[24 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 24)}
            >
              <div
                className="building24 pixelated absolute"
                style={{ bottom: "-28px", right: "-30px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
        </div>
      </div>
      {/* Menu Entertainment */}
      {/* - **cinema 14
- **bars** 11
- **library** 12
- **swimming pool** 13 */}
      <div
        className="absolute"
        style={{
          bottom: "60px",
          right: "0px",
          display: `${displayEntertainment ? "block" : "none"}`,
        }}
      >
        <div className="flex flex-row justify-center inline-block">
          {level >= (allBuildings[11 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 11)}
            >
              <div
                className="building11 pixelated absolute"
                style={{ bottom: "-30px", left: "-31px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[12 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 12)}
            >
              <div
                className="building12 pixelated absolute"
                style={{ bottom: "-31px", left: "31px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[13 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 13)}
            >
              <div
                className="building13 pixelated absolute"
                style={{ bottom: "-31px", right: "34px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[14 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 14)}
            >
              <div
                className="building14 pixelated absolute"
                style={{ bottom: "-31px", right: "-33px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
        </div>
      </div>
      {/* Menu House */}
      {/* - **house (different sizes)** 4
- **apartments building (different sizes)** 5
- **hotels** 6 */}
      <div
        className="absolute"
        style={{
          bottom: "60px",
          right: "0px",
          display: `${displayHousing ? "block" : "none"}`,
        }}
      >
        <div className="flex flex-row justify-center inline-block">
          {level >= (allBuildings[4 - 1].level as any) ? (
            <div
              className="btnCategory pixelated relative"
              onClick={() => setDisplayingFrame(1, 4)}
            >
              <div
                className="building4 pixelated absolute"
                style={{ bottom: "-35px", left: "-32px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
          {level >= (allBuildings[5 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 5)}
            >
              <div
                className="building5 pixelated absolute"
                style={{ bottom: "-29px", left: "33px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
          {level >= (allBuildings[6 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 6)}
            >
              <div
                className="building6 pixelated absolute"
                style={{ bottom: "-32px", left: "95px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
        </div>
      </div>
      {/* Menu Shops */}
      <div
        className="absolute"
        style={{
          bottom: "60px",
          right: "0px",
          display: `${displayShop ? "block" : "none"}`,
        }}
      >
        <div className="flex flex-row justify-center inline-block">
          {level >= (allBuildings[7 - 1].level as any) ? (
            <div
              className="btnCategory pixelated relative"
              onClick={() => setDisplayingFrame(1, 7)}
            >
              <div
                className="building7 pixelated absolute"
                style={{ bottom: "-33px", left: "-32px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[8 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 8)}
            >
              <div
                className="building8 pixelated absolute"
                style={{ bottom: "-32px", left: "31px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[9 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 9)}
            >
              <div
                className="building9 pixelated absolute"
                style={{ bottom: "-32px", right: "95px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[15 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 15)}
            >
              <div
                className="building15 pixelated absolute"
                style={{ bottom: "-25px", right: "22px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[10 - 1].level as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 10)}
            >
              <div
                className="building10 pixelated absolute"
                style={{ bottom: "-30px", right: "-34px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
        </div>
      </div>
      <div className="absolute" style={{ bottom: "0px", right: "0px" }}>
        <div className="flex flex-row justify-center inline-block">
          {level >= 2 ? (
            <div
              className="btnBottom pixelated"
              onClick={() => {
                setDisplayNature(!displayNature);
                setDisplaySecurity(false);
                setDisplayEntertainment(false);
                setDisplayHousing(false);
                setDisplayShop(false);
                setDisplayingFrame(0, 0);
              }}
            >
              <div className="menuFactory pixelated"></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= 2 ? (
            <div
              className="btnBottom pixelated"
              onClick={() => {
                setDisplayHousing(!displayHousing);
                setDisplaySecurity(false);
                setDisplayNature(false);
                setDisplayEntertainment(false);
                setDisplayShop(false);
                setDisplayFrame(false);
              }}
            >
              <div className="menuHouse pixelated"></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= 4 ? (
            <div
              className="btnBottom pixelated"
              onClick={() => {
                setDisplayShop(!displayShop);
                setDisplaySecurity(false);
                setDisplayNature(false);
                setDisplayEntertainment(false);
                setDisplayHousing(false);
                setDisplayFrame(false);
              }}
            >
              <div className="menuShop pixelated"></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= 5 ? (
            <div
              className="btnBottom pixelated"
              onClick={() => {
                setDisplayEntertainment(!displayEntertainment);
                setDisplaySecurity(false);
                setDisplayNature(false);
                setDisplayHousing(false);
                setDisplayShop(false);
                setDisplayFrame(false);
              }}
            >
              <div className="menuEntertainment pixelated"></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= 6 ? (
            <div
              className="btnBottom pixelated"
              onClick={() => {
                setDisplaySecurity(!displaySecurity);
                setDisplayNature(false);
                setDisplayEntertainment(false);
                setDisplayHousing(false);
                setDisplayShop(false);
                setDisplayFrame(false);
                setDisplayingFrame(0, 0);
              }}
            >
              <div className="menuSecurity pixelated"></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
        </div>
      </div>
    </>
  );
}
