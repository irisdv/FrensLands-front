import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PositionalAudio, useContextBridge } from "@react-three/drei";
import * as THREE from "three";

import { Terrain } from "./Terrain";
import { TerrainBorder } from "./TerrainBorder";
import { Camera } from "./Camera";
import { TerrainBackground } from "./TerrainBackground";
import { Map } from "./Map";
import { Vector2 } from "three";
import BuildingContext from "../../providers/BuildingContext";
import SelectContext from "../../providers/SelectContext";
import { TransactionManagerContext } from "../../providers/transactions/context";
// import { StarknetContext } from "@starknet-react/core/dist/providers/starknet";
import StateContext from "../../providers/GameContext";
import { useSelectContext } from "../../hooks/useSelectContext";
import NewStateContext from "../../providers/NewGameContext";

// import socketService from "../../services/socketService";
// import gameService from "../../services/gameService";
import { useNewGameContext } from "../../hooks/useNewGameContext";

export const Scene = (props: any) => {
  const ContextBridge = useContextBridge(
    SelectContext,
    BuildingContext,
    TransactionManagerContext,
    // StarknetContext,
    StateContext,
    NewStateContext
  );
  const refCanvas = useRef<any>();

  const { updateBuildingFrame, zoomMode } = useSelectContext();

  const { mapArray, textArrRef, rightBuildingType, worldType, UBlockIDs } =
    props;

  const [mouseWheelProp, setMouseWheelProp] = useState(0);
  const [mouseLeftPressed, setMouseLeftPressed] = useState(0);
  const [mouseRightPressed, setMouseRightPressed] = useState(0);
  const [mouseMiddlePressed, setMouseMiddlePressed] = useState(0);
  const [frontBlockArray, setFrontBlockArray] = useState([]);
  const { player } = useNewGameContext();

  const getStaticBuildings = async () => {
    await fetch(`http://localhost:3001/api/static_buildings`)
      .then(async (response) => {
        return await response.json();
      })
      .then((data) => {
        console.log("data static building", data);
      });
  };

  useEffect(() => {
    getStaticBuildings();
  }, []);

  const zoomValue = useMemo(() => {
    if (player.isConnected && zoomMode != undefined) {
      return zoomMode;
    }
  }, [zoomMode, player]);

  const [keyMap, setKeyMap] = useState({
    Escape: false,
  });
  const [customMouse, setCustomMouse] = useState(new Vector2(0, 0));

  const indexRef = useRef<any>();
  const [index, setIndex] = useState(10);
  indexRef.current = index;

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      setKeyMap((m) => ({ ...m, [event.code]: true }));
    };
    const handleKeyUp = (event: any) => {
      setKeyMap((m) => ({ ...m, [event.code]: false }));
    };
    const handleMouseWheelProp = (event: any) => {
      if (zoomValue) {
        if (event.deltaY > 0 && indexRef.current > 4) {
          setIndex(() => indexRef.current - 1);
        } else if (event.deltaY < 0 && indexRef.current < 20) {
          setIndex(() => indexRef.current + 1);
        }
      } else {
        if (event.deltaY > 0 && indexRef.current < 20) {
          setIndex(() => indexRef.current + 1);
        } else if (event.deltaY < 0 && indexRef.current > 4) {
          setIndex(() => indexRef.current - 1);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    const passiveObject: any = { passive: true };
    document.addEventListener("wheel", handleMouseWheelProp, passiveObject);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      const passiveObject: any = { passive: true };
      document.removeEventListener(
        "wheel",
        handleMouseWheelProp,
        passiveObject
      );
    };
  }, [zoomValue, zoomMode]);

  useEffect(() => {
    if (keyMap && keyMap.Escape) {
      updateBuildingFrame(false, {
        id: 0,
        unique_id: 0,
        posX: 0,
        posY: 0,
        selected: 0,
      });
    }
  }, [keyMap]);

  return (
    <>
      <Canvas
        id="canvasScene"
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
        linear
        ref={refCanvas}
        onCreated={() => {
          setFrontBlockArray(mapArray);
        }}
        onMouseDown={(event) => {
          if (event.button == 2) {
            setMouseRightPressed(1);
          }
          if (event.button == 0) {
            setMouseLeftPressed(1);
          }
          if (event.button == 1) {
            setMouseMiddlePressed(1);
          }
        }}
        onMouseUp={(event) => {
          event.stopPropagation();
          if (event.button == 2) {
            setMouseRightPressed(0);
          }
          if (event.button == 0) {
            setMouseLeftPressed(0);
          }
          if (event.button == 1) {
            setMouseMiddlePressed(0);
          }
        }}
        onMouseMove={(event) => {
          setCustomMouse(
            new Vector2(
              (event.clientX / window.innerWidth) * 2 - 1,
              -(event.clientY / window.innerHeight) * 2 + 1
            )
          );
        }}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      >
        <ambientLight color={0xffffff} intensity={0.9} />
        <directionalLight
          color={0xffffff}
          intensity={0.5}
          position={[12, 12, 8]}
        />
        <color attach="background" args={[0x73bed3]} />
        <Camera
          aspect={window.innerWidth / window.innerHeight}
          mouseRightPressed={mouseRightPressed}
          mouseWheelProp={mouseWheelProp}
          index={index}
        />
        <ContextBridge>
          <Map
            frontBlockArray={frontBlockArray}
            textArrRef={textArrRef}
            rightBuildingType={rightBuildingType}
            worldType={worldType}
            mouseLeftPressed={mouseLeftPressed}
            mouseMiddlePressed={mouseMiddlePressed}
            buildingsIDs={UBlockIDs}
            mouseRightPressed={mouseRightPressed}
            keyMap={keyMap}
          />
        </ContextBridge>
        <TerrainBackground />
        <Terrain worldType={worldType} />
        <TerrainBorder worldType={worldType} />
        {/* <PositionalAudio
                url="resources/sounds/ogg/FrensLand_MenuTheme.ogg"
                distance={1}
                loop
            /> */}
      </Canvas>
    </>
  );
};
