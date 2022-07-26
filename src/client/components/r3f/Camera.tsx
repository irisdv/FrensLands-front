import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Vector2 } from 'three';

export const Camera = (props : any) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>()
    const set = useThree(({ set }) => set)
    const size = useThree(({ size }) => size)

    // const { mouse } = useThree()
    const { mouseRightPressed, mouseWheelProp } = props
    const [tempMousePos, setTempMousePos] = useState(new Vector2(0, 0))
    const [cameraPositionX, setCameraPositionX] = useState(21)
    const [cameraPositionY, setCameraPositionY] = useState(150)
    const [cameraPositionZ, setCameraPositionZ] = useState(9)
    
    useFrame(({ mouse }) => {
        if (cameraRef.current) {

            if (mouseWheelProp == -1 && cameraPositionY > 45) {
                setCameraPositionY(cameraPositionY - 15)
            } else if (mouseWheelProp == 1 && cameraPositionY < 300) {
                setCameraPositionY(cameraPositionY + 15)
            }
            
            if (mouseRightPressed == 1) {
                console.log('mouse', mouse)
                console.log('tempMousePos', tempMousePos)
                var mouseMove = new Vector2(0, 0)
                var difX = (tempMousePos.x - mouse.x) * 100;
                var difY = (tempMousePos.y - mouse.y) * 100;
        
                if (difX < 0)  difX = difX * -1;
                if (difY < 0) difY = difY * -1;
        
                if (tempMousePos.x < mouse.x) {
                    if (cameraPositionX > 0) {
                        mouseMove.x = 0.1 * difX;
                        setCameraPositionX(cameraPositionX - mouseMove.x)
                    }
                }
                else if (tempMousePos.x > mouse.x) {
                    if (cameraPositionX < 40) {
                        mouseMove.x = 0.1 * difX;
                        setCameraPositionX(cameraPositionX + mouseMove.x)
                    }
                }
                else if (tempMousePos.x == mouse.x) {
                    mouseMove.x = 0;
                }
                if (tempMousePos.y < mouse.y) {
                    if (cameraPositionZ < 16) {
                        mouseMove.y = 0.1 * difY;
                        setCameraPositionZ(cameraPositionZ + mouseMove.y)
                    }
                }
                else if (tempMousePos.y > mouse.y) {
                    if (cameraPositionZ > 0) {
                        mouseMove.y = 0.1 * difY;
                        setCameraPositionZ(cameraPositionZ - mouseMove.y)
                    }
                }
                else if (tempMousePos.y == mouse.y) {
                    mouseMove.y = 0;
                }
                setTempMousePos(new Vector2(mouse.x, mouse.y))
            }

            cameraRef.current.aspect = size.width / size.height
            cameraRef.current.position.set(cameraPositionX, cameraPositionY, cameraPositionZ)
            cameraRef.current.updateProjectionMatrix()
        }
    })
    
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


