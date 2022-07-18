import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Vector3 } from 'three';

export const Camera = (props : any) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>()
    const set = useThree(({ set }) => set)
    const size = useThree(({ size }) => size)

    // console.log('props', props)

    useLayoutEffect(() => {
        if (cameraRef.current) {
          cameraRef.current.aspect = size.width / size.height
          cameraRef.current.position.set(props.position[0], props.position[1], props.position[2])
          cameraRef.current.updateProjectionMatrix()
        }
    }, [size, props])
    
      useLayoutEffect(() => {
        set({ camera: cameraRef.current as THREE.PerspectiveCamera })
      }, [])
    
    return(
    <>
            <PerspectiveCamera 
                manual
                ref={cameraRef}
                fov={5} 
                near={1}
                far={1000}
                rotation={[-Math.PI * 0.5, 0, 0]}
                {...props}
            />
    
    </>
    )


}


