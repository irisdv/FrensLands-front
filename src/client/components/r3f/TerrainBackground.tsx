import React, { useMemo } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter } from "three";

export const TerrainBackground = () => {
  const textureLoader = useMemo(() => {
    const textObj = new TextureLoader().load(
      "resources/textures/Water_Tile.png"
    );
    textObj.repeat.set(1, 1);
    textObj.wrapS = textObj.wrapT = RepeatWrapping;
    textObj.magFilter = NearestFilter;

    return textObj;
  }, []);

  return (
    <>
      <mesh
        position={[21, -0.2, 9]}
        name="terrainBackgroundGeometry"
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        <planeGeometry
          name="terrainGeometry"
          attach="geometry"
          args={[150, 150, 1, 1]}
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
