import React, { useEffect, useMemo, useRef } from 'react';
import { TextureLoader, RepeatWrapping, NearestFilter } from "three";

export const GalleryTerrain = (props : any) => {

    const { worldType } = props;

    const textureLoader = useMemo(() => {
        const textObj = new TextureLoader().load("../resources/textures/World_Background_"+worldType.toString()+".png");
        textObj.repeat.set(1, 1);
        textObj.wrapS = textObj.wrapT = RepeatWrapping;
        textObj.magFilter = NearestFilter

        return textObj
    }, [])

    return(
    <>
        <mesh position={[21, 0, 9]} name="terrainMesh" rotation={[-Math.PI * 0.5, 0, 0]}>
            <planeGeometry
                name="terrainGeometry"
                attach="geometry"
                args={[40, 16, 1, 1]}
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
    )


}
