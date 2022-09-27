import React, { useMemo, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  TextureLoader,
  RepeatWrapping,
  NearestFilter,
  Vector2,
  Vector3,
} from "three";
import { useGameContext } from "../../hooks/useGameContext";
import { useBVH } from "@react-three/drei";
import { useSelectContext } from "../../hooks/useSelectContext";
import Resources from "../r3f/Resources";
import { Frens } from "../r3f/Frens";

export interface ISelectObject {
  unique_id?: any;
  type_id: any;
  pos?: Vector2;
}

export const MapSimple = (props: any) => {
  const {
    frontBlockArray,
    rightBuildingType,
    textArrRef,
    worldType,
    mouseLeftPressed,
    mouseMiddlePressed,
    mouseRightPressed,
    buildingsIDs,
  } = props;

  const mapRef = useRef<any>();
  useBVH(mapRef);
  const musicRef = useRef<THREE.Audio>();
  const { scene, raycaster, camera } = useThree();

  // Context
  // const { account } = useStarknet();
  const {
    tokenId,
    nonce,
    updateNonce,
    populationBusy,
    populationFree,
    harvestingArr,
    setHarvesting,
  } = useGameContext();
  // const { transactions, removeTransaction } = useNotifTransactionManager()
  const { frameData, updateBuildingFrame, sound } = useSelectContext();

  // Buildings
  let currBlockPos = new Vector2(0, 0);
  const [placementActive, setPlacementActive] = useState(0);
  const [tempBuildMeshTexture, setTempBuildMeshTexture] = useState(1);
  const [tempBuildMeshSize, setTempBuildMeshSize] = useState(1);
  const [tempBuildMesh, setTempBuildMesh] = useState(new Vector3(0, 0, 0));
  const [spaceValid, setSpaceValid] = useState(0);
  const [UBlockIDs, setUBlockIDs] = useState(buildingsIDs);

  // Select objects
  const [objectSelected, setObjectSelected] = useState(0);
  const [selectedObj, setSelectedObj] = useState<ISelectObject>();
  const [currBlockPosState, setCurrBlockPosState] = useState(new Vector2());

  // Frens
  const frensArray = useMemo(() => {
    let max = 1;
    if (populationBusy && populationFree) {
      if (populationBusy + populationFree > 35) {
        max = 7;
      } else {
        max = parseInt(((populationBusy + populationFree) / 5).toFixed(0)) + 1;
      }
    }
    let i = 0;
    const tempArray = [];
    while (i < max) {
      const curPos = new Vector2();
      const targetPos = new Vector2();

      curPos.x = parseInt((Math.random() * (39 - 1) + 1).toFixed(0));
      curPos.y = parseInt((Math.random() * (15 - 1) + 1).toFixed(0));
      targetPos.x = parseInt((Math.random() * (39 - 1) + 1).toFixed(0));
      targetPos.y = parseInt((Math.random() * (15 - 1) + 1).toFixed(0));

      tempArray.push({ curPos, targetPos });

      i++;
    }

    return tempArray;
  }, [populationBusy, populationFree]);

  const frameDataValue = useMemo(() => {
    if (frameData != null) {
      if (frameData.selected == 1) setPlacementActive(1);
      return frameData;
    }
  }, [frameData]);

  useFrame(({ mouse, raycaster }) => {
    currBlockPos = new Vector2(0, 0);

    const intersects = raycaster.intersectObjects(scene.children, true);
    let tempRayPos = new Vector3();
    const tempInter: any[] = [];
    const tempInterY: any[] = [];
    var i = 0;
    let k = 0;
    let j = 0;
    while (i < intersects.length) {
      if (
        intersects[i].point.y > -1 &&
        intersects[i].point.x > 1 &&
        intersects[i].point.z > 1
      ) {
        tempInter[k] = intersects[i].point;
        tempInterY[k] = intersects[i].point.y;
        k++;
      }
      i++;
    }
    tempInterY.sort(function (a, b) {
      return a - b;
    });
    while (j < k) {
      if (
        tempInter[j] != null &&
        tempInterY != null &&
        tempInterY[0] == tempInter[j].y
      ) {
        tempRayPos = tempInter[j];
        break;
      }
      j++;
    }
    if (tempRayPos != null) {
      const rayX = parseInt(tempRayPos.x.toFixed(2));
      const rayY = parseInt(tempRayPos.z.toFixed(2));

      if (rayX < 40 && rayX > 0 && rayY < 16 && rayY > 0) {
        currBlockPos.x = rayX;
        currBlockPos.y = rayY;
      } else {
        currBlockPos.x = 0;
        currBlockPos.y = 0;
      }

      setCurrBlockPosState(new Vector2(currBlockPos.x, currBlockPos.y));

      if (objectSelected == 0) {
        if (
          currBlockPos &&
          currBlockPos.x != null &&
          currBlockPos.y != null &&
          currBlockPos.x > 0 &&
          currBlockPos.x < 40 &&
          currBlockPos.y > 0 &&
          currBlockPos.y < 16 &&
          frontBlockArray[currBlockPos.y][currBlockPos.x] != null &&
          frontBlockArray[currBlockPos.y][currBlockPos.x][3] != null &&
          frontBlockArray[currBlockPos.y][currBlockPos.x][3] != 0
        ) {
          var pos: THREE.Vector2 = new Vector2();
          pos.x = currBlockPos.x;
          pos.y = currBlockPos.y;

          setObjectSelected(1);
          const obj: ISelectObject = {
            pos,
            type_id: frontBlockArray[currBlockPos.y][currBlockPos.x][3],
            unique_id: frontBlockArray[currBlockPos.y][currBlockPos.x][4],
          };
          setSelectedObj(obj);
        }
      }

      if (objectSelected == 1) {
        if (
          (selectedObj != null && selectedObj?.pos?.x != currBlockPos.x) ||
          selectedObj?.pos?.y != currBlockPos.y
        ) {
          // No objects are selected on the map
          var pos: THREE.Vector2 = new Vector2();
          pos.x = selectedObj?.pos?.x as number;
          pos.y = selectedObj?.pos?.y as number;

          setObjectSelected(0);

          const obj: ISelectObject = {
            pos: new Vector2(0, 0),
            type_id: 0,
            unique_id: 0,
          };
          setSelectedObj(obj);
        }
      }

      if (objectSelected == 1 && mouseLeftPressed == 1) {
        // OPEN POPUP BUILDING WITH INFORMATION - NOT SELECTED
        updateBuildingFrame(true, {
          id: selectedObj?.type_id,
          level: frontBlockArray[rayY][rayX][7],
          unique_id: selectedObj?.unique_id,
          posX: frontBlockArray[rayY][rayX][0],
          posY: frontBlockArray[rayY][rayX][1],
          selected: 0,
        });
      }
    }

    // FRENS GOING
    var i = 0;
    frensArray.map((fren: any, id: any) => {
      let tempValX = 0;
      let tempValY = 0;

      if (fren) {
        if (parseInt(fren.curPos.x.toFixed(1)) == fren.targetPos.x) {
          tempValX = 1;
        } else if (fren.curPos.x > fren.targetPos.x) {
          fren.curPos.x -= 0.01;
        } else {
          fren.curPos.x += 0.01;
        }

        if (parseInt(fren.curPos.y.toFixed(1)) == fren.targetPos.y) {
          tempValY = 1;
        } else if (fren.curPos.y > fren.targetPos.y) {
          fren.curPos.y -= 0.01;
        } else {
          fren.curPos.y += 0.01;
        }

        if (tempValX == 1 && tempValY == 1) {
          fren.curPos.x = fren.curPos.x;
          fren.curPos.y = fren.curPos.y;
          fren.targetPos.x = parseInt(
            (Math.random() * (39 - 1) + 1).toFixed(0)
          );
          fren.targetPos.y = parseInt(
            (Math.random() * (15 - 1) + 1).toFixed(0)
          );
        }
      }
    });
  });

  // Load Frens texture
  const frenTexture = useMemo(() => {
    if (textArrRef && textArrRef.length > 0) {
      let textObj;
      if (worldType == 1) {
        textObj = new TextureLoader().load(
          "resources/textures/Matchbox_Tiles_Objects_nogrid_1.png"
        );
      } else if (worldType == 2) {
        textObj = new TextureLoader().load(
          "resources/textures/Matchbox_Tiles_Objects_nogrid_2.png"
        );
      } else if (worldType == 3) {
        textObj = new TextureLoader().load(
          "resources/textures/Matchbox_Tiles_Objects_nogrid_3.png"
        );
      } else {
        textObj = new TextureLoader().load(
          "resources/textures/Matchbox_Tiles_Objects_nogrid_0.png"
        );
      }
      // textureType = findTextByID(193);
      textObj.offset.set(0, 0.1875);
      textObj.repeat = new Vector2(0.0625, 0.0625);
      textObj.magFilter = NearestFilter;
      textObj.wrapS = RepeatWrapping;
      textObj.wrapT = RepeatWrapping;

      return textObj;
    }
  }, [textArrRef]);

  return (
    <>
      {textArrRef &&
        textArrRef.length > 0 &&
        frontBlockArray &&
        Object.keys(frontBlockArray).length > 0 && (
          <Resources
            frontBlockArray={frontBlockArray}
            textArrRef={textArrRef}
            rightBuildingType={rightBuildingType}
            position={currBlockPosState}
            worldType={worldType}
            gallery={1}
          />
        )}

      {frensArray &&
        Object.keys(frensArray).length > 0 &&
        frensArray.map((fren: any, index: number) => {
          return (
            <Frens
              key={index}
              frenIndex={index}
              fren={fren}
              frenPosition={1}
              frenTexture={frenTexture}
            />
          );
        })}
    </>
  );
};
