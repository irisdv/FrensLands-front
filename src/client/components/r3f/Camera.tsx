import React, { useLayoutEffect, useRef, useState, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Vector2 } from "three";

export const Camera = (props: any) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const set = useThree(({ set }) => set);
  const size = useThree(({ size }) => size);

  const { mouseRightPressed, mouseWheelProp } = props;
  const [tempMousePos, setTempMousePos] = useState(new Vector2(0, 0));
  const [cameraPositionX, setCameraPositionX] = useState(21);
  const [cameraPositionY, setCameraPositionY] = useState(150);
  const [cameraPositionZ, setCameraPositionZ] = useState(9);
  const [zoom, setZoom] = useState(0);
  const [wayX, setWayX] = useState(0);
  const [wayZ, setWayZ] = useState(0);
  const [wayY, setWayY] = useState(0);

  const mouseWheelValue = useMemo(() => {
    console.log(mouseWheelProp);
    if (mouseWheelProp != null) {
      setZoom(1);
      console.log("mouseWheelProp", mouseWheelProp);
      return mouseWheelProp;
    }
  }, [mouseWheelProp]);

  useFrame(({ mouse }) => {
    if (cameraRef.current != null) {
      // CLASSIC INPUTS
      setCameraPositionY(15 * props.index);
      if (mouseRightPressed == 1) {
        const posX = cameraPositionX;
        const posZ = cameraPositionZ;

        const mouseMove = new Vector2(0, 0);
        let difX = (tempMousePos.x - mouse.x) * 100;
        let difY = (tempMousePos.y - mouse.y) * 100;

        if (difX < 0) difX = difX * -1;
        if (difY < 0) difY = difY * -1;

        if (tempMousePos.x < mouse.x) {
          if (cameraPositionX > 0) {
            mouseMove.x = 0.1 * difX;
            setCameraPositionX(cameraPositionX - mouseMove.x);
          }
        } else if (tempMousePos.x > mouse.x) {
          if (cameraPositionX < 40) {
            mouseMove.x = 0.1 * difX;
            setCameraPositionX(cameraPositionX + mouseMove.x);
          }
        } else if (tempMousePos.x == mouse.x) {
          mouseMove.x = 0;
        }
        if (tempMousePos.y < mouse.y) {
          if (cameraPositionZ < 16) {
            mouseMove.y = 0.1 * difY;
            setCameraPositionZ(cameraPositionZ + mouseMove.y);
          }
        } else if (tempMousePos.y > mouse.y) {
          if (cameraPositionZ > 0) {
            mouseMove.y = 0.1 * difY;
            setCameraPositionZ(cameraPositionZ - mouseMove.y);
          }
        } else if (tempMousePos.y == mouse.y) {
          mouseMove.y = 0;
        }
      }
      setTempMousePos(new Vector2(mouse.x, mouse.y));

      // CINEMATIQUE INPUT

      // let wayX:number = 0;
      // let wayZ:number = 0;

      // if (cameraPositionZ > 11)
      // {
      //   setCameraPositionZ(10.99);
      //   setWayZ(1);
      // }
      // else if (cameraPositionZ < 5)
      // {
      //   setCameraPositionZ(5.01);
      //   setWayZ(0);
      // }

      // if (cameraPositionX > 34)
      // {
      //   setCameraPositionX(33.99);
      //   setWayX(1);
      // }
      // else if (cameraPositionX < 6)
      // {
      //   setCameraPositionX(6.01);
      //   setWayX(0);
      // }

      // if (cameraPositionY > 190)
      // {
      //   setCameraPositionY(189.99);
      //   setWayY(1);
      // }
      // else if (cameraPositionY < 55)
      // {
      //   setCameraPositionY(55.01);
      //   setWayY(0);
      // }
      // //console.log("CAM X = ", cameraPositionX);
      // //console.log("CAM Y = ", cameraPositionY);

      // if (wayX == 0)
      // {
      //   setCameraPositionX(cameraPositionX + 0.01);
      // }
      // if (wayX == 1)
      // {
      //   setCameraPositionX(cameraPositionX - 0.01);
      // }

      // if (wayZ == 0)
      // {
      //   setCameraPositionZ(cameraPositionZ + 0.003);
      // }
      // if (wayZ == 1)
      // {
      //   setCameraPositionZ(cameraPositionZ - 0.003);
      // }

      // if (wayY == 0)
      // {
      //   setCameraPositionY(cameraPositionY + 0.08);
      // }
      // if (wayY == 1)
      // {
      //   setCameraPositionY(cameraPositionY - 0.08);
      // }

      // - - - -- - - - END OF CINEMATIC INPUT - - - - -- - - - - --

      cameraRef.current.aspect = size.width / size.height;
      cameraRef.current.position.set(
        cameraPositionX,
        cameraPositionY,
        cameraPositionZ
      );
      cameraRef.current.updateProjectionMatrix();
    } // END
  });

  useLayoutEffect(() => {
    set({ camera: cameraRef.current as THREE.PerspectiveCamera });
  }, []);

  return (
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
  );
};
