import React, { memo, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

interface IFrens {
  frenIndex: number;
  fren: any;
  frenPosition: any;
  frenTexture: any;
}

export const Frens = memo<IFrens>(
  ({ frenIndex, fren, frenPosition, frenTexture }): any => {
    const frenRef = useRef<any>();
    // const [clicked, setClicked] = useState(false);
    // const [localTexture, setLocalTexture] = useState<any>(null);

    const frenValue = useMemo(() => {
      if (fren && Object.keys(fren).length > 0) {
        // setLocalTexture(textureLoader)
        return fren;
      }
    }, [fren]);

    useFrame(() => {
      if (!frenRef || !frenRef.current) {
        return;
      }
      if (frenRef.current && frenValue) {
        frenRef.current.position.x = frenValue.curPos.x;
        frenRef.current.position.y = 0.3 + frenValue.curPos.y * 0.02; // Make sure the objects are higher at the bottom
        frenRef.current.position.z = frenValue.curPos.y;
      }
    });

    if (!frenRef) {
      return <></>;
    }

    return (
      <>
        <mesh
          ref={frenRef}
          name={`${frenIndex}`.toString()}
          rotation={[-Math.PI * 0.5, 0, 0]}
        >
          <planeBufferGeometry
            name={`${frenIndex}`.toString() + "_geom"}
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
    );
  }
);
