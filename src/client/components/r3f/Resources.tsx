import React, { useMemo } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { ResourceLine } from "./ResourceLine";

export default function Resources({
  frontBlockArray,
  textArrRef,
  position,
  worldType,
  staticBuildings,
  staticResources,
  animIndex,
}: any): any {
  const frontBlockArrayValue = useMemo(() => {
    if (frontBlockArray && Object.keys(frontBlockArray).length > 0) {
      return { frontBlockArray };
    }
  }, [frontBlockArray]);

  const textureLoader = useMemo(() => {
    if (textArrRef && textArrRef.length > 0) {
      let textObj;
      textObj = new TextureLoader().load(
        "resources/textures/Matchbox_Tiles_Objects_nogrid_" +
          (worldType - 1).toString() +
          ".png"
      );
      // textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_nogrid_0.png");
      textObj.repeat = new Vector2(0.0625, 0.0625);
      textObj.magFilter = NearestFilter;
      textObj.wrapS = RepeatWrapping;
      textObj.wrapT = RepeatWrapping;

      return textObj;
    }
  }, [textArrRef]);

  const textureLoaderRock = useMemo(() => {
    if (textArrRef && textArrRef.length > 0) {
      let textObj;
      // textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_nogrid_" +(worldType - 1).toString() +".png");
      textObj = new TextureLoader().load(
        "resources/textures/Matchbox_Tiles_Objects_nogrid_0.png"
      );
      textObj.repeat = new Vector2(0.0625, 0.0625);
      textObj.magFilter = NearestFilter;
      textObj.wrapS = RepeatWrapping;
      textObj.wrapT = RepeatWrapping;

      return textObj;
    }
  }, [textArrRef]);

  const textureLoaderSelected = useMemo(() => {
    if (textArrRef && textArrRef.length > 0) {
      let textObj;
      textObj = new TextureLoader().load(
        "resources/textures/Matchbox_Tiles_Objects_Outlined_nogrid_" +
          (worldType - 1).toString() +
          ".png"
      );
      // textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_Outlined_nogrid_0.png");
      textObj.repeat = new Vector2(0.0625, 0.0625);
      textObj.magFilter = NearestFilter;
      textObj.wrapS = RepeatWrapping;
      textObj.wrapT = RepeatWrapping;

      return textObj;
    }
  }, [textArrRef]);

  const textureLoaderSelectedRock = useMemo(() => {
    if (textArrRef && textArrRef.length > 0) {
      let textObj;
      // textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_Outlined_nogrid_"+(worldType - 1).toString() +".png");
      textObj = new TextureLoader().load(
        "resources/textures/Matchbox_Tiles_Objects_Outlined_nogrid_0.png"
      );
      textObj.repeat = new Vector2(0.0625, 0.0625);
      textObj.magFilter = NearestFilter;
      textObj.wrapS = RepeatWrapping;
      textObj.wrapT = RepeatWrapping;

      return textObj;
    }
  }, [textArrRef]);

  return (
    textureLoader != null &&
    textureLoaderSelected != null &&
    textArrRef &&
    textArrRef.length > 0 &&
    frontBlockArrayValue != null &&
    Object.keys(frontBlockArrayValue.frontBlockArray).length > 0 &&
    frontBlockArrayValue.frontBlockArray.map((line: any, key: any) => {
      return (
        <ResourceLine
          key={key}
          line={line}
          textArrRef={textArrRef}
          textureLoader={textureLoader}
          textureLoaderRock={textureLoaderRock}
          textureSelected={textureLoaderSelected}
          textureSelectedRock={textureLoaderSelectedRock}
          position={position}
          staticBuildings={staticBuildings}
          staticResources={staticResources}
          animIndex={animIndex}
        />
      );
    })
  );
}
