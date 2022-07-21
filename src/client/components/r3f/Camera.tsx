import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Vector2, Vector3 } from 'three';

export const Camera = (props : any) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>()
    const set = useThree(({ set }) => set)
    const size = useThree(({ size }) => size)

    const { mouse } = useThree()
    const { mouseRightPressed } = props
    const [tempMousePos, setTempMousePos] = useState(new Vector2(0, 0))

    useLayoutEffect(() => {
        if (cameraRef.current) {

          cameraRef.current.aspect = size.width / size.height
          cameraRef.current.position.set(props.position[0], props.position[1], props.position[2])
          cameraRef.current.updateProjectionMatrix()

        //   if (mouseRightPressed == 1) {
        //     console.log('mouseRightPressed')
        //     var mouseMove = new Vector2(0, 0)
        //     var difX = (tempMousePos.x - mouse.x) * 100;
        //     var difY = (tempMousePos.y - mouse.y) * 100;

        //     console.log('difX', difX)
        //     console.log('tempMousePos', tempMousePos)
        //     console.log('customMouse', mouse)
    
        //     if (difX < 0)  difX = difX * -1;
        //     if (difY < 0) difY = difY * -1;
    
        //     if (tempMousePos.x < mouse.x) {
        //         if (cameraRef.current.position.x > 0) {
        //             mouseMove.x = 0.1 * difX;
        //             // setCameraPositionX(cameraPositionX - mouseMove.x)
        //             cameraRef.current.position.set(cameraRef.current.position.x - mouseMove.x, cameraRef.current.position.y, cameraRef.current.position.z)
        //             cameraRef.current.updateProjectionMatrix()
        //         }
        //     }
        //     else if (tempMousePos.x > mouse.x) {
        //         if (cameraRef.current.position.x < 40) {
        //             mouseMove.x = 0.1 * difX;
        //             // setCameraRef.currentPositionX(cameraRef.currentPositionX + mouseMove.x)
        //             cameraRef.current.position.set(cameraRef.current.position.x+ mouseMove.x, cameraRef.current.position.y, cameraRef.current.position.z)
        //             cameraRef.current.updateProjectionMatrix()
        //         }
        //     }
        //     else if (tempMousePos.x == mouse.x) {
        //         mouseMove.x = 0;
        //     }
        //     if (tempMousePos.y < mouse.y) {
        //         if (cameraRef.current.position.z < 16) {
        //             mouseMove.y = 0.1 * difY;
        //             // setCameraRefcameraRef.currentPositionZ(cameraRef.currentPositionX + mouseMove.y)
        //             cameraRef.current.position.set(cameraRef.current.position.x, cameraRef.current.position.y, cameraRef.current.position.z + mouseMove.y)
        //             cameraRef.current.updateProjectionMatrix()
        //         }
        //     }
        //     else if (tempMousePos.y > mouse.y) {
        //         if (cameraRef.current.position.z > 0) {
        //             mouseMove.y = 0.1 * difY;
        //             // setCameraRefcameraRef.currentPositionZ(cameraRef.currentPositionX - mouseMove.y)
        //             cameraRef.current.position.set(cameraRef.current.position.x, props.position[1], cameraRef.current.position.z - mouseMove.y)
        //             cameraRef.current.updateProjectionMatrix()
        //         }
        //     }
        //     else if (tempMousePos.y == mouse.y) {
        //         mouseMove.y = 0;
        //     }
        //     console.log('camera position', cameraRef.current.position)
        //     setTempMousePos(new Vector2(mouse.x, mouse.y))
        //     // tempMousePos.x = mouse.x;
        //     // tempMousePos.y = mouse.y;
        // }
        }
    }, [size, props, mouseRightPressed])
    
      useLayoutEffect(() => {
        set({ camera: cameraRef.current as THREE.PerspectiveCamera })
      }, [])

      // var customMouse = new Vector2(0, 0);
    // var tempMousePos = new Vector2(0, 0);
    useFrame(({ mouse }) => {
        // console.log('mouseRightPressed', mouseRightPressed)
        // console.log('camera', props.position)
        if (mouseRightPressed == 1 && cameraRef.current) {
            // console.log('mouseRightPressed')
            var mouseMove = new Vector2(0, 0)
            var difX = (tempMousePos.x - mouse.x) * 100;
            var difY = (tempMousePos.y - mouse.y) * 100;

            // console.log('difX', difX)
            // console.log('tempMousePos', tempMousePos)
            // console.log('customMouse', mouse)
    
            if (difX < 0)  difX = difX * -1;
            if (difY < 0) difY = difY * -1;
    
            if (tempMousePos.x < mouse.x) {
                if (cameraRef.current.position.x > 0) {
                    mouseMove.x = 0.1 * difX;
                    // setCameraRefcameraRef.currentPositionX(cameraRef.currentPositionX - mouseMove.x)
                    cameraRef.current.position.set(cameraRef.current.position.x - mouseMove.x, cameraRef.current.position.y, cameraRef.current.position.z)
                }
            }
            else if (tempMousePos.x > mouse.x) {
                if (cameraRef.current.position.x < 40) {
                    mouseMove.x = 0.1 * difX;
                    // setCameraPositionX(cameraPositionX + mouseMove.x)
                    cameraRef.current.position.set(cameraRef.current.position.x + mouseMove.x, cameraRef.current.position.y, cameraRef.current.position.z)
                }
            }
            else if (tempMousePos.x == mouse.x) {
                mouseMove.x = 0;
            }
            if (tempMousePos.y < mouse.y) {
                if (cameraRef.current.position.z < 16) {
                    mouseMove.y = 0.1 * difY;
                    // setCameraRefcameraRef.currentPositionZ(cameraRef.currentPositionX + mouseMove.y)
                    cameraRef.current.position.set(cameraRef.current.position.x, cameraRef.current.position.y, cameraRef.current.position.z + mouseMove.y)
                }
            }
            else if (tempMousePos.y > mouse.y) {
                if (cameraRef.current.position.z > 0) {
                    mouseMove.y = 0.1 * difY;
                    // setCameraRefcameraRef.currentPositionZ(cameraRef.currentPositionX - mouseMove.y)
                    cameraRef.current.position.set(cameraRef.current.position.x, cameraRef.current.position.y, cameraRef.current.position.z - mouseMove.y)
                }
            }
            else if (tempMousePos.y == mouse.y) {
                mouseMove.y = 0;
            }
            // console.log('camera position', cameraRef.current.position)
            setTempMousePos(new Vector2(mouse.x, mouse.y))
            // tempMousePos.x = mouse.x;
            // tempMousePos.y = mouse.y;
            cameraRef.current.updateProjectionMatrix()
        }
    })
    
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


