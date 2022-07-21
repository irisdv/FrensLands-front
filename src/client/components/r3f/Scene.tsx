import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber';
import { Html, PerspectiveCamera, PositionalAudio, useContextBridge } from '@react-three/drei';
import * as THREE from "three";

import { Terrain } from './Terrain';
import { TerrainBorder } from './TerrainBorder';
import { Camera } from './Camera';
import { TerrainBackground } from './TerrainBackground'
import { Map } from './Map'

import { useGameContext } from '../../hooks/useGameContext'
import useInGameContext from '../../hooks/useInGameContext'
import { BottomBar } from '../GameUI/BottomBar';
import { useSelectContext } from '../../hooks/useSelectContext';
import { BuildingTemp } from './BuildingTemp';
import { Vector2, Vector3 } from 'three';
import BuildingContext from '../../providers/BuildingContext';
import SelectContext from '../../providers/SelectContext';
import { TransactionManagerContext } from '../../providers/transactions/context'
import { useTexture } from "@react-three/drei";
import { NearestFilter, RepeatWrapping } from "three";
import { StarknetProvider, useStarknet, useStarknetTransactionManager } from '@starknet-react/core';
import { StarknetContext } from '@starknet-react/core/dist/providers/starknet';
import StateContext from '../../providers/GameContext'



export const Scene = (props : any) => {
    const ContextBridge = useContextBridge(SelectContext, BuildingContext, TransactionManagerContext, StarknetContext, StateContext)
    const refCanvas = useRef<any>()

    const { mapArray, textArrRef, rightBuildingType, worldType, UBlockIDs } = props

    const [cameraPositionX, setCameraPositionX] = useState(21)
    const [cameraPositionY, setCameraPositionY] = useState(150)
    const [cameraPositionZ, setCameraPositionZ] = useState(9)
    const [mouseWheelProp, setMouseWheelProp] = useState(0)
    const [mouseLeftPressed, setMouseLeftPressed] = useState(0)
    const [mouseRightPressed, setMouseRightPressed] = useState(0)
    const [mouseMiddlePressed, setMouseMiddlePressed] = useState(0)
    const [frontBlockArray, setFrontBlockArray] = useState([])

    const keyMap : any[] = []
    const [customMouse, setCustomMouse] = useState(new Vector2(0, 0))
    const [tempMousePos, setTempMousePos] = useState(new Vector2(0, 0))
        
    return(
    <>
        <Canvas id="canvasScene" gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} linear ref={refCanvas}
            onCreated={() => {
                setFrontBlockArray(mapArray)
            }}
            onWheel={(event)=> {
                event.stopPropagation()
                if (event.deltaY > 0) {
                    setMouseWheelProp(-1)
                    if (cameraPositionY > 45) setCameraPositionY(cameraPositionY - 15)
                } else if (event.deltaY < 0)  {
                    setMouseWheelProp(1)
                    if (cameraPositionY < 300) setCameraPositionY(cameraPositionY + 15)
                } else {
                    setMouseWheelProp(0)
                }
            }}
            onMouseDown={(event) => {
                // event.stopPropagation()
                if (event.button == 2) {
                    setMouseRightPressed(1)
                }
                if (event.button == 0) {
                    setMouseLeftPressed(1)
                }
                if (event.button == 1) {
                    setMouseMiddlePressed(1)
                }
            }}
            onMouseUp={(event) => {
                event.stopPropagation()
                if (event.button == 2) {
                    setMouseRightPressed(0)
                }
                if (event.button == 0) {
                    setMouseLeftPressed(0)
                }
                if (event.button == 1) {
                    setMouseMiddlePressed(0)
                }
            }}
            onKeyDown={(event)=> {
                event.stopPropagation()
                var keyCode = event.code;
                keyMap[keyCode as any] = true;
            }}
            onKeyUp={(event)=> {
                event.stopPropagation()
                var keyCode = event.code;
                keyMap[keyCode as any](false);
            }}
            onMouseMove={(event) => {
                setCustomMouse(new Vector2(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1))
                // customMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
                // customMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
            }}
            onContextMenu={(event) => {
                event.preventDefault()
            }}
        >
            <ambientLight color={0xffffff} intensity={0.9} />
            <directionalLight color={0xffffff} intensity={0.5} position={[12, 12, 8]} />
            <color attach="background" args={[0x73bed3]} />
            <Camera 
                position={[cameraPositionX, cameraPositionY, cameraPositionZ]} 
                aspect={window.innerWidth / window.innerHeight} 
                mouseRightPressed={mouseRightPressed}
            />
            <ContextBridge>
                <Map 
                    frontBlockArray={frontBlockArray} 
                    textArrRef={textArrRef} 
                    rightBuildingType={rightBuildingType} 
                    worldType={worldType} 
                    mouseLeftPressed={mouseLeftPressed}
                    mouseMiddlePressed={mouseMiddlePressed}
                    buildingsIDs={UBlockIDs}
                    mouseRightPressed={mouseRightPressed}
                />            
            </ContextBridge>
            <TerrainBackground />
            <Terrain worldType={worldType}  />
            <TerrainBorder worldType={worldType}  />
        </Canvas>
    
    </>
    )


}


