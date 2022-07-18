import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import THREE, { TextureLoader, RepeatWrapping, NearestFilter, PlaneGeometry, Vector2, Vector3, MeshStandardMaterial } from "three";
// import * as fs from "fs"
// const { promises: Fs} = require('fs');

import useInGameContext from '../../hooks/useInGameContext'
import { useGameContext } from '../../hooks/useGameContext'
import {useSelectContext} from '../../hooks/useSelectContext'

interface IFrens {
    frenIndex: number;
    fren: any;
    frenPosition: any;
    frenTexture: any;
}

export const Frens = memo<IFrens>(({frenIndex, fren, frenPosition, frenTexture}) : any => {

    const frenRef = useRef<any>()
    const [clicked, setClicked] = useState(false)
    const [localTexture, setLocalTexture] = useState<any>(null)

    const frenValue = useMemo(() => {
        if (fren && Object.keys(fren).length > 0) {
            // setLocalTexture(textureLoader)
            return fren
        }
    }, [fren])

    // const textureValue = useMemo(() => {
    //     let textureType : Vector2 = new Vector2(0, 0);
       
    //     const localT = textureLoader.clone()
    //     localT.needsUpdate = true
    //     localT.offset.set(textureType.x, textureType.y);
    //     setLocalTexture(localT)
    //     return textureType
    // }, [block])

    // const underConstruction = useMemo(() => {
    //     if (textureValue) {
    //         let textureType = findTextByID(65);

    //         const localT = textureLoader.clone()
    //         localT.needsUpdate = true
    //         localT.offset.set(textureType.x, textureType.y);

    //         return localT
    //     }
    // }, [textureValue])

    // const underConstructionSelect = useMemo(() => {
    //     if (textureValue) {
    //         let textureType = findTextByID(65);

    //         const localT = textureSelected.clone()
    //         localT.needsUpdate = true
    //         localT.offset.set(textureType.x, textureType.y);

    //         return localT
    //     }
    // }, [textureValue])

    // function findTextByID(type : number)
    // {
    //     var posText = new Vector2();
    //     var x = 0;
    //     var y = 15;

    //     while (y >= 0)
    //     {
    //         while (x < 16)
    //         {
    //             if (type == textArrRef[y][x])
    //             {
    //                 posText.x = (x * (1 / 16));
    //                 posText.y = (y * (1 / 16));
    //                 return (posText);
    //             }
    //             x++;
    //         }
    //         x = 0;
    //         y--;
    //     }
    //     return (new Vector2(0,0));
    // }

    useFrame(() => {
        if (!frenRef || !frenRef.current) {
            return
        }
        if (frenRef.current && frenValue) {
            frenRef.current.position.x = frenValue.curPos.x;
            frenRef.current.position.y = 0.3 + (frenValue.curPos.y * 0.02); // Make sure the objects are higher at the bottom
            frenRef.current.position.z = frenValue.curPos.y;
        }
    })

    if (!frenRef) {
        return (<></>)
    }

    return(
    <>
        <mesh
            ref={frenRef}
            name={`${frenIndex}`.toString()}
            rotation={[-Math.PI * 0.5, 0, 0]}
        >
            <planeBufferGeometry
                name={`${frenIndex}`.toString()+"_geom"}
                attach="geometry"
                args={[3.5, 3.5, 1, 1]}
            />
            <meshStandardMaterial
                attach="material"
                map={frenTexture}
                transparent={true}
                depthWrite={false}
                depthTest={true}
            />
        </mesh>
    </>
    )


})
