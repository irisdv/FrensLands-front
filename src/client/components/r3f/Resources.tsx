import React, { useMemo } from 'react';
import { TextureLoader, RepeatWrapping, NearestFilter, PlaneGeometry, Vector2 } from "three";
import { ResourceLine } from './ResourceLine';
const { promises: Fs} = require('fs');

interface Imaps {
    compArray?: any[]
}

export default function Resources ({frontBlockArray, textArrRef, rightBuildingType, position, worldType, gallery} : any) : any{

    const frontBlockArrayValue = useMemo(() => {
        if (frontBlockArray && Object.keys(frontBlockArray).length > 0) {
            return { frontBlockArray }
        }
    }, [frontBlockArray])

    // const textureLoader = useMemo(() => {
    //     if (textArrRef && textArrRef.length > 0) {
    //         let textObj;
    //         // if (gallery != undefined && gallery == 1) {
    //         //     textObj = new TextureLoader().load("../resources/textures/Matchbox_Tiles_Objects_nogrid_0.png");
    //         // } else {
    //             textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_nogrid_0.png");
    //         // }
    //         textObj.repeat = new Vector2(0.0625, 0.0625)
    //         textObj.magFilter = NearestFilter;
    //         textObj.wrapS = RepeatWrapping;
    //         textObj.wrapT = RepeatWrapping;

    //         return textObj
    //     }
    // }, [textArrRef])

    // const textureLoaderSelected = useMemo(() => {
    //     if (textArrRef && textArrRef.length > 0) {
    //         let textObj;
    //         // if (gallery != undefined && gallery == 1) {
    //         //     textObj = new TextureLoader().load("../resources/textures/Matchbox_Tiles_Objects_Outlined_nogrid_0.png");
    //         // } else {
    //             textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_Outlined_nogrid_0.png");
    //         // }
            
    //         textObj.repeat = new Vector2(0.0625, 0.0625)
    //         textObj.magFilter = NearestFilter;
    //         textObj.wrapS = RepeatWrapping;
    //         textObj.wrapT = RepeatWrapping;

    //         return textObj
    //     }
    // }, [textArrRef])

    const textureLoader = useMemo(() => {
        if (textArrRef && textArrRef.length > 0) {
            let textObj;
            // if (gallery != undefined && gallery == 1) {
            //     textObj = new TextureLoader().load("../resources/textures/Matchbox_Tiles_Objects_nogrid_0.png");
            // } else {
                textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_nogrid_"+worldType.toString()+".png");
            // }
            textObj.repeat = new Vector2(0.0625, 0.0625)
            textObj.magFilter = NearestFilter;
            textObj.wrapS = RepeatWrapping;
            textObj.wrapT = RepeatWrapping;

            return textObj
        }
    }, [textArrRef])

    const textureLoaderSelected = useMemo(() => {
        if (textArrRef && textArrRef.length > 0) {
            let textObj;
            // if (gallery != undefined && gallery == 1) {
            //     textObj = new TextureLoader().load("../resources/textures/Matchbox_Tiles_Objects_Outlined_nogrid_0.png");
            // } else {
                textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_Outlined_nogrid_"+worldType.toString()+".png");
            // }

            textObj.repeat = new Vector2(0.0625, 0.0625)
            textObj.magFilter = NearestFilter;
            textObj.wrapS = RepeatWrapping;
            textObj.wrapT = RepeatWrapping;

            return textObj
        }
    }, [textArrRef])

    function exists(path: String)
    {
      try
      {
        Fs.access(path);
        return (true);
      }
      catch
      {
        return (false);
      }
    }

    return(
        textureLoader && textureLoaderSelected &&
        textArrRef && textArrRef.length > 0 && 
        frontBlockArrayValue && Object.keys(frontBlockArrayValue.frontBlockArray).length > 0 && 
        frontBlockArrayValue.frontBlockArray.map((line : any, key: any) => {
            return <ResourceLine 
                        frontBlockArray={frontBlockArray}
                        key={key} 
                        line={line} 
                        textArrRef={textArrRef} 
                        rightBuildingType={rightBuildingType} 
                        textureLoader={textureLoader} 
                        textureSelected={textureLoaderSelected} 
                        position={position}
                        worldType={worldType}
                    />
        })
    )
}
