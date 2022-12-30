import React, { useMemo } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter } from "three";

export const TerrainBorder = (props: any) => {
  const { worldType } = props;

  const textureLoader = useMemo(() => {
    const textObj = new TextureLoader().load(
      "resources/textures/World_Boundaries_" +
        (worldType - 1).toString() +
        ".png"
    );
    textObj.repeat.set(1, 1);
    textObj.wrapS = textObj.wrapT = RepeatWrapping;
    textObj.magFilter = NearestFilter;

    return textObj;
  }, []);

  return (
    <>
      <mesh
        position={[20.94, -0.1, 9]}
        name="terrainBorderGeometry"
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        <planeGeometry
          name="terrainGeometry"
          attach="geometry"
          args={[43.9, 21, 1, 1]}
        />
        <meshStandardMaterial
          attach="material"
          map={textureLoader}
          transparent={true}
          depthWrite={false}
          depthTest={true}
        />
      </mesh>
    </>
  );
};
