import React, { useMemo, useState } from "react";
import { useSelectContext } from "../../hooks/useSelectContext";
import { allBuildings } from "../../data/buildings";

export function BottomBar(props: any) {
  const { showFrame, updateBuildingFrame, frameData } = useSelectContext();
  const { level } = props;
  const [displayNature, setDisplayNature] = useState(false);
  const [displayEntertainment, setDisplayEntertainment] = useState(false);
  const [displayHousing, setDisplayHousing] = useState(false);
  const [displaySecurity, setDisplaySecurity] = useState(false);
  const [displayShop, setDisplayShop] = useState(false);
  const [displayFrame, setDisplayFrame] = useState(false);
  const [oldFrame, setOldFrame] = useState<any>();

  const frameValue = useMemo(() => {
    if (frameData != null) {
      setOldFrame(frameData.typeId);
      return { frameValue: frameData };
    }
  }, [frameData]);

  const setDisplayingFrame = (level: number, id: any) => {
    if (frameValue != null && id == oldFrame) {
      if (displayFrame) {
        updateBuildingFrame(false, {
          infraType: 0,
          typeId: id,
          state: level,
          posX: 0,
          posY: 0,
          selected: 0,
          moved: 0,
        });
      }
      if (!displayFrame) {
        updateBuildingFrame(true, {
          infraType: 2,
          typeId: id,
          state: level,
          posX: 0,
          posY: 0,
          selected: 0,
          moved: 0,
        });
      }
      setDisplayFrame(!displayFrame);
    } else if (id == 0) {
      setDisplayFrame(false);
      updateBuildingFrame(false, {
        infraType: 0,
        typeId: id,
        state: level,
        posX: 0,
        posY: 0,
        selected: 0,
        moved: 0,
      });
    } else {
      if (displayFrame) {
        updateBuildingFrame(true, {
          infraType: 2,
          typeId: id,
          state: level,
          posX: 0,
          posY: 0,
          selected: 0,
          moved: 0,
        });
        setDisplayFrame(true);
      } else {
        updateBuildingFrame(true, {
          infraType: 2,
          typeId: id,
          state: level,
          posX: 0,
          posY: 0,
          selected: 0,
          moved: 0,
        });
        setDisplayFrame(true);
      }
    }
  };

  return (
    <>
      {/* Menu Nature */}
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
          {level >= (allBuildings[14 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated relative"
              onClick={() => setDisplayingFrame(1, 14)}
            >
              <div
                className="building14 pixelated absolute"
                style={{ bottom: "-29px", left: "-29px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[16 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 16)}
            >
              <div
                className="building16 pixelated absolute"
                style={{ bottom: "-25px", left: "31px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[17 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 17)}
            >
              <div
                className="building17 pixelated absolute"
                style={{ bottom: "-34px", left: "95px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[15 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 15)}
            >
              <div
                className="building15 pixelated absolute"
                style={{ bottom: "-30px", left: "161px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[18 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 18)}
            >
              <div
                className="building18 pixelated absolute"
                style={{ bottom: "-33px", left: "218px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[22 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 22)}
            >
              <div
                className="building22 pixelated absolute"
                style={{ bottom: "-34px", right: "35px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[23 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 23)}
            >
              <div
                className="building23 pixelated absolute"
                style={{ bottom: "-34px", right: "-33px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
        </div>
      </div>
      {/* Menu Security */}
      <div
        className="absolute"
        style={{
          bottom: "60px",
          right: "0px",
          display: `${displaySecurity ? "block" : "none"}`,
        }}
      >
        <div className="flex flex-row justify-center inline-block">
          {level >= (allBuildings[19 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 19)}
            >
              <div
                className="building19 pixelated absolute"
                style={{ bottom: "-30px", left: "-30px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[20 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 20)}
            >
              <div
                className="building20 pixelated absolute"
                style={{ bottom: "-31px", left: "34px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[21 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 21)}
            >
              <div
                className="building21 pixelated absolute"
                style={{ bottom: "-28px", right: "-30px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
        </div>
      </div>
      {/* Menu Entertainment */}
      <div
        className="absolute"
        style={{
          bottom: "60px",
          right: "0px",
          display: `${displayEntertainment ? "block" : "none"}`,
        }}
      >
        <div className="flex flex-row justify-center inline-block">
          {level >= (allBuildings[9 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 9)}
            >
              <div
                className="building9 pixelated absolute"
                style={{ bottom: "-30px", left: "-31px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[10 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 10)}
            >
              <div
                className="building10 pixelated absolute"
                style={{ bottom: "-31px", left: "31px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[11 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 11)}
            >
              <div
                className="building11 pixelated absolute"
                style={{ bottom: "-31px", right: "34px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[12 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 12)}
            >
              <div
                className="building12 pixelated absolute"
                style={{ bottom: "-31px", right: "-33px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
        </div>
      </div>
      {/* Menu House */}
      <div
        className="absolute"
        style={{
          bottom: "60px",
          right: "0px",
          display: `${displayHousing ? "block" : "none"}`,
        }}
      >
        <div className="flex flex-row justify-center inline-block">
          {level >= (allBuildings[2 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated relative"
              onClick={() => setDisplayingFrame(1, 2)}
            >
              <div
                className="building2 pixelated absolute"
                style={{ bottom: "-35px", left: "-32px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
          {level >= (allBuildings[3 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 3)}
            >
              <div
                className="building3 pixelated absolute"
                style={{ bottom: "-29px", left: "33px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}
          {level >= (allBuildings[4 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 4)}
            >
              <div
                className="building4 pixelated absolute"
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
          {level >= (allBuildings[5 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated relative"
              onClick={() => setDisplayingFrame(1, 5)}
            >
              <div
                className="building5 pixelated absolute"
                style={{ bottom: "-33px", left: "-32px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[6 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 6)}
            >
              <div
                className="building6 pixelated absolute"
                style={{ bottom: "-32px", left: "31px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[7 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 7)}
            >
              <div
                className="building7 pixelated absolute"
                style={{ bottom: "-32px", right: "95px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[13 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 13)}
            >
              <div
                className="building13 pixelated absolute"
                style={{ bottom: "-25px", right: "22px" }}
              ></div>
            </div>
          ) : (
            <div className="menuLock pixelated"></div>
          )}

          {level >= (allBuildings[8 - 1].pLevelToUnlock as any) ? (
            <div
              className="btnCategory pixelated"
              onClick={() => setDisplayingFrame(1, 8)}
            >
              <div
                className="building8 pixelated absolute"
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
