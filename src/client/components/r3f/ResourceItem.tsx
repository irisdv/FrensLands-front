import React, { memo, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import THREE, { Vector2 } from "three";

import {useSelectContext} from '../../hooks/useSelectContext'
import {useGameContext} from '../../hooks/useGameContext'

interface IBlock {
    block: any
    textArrRef: any[]
    rightBuildingType: any[]
    position: any
    frontBlockArray: any
    textureLoader : any
    textureSelected: any
    worldType: any
    level: number
    animIndex: any
}

export const ResourceItem = memo<IBlock>(({block, textArrRef, rightBuildingType, position, frontBlockArray, textureLoader, textureSelected, worldType, level, animIndex}) : any => {

    const meshRef = useRef<any>()
    const clockRef = useRef<any>()
    const [clicked, setClicked] = useState(false)
    const [localTexture, setLocalTexture] = useState<any>(null)
    const [localTextureSelected, setLocalTextureSelected] = useState<any>(null)
    const [localTextureClock, setLocalTextureClock] = useState<any>(null)
    const {frameData, updateBuildingFrame} = useSelectContext();
    const {harvestingArr} = useGameContext()
    const rockTextures = [[177, 171, 172], [180, 174, 175], [179, 171, 173]]
    const treeTextures = [
        [[15, 126, 128], [16, 119, 127], [30, 120, 127]],
        [[46, 206, 207], [47, 110, 111], [48, 222, 223]],
        [[95, 124, 127], [96, 125, 128], [30, 120, 127]],
        [[63, 121, 127], [64, 122, 128], [78, 123, 127]],
        [[15, 126, 128], [16, 119, 127], [30, 120, 127]]
    ]
    const animArray = [
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

    const harvestArrValue = useMemo(() => {
        if (harvestingArr) {
            return harvestingArr
        }
    }, [harvestingArr])

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
        } else {
            textureType = findTextByID(rightBuildingType[block[3]]);
        }
        const localT = textureLoader.clone()
        localT.needsUpdate = true
        localT.offset.set(textureType.x, textureType.y);
        setLocalTexture(localT)
        return textureType
    }, [block, blockValue, level])

    const textureValueSelected = useMemo(() => {
        let textureType : Vector2 = new Vector2(0, 0);
        if (block[9] > 0) {
            if (block[3] == 2) {
                textureType = findTextByID(rockTextures[block[9] - 1][block[7] - 1]);
            } else {
                textureType = findTextByID(treeTextures[worldType][block[9] - 1][block[7] - 1]);
            }
        } else if (block[3] == 1 && block[7] == 1) {
            textureType = findTextByID(2)
        } else {
            textureType = findTextByID(rightBuildingType[block[3]]);
        }
        const localT = textureSelected.clone()
        localT.needsUpdate = true
        localT.offset.set(textureType.x, textureType.y);
        setLocalTextureSelected(localT)
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

    const clockTexture = useMemo(() => {
        if (textureLoader) {
            let textureType = findTextByID(241);
            const localT = textureLoader.clone()
            localT.needsUpdate = true
            localT.offset.set(textureType.x, textureType.y);

            return localT
        }
    }, [textureLoader])

    const clockTextureHovered = useMemo(() => {
        if (textureLoader) {
            let textureType = findTextByID(242);
            const localT = textureLoader.clone()
            localT.needsUpdate = true
            localT.offset.set(textureType.x, textureType.y);

            return localT
        }
    }, [textureLoader])

    const clockEmpty = useMemo(() => {
        if (textureLoader) {
            let textureType = findTextByID(196);
            const localT = textureLoader.clone()
            localT.needsUpdate = true
            localT.offset.set(textureType.x, textureType.y);

            return localT
        }
    }, [textureLoader])



    const animations = useMemo(() => {

        //console.log("ANIM MEMO");

        let textureType : Vector2 = new Vector2(0, 0);
        //let treeType : number = treeTextures[worldType][block[9] - 1][0];

        if (block[9] > 0) {
            if (block[3] == 3) {
                textureType = findTextByID(animArray[worldType][block[9] - 1][animIndex - 1])

                const localT = textureLoader.clone()
                localT.needsUpdate = true
                localT.offset.set(textureType.x, textureType.y);
                setLocalTexture(localT)
                return textureType
            }
        } 

    }, [animIndex])



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
        if (!clockRef || !clockRef.current) {
            return
        }
        if (meshRef.current && clockRef.current && blockValue && textureValue && textureValueSelected) {

            clockRef.current.material.map = clockEmpty

            // Case resource
            if (blockValue && blockValue[0] && blockValue[1]
                && (blockValue[3] == 2 || blockValue[3] == 3 || blockValue[3] == 20 || blockValue[3] == 27)
            ) {

                // resource selected
                if (((blockValue[0] == position.x && blockValue[1] == position.y) || blockValue[0] == frameData?.posX && blockValue[1] == frameData?.posY)) {

                    meshRef.current.material.map = localTextureSelected

                    if (harvestArrValue && harvestArrValue[blockValue[1]] && harvestArrValue[blockValue[1]][blockValue[0]] == 0) {
                        clockRef.current.material.map = clockTextureHovered
                    }

                } else {
                    meshRef.current.material.map = localTexture

                    if (harvestArrValue && harvestArrValue[blockValue[1]] && harvestArrValue[blockValue[1]][blockValue[0]] == 0) {
                        clockRef.current.material.map = clockTexture
                    }

                }

            // Case building
            } else if (blockValue != undefined && blockValue[0] != undefined && blockValue[1] != undefined
                && (blockValue[3] != 2 && blockValue[3] != 3 && blockValue[3] != 20 && blockValue[3] != 27)
            ) {
                // Building is selected / hovered
                if ((blockValue[0] == position.x && blockValue[1] == position.y) || blockValue[0] == frameData?.posX && blockValue[1] == frameData?.posY) {

                    // building under construction
                    if (frontBlockArray[blockValue[1]][blockValue[0]][10] == 0) {
                        meshRef.current.material.map = underConstructionSelect

                    // building upgraded or destroyed
                    } else if (frontBlockArray[blockValue[1]][blockValue[0]][10] == 1
                        && harvestArrValue && harvestArrValue[blockValue[1]]
                        && harvestArrValue[blockValue[1]][blockValue[0]] == 0
                    ) {
                        meshRef.current.material.map = underConstructionSelect

                    } else {
                        meshRef.current.material.map = localTextureSelected
                    }

                // building is not selected hovered
                } else {
                    // building under construction
                    if (frontBlockArray[blockValue[1]][blockValue[0]][10] == 0) {
                        meshRef.current.material.map = underConstruction

                    // building upgraded destroyed
                    } else if (frontBlockArray[blockValue[1]][blockValue[0]][10] == 1
                        && harvestArrValue && harvestArrValue[blockValue[1]]
                        && harvestArrValue[blockValue[1]][blockValue[0]] == 0
                    ) {
                        meshRef.current.material.map = underConstruction
                    } else {
                        meshRef.current.material.map = localTexture
                    }
                }
            } else {
                meshRef.current.material.map = localTexture
            }
        }
    })

    if (!meshRef) {
        return (<></>)
    }

    if (!clockRef) {
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


        {/* Clock texture resources being harvested */}
        <mesh
            ref={clockRef}
            position={[blockValue[0] + 0.5, 0.2 + (blockValue[1] * 0.02), blockValue[1] - 0.7]}
            name={`${blockValue[4]}`.toString()+"_clock"}
            rotation={[-Math.PI * 0.5, 0, 0]}
        >
            <planeBufferGeometry
                name={`${blockValue[4]}`.toString()+"_geom_clock"}
                attach="geometry"
                args={[3.5, 3.5, 1, 1]}
            />
            <meshStandardMaterial
                attach="material"
                map={clockTexture}
                name={`${blockValue[4]}`.toString()+"_mat_clock"}
                transparent={true}
                depthWrite={false}
                depthTest={true}
            />
        </mesh>
    </>
    )


})
