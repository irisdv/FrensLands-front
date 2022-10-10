import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { useBVH } from "@react-three/drei";
const { promises: Fs } = require("fs");

export const BuildingTemp = (props: any) => {
  const { type, name, sprite, textArrRef, spaceValid, position } = props;
  const buildTempRef = useRef<any>();
  useBVH(buildTempRef);

  const redText = "Matchbox_Tiles_Objects_RedVersion";
  const greenText = "Matchbox_Tiles_Objects_GreenVersion";
  const worldType = 1;

  function exists(path: String) {
    try {
      Fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  const textureLoader0 = useMemo(() => {
    let textObj;
    if (
      exists(
        "resources/textures/" +
          redText +
          "_nogrid_" +
          worldType.toString() +
          ".png"
      )
    ) {
      textObj = new TextureLoader().load(
        "resources/textures/" +
          redText +
          "_nogrid_" +
          worldType.toString() +
          ".png"
      );
    } else {
      textObj = new TextureLoader().load(
        "resources/textures/" + redText + "_nogrid_0.png"
      );
    }

    let textureType = new Vector2();
    textureType = findTextByID(sprite);

    textObj.repeat.set(0.0625, 0.0625);
    textObj.offset.set(textureType.x, textureType.y);
    textObj.magFilter = NearestFilter;
    textObj.wrapS = RepeatWrapping;
    textObj.wrapT = RepeatWrapping;

    return textObj;
  }, [type]);

  const textureLoader1 = useMemo(() => {
    let textObj;
    if (
      exists(
        "resources/textures/" +
          greenText +
          "_nogrid_" +
          worldType.toString() +
          ".png"
      )
    ) {
      textObj = new TextureLoader().load(
        "resources/textures/" +
          greenText +
          "_nogrid_" +
          worldType.toString() +
          ".png"
      );
    } else {
      textObj = new TextureLoader().load(
        "resources/textures/" + greenText + "_nogrid_0.png"
      );
    }

    let textureType = new Vector2();
    textureType = findTextByID(sprite);
    textObj.repeat.set(0.0625, 0.0625);
    textObj.offset.set(textureType.x, textureType.y);
    textObj.magFilter = NearestFilter;
    textObj.wrapS = RepeatWrapping;
    textObj.wrapT = RepeatWrapping;

    return textObj;
  }, [type]);

  function findTextByID(type: number) {
    const posText = new Vector2();
    let x = 0;
    let y = 15;

    while (y >= 0) {
      while (x < 16) {
        if (type == textArrRef[y][x]) {
          posText.x = x * (1 / 16);
          posText.y = y * (1 / 16);
          return posText;
        }
        x++;
      }
      x = 0;
      y--;
    }
    return new Vector2(0, 0);
  }

  useFrame(() => {
    if (buildTempRef.current) {
      buildTempRef.current.position.set(position.x, position.y, position.z);

      if (spaceValid == 0) {
        buildTempRef.current.material.map = textureLoader0;
      } else if (spaceValid == 1) {
        buildTempRef.current.material.map = textureLoader1;
      }
    }
  });

  return (
    <>
      <mesh
        ref={buildTempRef}
        name={`${name}`.toString()}
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        <planeGeometry
          name={`${name}_geom`}
          attach="geometry"
          args={[3.5, 3.5, 1, 1]}
        />
        <meshStandardMaterial
          attach="material"
          map={textureLoader0}
          transparent={true}
          depthWrite={false}
          depthTest={true}
        />
      </mesh>
    </>
  );
};
