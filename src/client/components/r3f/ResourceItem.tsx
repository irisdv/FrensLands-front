import React, { memo, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import THREE, { Vector2 } from "three";

import {useSelectContext} from '../../hooks/useSelectContext'

interface IBlock {
    block: any
    textArrRef: any[]
    rightBuildingType: any[]
    position: any
    frontBlockArray: any
    textureLoader : any
    textureSelected: any
    worldType: any
    level: number;
}

export const ResourceItem = memo<IBlock>(({block, textArrRef, rightBuildingType, position, frontBlockArray, textureLoader, textureSelected, worldType, level}) : any => {

    const meshRef = useRef<any>()
    const [clicked, setClicked] = useState(false)
    const [localTexture, setLocalTexture] = useState<any>(null)
    const {frameData, updateBuildingFrame} = useSelectContext();
    const rockTextures = [[177, 171, 172], [180, 174, 175], [179, 171, 173]]
    const treeTextures = [
        [[15, 126, 128], [16, 119, 127], [30, 120, 127]],
        [[46, 206, 207], [47, 110, 111], [48, 222, 223]],
        [[95, 124, 127], [96, 125, 128], [30, 120, 127]],
        [[63, 121, 127], [64, 122, 128], [78, 123, 127]],
        [[15, 126, 128], [16, 119, 127], [30, 120, 127]]
    ]

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
    }, [block, level])

    const textureValue = useMemo(() => {
        let textureType : Vector2 = new Vector2(0, 0);
        if (block[9] > 0) {
            if (block[3] == 2) {
                textureType = findTextByID(rockTextures[block[9] - 1][block[7] - 1]);
            } else {
                textureType = findTextByID(treeTextures[worldType][block[9] - 1][block[7] - 1]);
            }
        } else if (block[3] == 1 && block[7] == 1) {
            textureType = findTextByID(2)
        // } else if (block[3] == 1 && block[7] == 1) {
        //     textureType = findTextByID(87)
        // } else if (block[3] == 6) {
        //     textureType = findTextByID(105)
        // } else if (block[3] == 11) {
        //     textureType = findTextByID(85)
        } else {
            textureType = findTextByID(rightBuildingType[block[3]]);
        }
        const localT = textureLoader.clone()
        localT.needsUpdate = true
        localT.offset.set(textureType.x, textureType.y);
        setLocalTexture(localT)
        return textureType
    }, [block, blockValue, level])

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
                if (block[9] > 0 && block[3] == 3 && worldType > 0) {
                    let textureType : Vector2 = new Vector2(0, 0);
                    textureType = findTextByID(treeTextures[worldType][block[9] - 1][block[7] - 1])
                    textureSelected.offset.set(textureType.x, textureType.y);
                } else {
                    textureSelected.offset.set(textureValue.x, textureValue.y);
                }
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
