import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import THREE, { TextureLoader, RepeatWrapping, NearestFilter, PlaneGeometry, Vector2, Vector3, MeshStandardMaterial } from "three";
// import * as fs from "fs"
// const { promises: Fs} = require('fs');

import useInGameContext from '../../hooks/useInGameContext'
import { useGameContext } from '../../hooks/useGameContext'
import {useSelectContext} from '../../hooks/useSelectContext'

interface IBlock {
    block: any
    textArrRef: any[]
    rightBuildingType: any[]
    position: any
    frontBlockArray: any
    textureLoader : any
    textureSelected: any
    // updateBuildingFrame?: (show: boolean, data: {}) => void;
}

export const ResourceItem = memo<IBlock>(({block, textArrRef, rightBuildingType, position, frontBlockArray, textureLoader, textureSelected}) : any => {

    const meshRef = useRef<any>()
    const [clicked, setClicked] = useState(false)
    const [localTexture, setLocalTexture] = useState<any>(null)
    const {frameData, updateBuildingFrame} = useSelectContext();

    const frameDataValue = useMemo(() => {
        if (frameData && clicked) {
            setClicked(false)
            return frameData
        }
    }, [clicked])

    const blockValue = useMemo(() => {
        if (block && block.length > 0) {
            setLocalTexture(textureLoader)
            return block
        }
    }, [block])

    const textureValue = useMemo(() => {
        let textureType : Vector2 = new Vector2(0, 0);
        if (block[9] > 0) {
            if (block[3] == 2) {
                if (block[9] == 1) {
                    textureType = findTextByID(177);
                } else if (block[9] == 2) {
                    textureType = findTextByID(180);
                } else if (block[9] == 3) {
                    textureType = findTextByID(179);
                }
            } else {
                if (block[9] == 1) {
                    textureType = findTextByID(15);
                } else if (block[9] == 2) {
                    textureType = findTextByID(16);
                } else if (block[9] == 3) {
                    textureType = findTextByID(30);
                }
            }
        } else {
            textureType = findTextByID(rightBuildingType[block[3]]);
        }
        const localT = textureLoader.clone()
        localT.needsUpdate = true
        localT.offset.set(textureType.x, textureType.y);
        setLocalTexture(localT)
        return textureType
    }, [block])

    const underConstruction = useMemo(() => {
        if (textureValue) {
            let textureType = findTextByID(65);

            const localT = textureLoader.clone()
            localT.needsUpdate = true
            localT.offset.set(textureType.x, textureType.y);

            return localT
        }
    }, [textureValue])

    const underConstructionSelect = useMemo(() => {
        if (textureValue) {
            let textureType = findTextByID(65);

            const localT = textureSelected.clone()
            localT.needsUpdate = true
            localT.offset.set(textureType.x, textureType.y);

            return localT
        }
    }, [textureValue])

    function findTextByID(type : number)
    {
        var posText = new Vector2();
        var x = 0;
        var y = 15;

        while (y >= 0)
        {
            while (x < 16)
            {
                if (type == textArrRef[y][x])
                {
                    posText.x = (x * (1 / 16));
                    posText.y = (y * (1 / 16));
                    return (posText);
                }
                x++;
            }
            x = 0;
            y--;
        }
        return (new Vector2(0,0));
    }

    useFrame(() => {
        if (!meshRef || !meshRef.current) {
            return
        }
        if (meshRef.current && blockValue && textureValue) {
            if (blockValue && blockValue[0] == position.x && blockValue[1] == position.y && frontBlockArray[blockValue[1]][blockValue[0]][10] == 1) {
                // Selected not under construction
                textureSelected.offset.set(textureValue.x, textureValue.y);
                meshRef.current.material.map = textureSelected
            } else if (blockValue && blockValue[0] == position.x && blockValue[1] == position.y && frontBlockArray[blockValue[1]][blockValue[0]][10] == 0) {
                // Selected under construction
                meshRef.current.material.map = underConstructionSelect
            } else if (blockValue && blockValue[0] && blockValue[1] && frontBlockArray && frontBlockArray[blockValue[1]][blockValue[0]][10] == 0 ){
                // Under construction
                meshRef.current.material.map = underConstruction
            } else {
                meshRef.current.material.map = localTexture
            }
        }
    })

    if (!meshRef) {
        return (<></>)
    }

    return(
    <>
        <mesh
            ref={meshRef}
            position={[blockValue[0] + 0.5, 0.2 + (blockValue[1] * 0.02), blockValue[1]]}
            name={`${blockValue[4]}`.toString()}
            rotation={[-Math.PI * 0.5, 0, 0]}
            // dispose={null}
            // visible
            // onClick={(event) => {
            //     event.stopPropagation()
            //     if (frameData?.selected == 1 && frameData.id != blockValue[3]) {
            //         console.log('en train de build')
            //     } else {
            //         console.log('clicked', blockValue[3])
            //         updateBuildingFrame(true, {"id": blockValue[3], "unique_id": blockValue[4], "posX": (blockValue[0]), "posY": blockValue[1], "selected": 0});
            //         setClicked(true)
            //     }
            // }}
        >
            <planeBufferGeometry
                name={`${blockValue[4]}`.toString()+"_geom"}
                attach="geometry"
                args={[3.5, 3.5, 1, 1]}
            />
            <meshStandardMaterial
                attach="material"
                map={localTexture}
                name={`${blockValue[4]}`.toString()+"_mat"}
                transparent={true}
                depthWrite={false}
                depthTest={true}
            />
        </mesh>
    </>
    )


})
