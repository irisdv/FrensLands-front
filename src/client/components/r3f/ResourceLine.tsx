import React, { memo, ReactElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { TextureLoader, RepeatWrapping, NearestFilter, PlaneGeometry, Vector2 } from "three";

import useInGameContext from '../../hooks/useInGameContext'
import { useGameContext } from '../../hooks/useGameContext'
import { ResourceItem } from './ResourceItem';

interface Imaps {
    compArray?: any[]
}

export const ResourceLine = (props : any)=> {
    const {line, textArrRef, rightBuildingType, textureLoader, position, frontBlockArray, textureSelected, worldType} = props

    const lineValue = useMemo(() => {
        if (line) return line
    }, [line])

    return(
        lineValue && lineValue.map((elem : any, key : any) => {
            if (elem && elem[3] && elem[3] != 0) return <ResourceItem key={elem[4]} block={elem} textArrRef={textArrRef} rightBuildingType={rightBuildingType} position={position} frontBlockArray={frontBlockArray} textureLoader={textureLoader} textureSelected={textureSelected} worldType={worldType} level={elem[7]} />
            })
    )



}
