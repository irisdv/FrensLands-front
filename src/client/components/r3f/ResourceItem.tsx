import React, { memo, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector2 } from "three";
import { useSelectContext } from "../../hooks/useSelectContext";
import { useNewGameContext } from "../../hooks/useNewGameContext";

interface IBlock {
  block: any;
  textArrRef: any[];
  rightBuildingType: any[];
  position: any;
  frontBlockArray: any;
  textureLoader: any;
  textureSelected: any;
  worldType: any;
  level: number;
  staticBuildings: any;
  staticResources: any;
}

export const ResourceItem = memo<IBlock>(
  ({
    block,
    textArrRef,
    rightBuildingType,
    position,
    frontBlockArray,
    textureLoader,
    textureSelected,
    worldType,
    level,
    staticBuildings,
    staticResources,
  }): any => {
    const meshRef = useRef<any>();
    const clockRef = useRef<any>();
    const [clicked, setClicked] = useState(false);
    const [localTexture, setLocalTexture] = useState<any>(null);
    const [localTextureSelected, setLocalTextureSelected] = useState<any>(null);
    // const [localTextureClock, setLocalTextureClock] = useState<any>(null);
    const { frameData, updateBuildingFrame } = useSelectContext();
    const { harvestActions } = useNewGameContext();

    const frameDataValue = useMemo(() => {
      if (frameData != null && clicked) {
        setClicked(false);
        return frameData;
      }
    }, [clicked]);

    const harvestArrValue = useMemo(() => {
      if (harvestActions) {
        return harvestActions;
      }
    }, [harvestActions]);

    const blockValue = useMemo(() => {
      if (block) {
        setLocalTexture(textureLoader);
        return block;
      }
    }, [block, level]);

    const textureValue = useMemo(() => {
      let textureType: Vector2 = new Vector2(0, 0);
      if (block.infraType == 1) {
        if (block.type == 1) {
          if (block.state == 1) {
            textureType = findTextByID(
              staticResources[block.randType - 1].sprites[0]
            );
          } else {
            textureType = findTextByID(
              staticResources[block.randType - 1].harvestSprites[
                block.state - 1
              ]
            );
          }
        } else if (block.type == 2) {
          if (block.state == 1) {
            textureType = findTextByID(
              staticResources[block.randType - 1].sprites[0]
            );
          } else {
            textureType = findTextByID(
              staticResources[block.randType - 1].harvestSprites[
                block.state - 1
              ]
            );
          }
        } else {
          textureType = findTextByID(
            staticResources[block.randType - 1].sprites[0]
          );
        }
      } else if (block.infraType == 2) {
        if (block.type == 1 && block.state == 1) {
          textureType = findTextByID(2);
        } else {
          textureType = findTextByID(staticBuildings[block.type - 1].sprite[0]);
        }
      }
      const localT = textureLoader.clone();
      localT.needsUpdate = true;
      localT.offset.set(textureType.x, textureType.y);
      setLocalTexture(localT);
      return textureType;
    }, [block, blockValue, level]);

    const textureValueSelected = useMemo(() => {
      let textureType: Vector2 = new Vector2(0, 0);
      if (block.infraType == 1) {
        if (block.type == 1) {
          if (block.state == 1) {
            textureType = findTextByID(
              staticResources[block.randType - 1].sprites[0]
            );
          } else {
            textureType = findTextByID(
              staticResources[block.randType - 1].harvestSprites[
                block.state - 1
              ]
            );
          }
        } else if (block.type == 2) {
          if (block.state == 1) {
            textureType = findTextByID(
              staticResources[block.randType - 1].sprites[0]
            );
          } else {
            textureType = findTextByID(
              staticResources[block.randType - 1].harvestSprites[
                block.state - 1
              ]
            );
          }
        } else {
          textureType = findTextByID(
            staticResources[block.randType - 1].sprites[0]
          );
        }
      } else if (block.infraType == 2) {
        if (block.type == 1 && block.state == 1) {
          textureType = findTextByID(2);
        } else {
          textureType = findTextByID(staticBuildings[block.type - 1].sprite[0]);
        }
      }
      const localT = textureSelected.clone();
      localT.needsUpdate = true;
      localT.offset.set(textureType.x, textureType.y);
      setLocalTextureSelected(localT);
      return textureType;
    }, [block, blockValue, level]);

    const underConstruction = useMemo(() => {
      if (textureValue) {
        const textureType = findTextByID(65);

        const localT = textureLoader.clone();
        localT.needsUpdate = true;
        localT.offset.set(textureType.x, textureType.y);

        return localT;
      }
    }, [textureValue]);

    const underConstructionSelect = useMemo(() => {
      if (textureValue) {
        const textureType = findTextByID(65);

        const localT = textureSelected.clone();
        localT.needsUpdate = true;
        localT.offset.set(textureType.x, textureType.y);

        return localT;
      }
    }, [textureValue]);

    const clockTexture = useMemo(() => {
      if (textureLoader) {
        const textureType = findTextByID(241);
        const localT = textureLoader.clone();
        localT.needsUpdate = true;
        localT.offset.set(textureType.x, textureType.y);

        return localT;
      }
    }, [textureLoader]);

    const clockTextureHovered = useMemo(() => {
      if (textureLoader) {
        const textureType = findTextByID(242);
        const localT = textureLoader.clone();
        localT.needsUpdate = true;
        localT.offset.set(textureType.x, textureType.y);

        return localT;
      }
    }, [textureLoader]);

    const clockEmpty = useMemo(() => {
      if (textureLoader) {
        const textureType = findTextByID(256);
        const localT = textureLoader.clone();
        localT.needsUpdate = true;
        localT.offset.set(textureType.x, textureType.y);

        return localT;
      }
    }, [textureLoader]);

    function findTextByID(type: number) {
      const posText = new Vector2();
      let x = 0;
      let y = 15;

      while (y >= 0) {
        while (x < 16) {
          if (type == textArrRef[y][x]) {
            posText.x = x * (1 / 16);
            posText.y = y * (1 / 16);
            return posText;
          }
          x++;
        }
        x = 0;
        y--;
      }
      return new Vector2(0, 0);
    }

    useFrame(() => {
      if (!meshRef || !meshRef.current) {
        return;
      }
      if (!clockRef || !clockRef.current) {
        return;
      }
      if (
        meshRef.current &&
        clockRef.current &&
        blockValue &&
        textureValue &&
        textureValueSelected
      ) {
        clockRef.current.material.map = clockEmpty;

        // Case resource spawned
        if (blockValue.infraType == 1) {
          // resource selected
          if (
            (blockValue.posX == position.x && blockValue.posY == position.y) ||
            (blockValue.posX == frameData?.posX &&
              blockValue.posY == frameData?.posY)
          ) {
            meshRef.current.material.map = localTextureSelected;

            // Check if resource being harvested
            if (
              harvestArrValue != null &&
              harvestArrValue[blockValue.posY] &&
              harvestArrValue[blockValue.posY][blockValue.posX] &&
              harvestArrValue[blockValue.posY][blockValue.posX].status == 0
            ) {
              clockRef.current.material.map = clockTextureHovered;
            }
          } else {
            meshRef.current.material.map = localTexture;

            // check if resource being harvested
            if (
              harvestArrValue != null &&
              harvestArrValue[blockValue.posY] &&
              harvestArrValue[blockValue.posY][blockValue.posX] &&
              harvestArrValue[blockValue.posY][blockValue.posX].status == 0
            ) {
              clockRef.current.material.map = clockTexture;
            }
          }
          // Case building
        } else if (blockValue.infraType == 2) {
          // Building is selected / hovered
          if (
            (blockValue.posX == position.x && blockValue.posY == position.y) ||
            (blockValue.posX == frameData?.posX &&
              blockValue.posY == frameData?.posY)
          ) {
            // building under construction
            // if (frontBlockArray[blockValue[1]][blockValue[0]][10] == 0) {
            if (blockValue.status == 0) {
              meshRef.current.material.map = underConstructionSelect;

              // building upgraded or destroyed
            } else if (
              blockValue.status == 1 &&
              harvestArrValue != null &&
              harvestArrValue[blockValue.posY] &&
              harvestArrValue[blockValue.posY][blockValue.posX] &&
              harvestArrValue[blockValue.posY][blockValue.posX].status == 0
            ) {
              meshRef.current.material.map = underConstructionSelect;
            } else {
              meshRef.current.material.map = localTextureSelected;
            }

            // building is not selected hovered
          } else {
            // building under construction
            // if (frontBlockArray[blockValue[1]][blockValue[0]][10] == 0) {
            if (blockValue.status == 0) {
              meshRef.current.material.map = underConstruction;

              // building upgraded destroyed
            } else if (
              blockValue.status == 1 &&
              harvestArrValue != null &&
              harvestArrValue[blockValue.posY] &&
              harvestArrValue[blockValue.posY][blockValue.posX] &&
              harvestArrValue[blockValue.posY][blockValue.posX].status == 0
            ) {
              meshRef.current.material.map = underConstruction;
            } else {
              meshRef.current.material.map = localTexture;
            }
          }
        }
      } else {
        meshRef.current.material.map = localTexture;
      }
      // if (
      //   blockValue &&
      //   blockValue[0] &&
      //   blockValue[1] &&
      //   (blockValue[3] == 2 ||
      //     blockValue[3] == 3 ||
      //     blockValue[3] == 20 ||
      //     blockValue[3] == 27)
      // ) {
      //   // resource selected
      //   if (
      //     (blockValue[0] == position.x && blockValue[1] == position.y) ||
      //     (blockValue[0] == frameData?.posX &&
      //       blockValue[1] == frameData?.posY)
      //   ) {
      //     meshRef.current.material.map = localTextureSelected;

      //     if (
      //       harvestArrValue != null &&
      //       harvestArrValue[blockValue[1]] &&
      //       harvestArrValue[blockValue[1]][blockValue[0]] == 0
      //     ) {
      //       clockRef.current.material.map = clockTextureHovered;
      //     }
      //   } else {
      //     meshRef.current.material.map = localTexture;

      //     if (
      //       harvestArrValue != null &&
      //       harvestArrValue[blockValue[1]] &&
      //       harvestArrValue[blockValue[1]][blockValue[0]] == 0
      //     ) {
      //       clockRef.current.material.map = clockTexture;
      //     }
      //   }

      //   // Case building
      // } else if (
      //   blockValue != undefined &&
      //   blockValue[0] != undefined &&
      //   blockValue[1] != undefined &&
      //   blockValue[3] != 2 &&
      //   blockValue[3] != 3 &&
      //   blockValue[3] != 20 &&
      //   blockValue[3] != 27
      // ) {
      //   // Building is selected / hovered
      //   if (
      //     (blockValue[0] == position.x && blockValue[1] == position.y) ||
      //     (blockValue[0] == frameData?.posX &&
      //       blockValue[1] == frameData?.posY)
      //   ) {
      //     // building under construction
      //     if (frontBlockArray[blockValue[1]][blockValue[0]][10] == 0) {
      //       meshRef.current.material.map = underConstructionSelect;

      //       // building upgraded or destroyed
      //     } else if (
      //       frontBlockArray[blockValue[1]][blockValue[0]][10] == 1 &&
      //       harvestArrValue != null &&
      //       harvestArrValue[blockValue[1]] &&
      //       harvestArrValue[blockValue[1]][blockValue[0]] == 0
      //     ) {
      //       meshRef.current.material.map = underConstructionSelect;
      //     } else {
      //       meshRef.current.material.map = localTextureSelected;
      //     }

      //     // building is not selected hovered
      //   } else {
      //     // building under construction
      //     if (frontBlockArray[blockValue[1]][blockValue[0]][10] == 0) {
      //       meshRef.current.material.map = underConstruction;

      //       // building upgraded destroyed
      //     } else if (
      //       frontBlockArray[blockValue[1]][blockValue[0]][10] == 1 &&
      //       harvestArrValue != null &&
      //       harvestArrValue[blockValue[1]] &&
      //       harvestArrValue[blockValue[1]][blockValue[0]] == 0
      //     ) {
      //       meshRef.current.material.map = underConstruction;
      //     } else {
      //       meshRef.current.material.map = localTexture;
      //     }
      //   }
      // } else {
      //   meshRef.current.material.map = localTexture;
      // }
      // }
    });

    if (!meshRef) {
      return <></>;
    }

    if (!clockRef) {
      return <></>;
    }

    return (
      <>
        <mesh
          ref={meshRef}
          position={[
            blockValue.posX + 0.5,
            0.2 + blockValue.posY * 0.02,
            blockValue.posY,
          ]}
          name={`${blockValue.id}`.toString()}
          rotation={[-Math.PI * 0.5, 0, 0]}
        >
          <planeBufferGeometry
            name={`${blockValue.id}`.toString() + "_geom"}
            attach="geometry"
            args={[3.5, 3.5, 1, 1]}
          />
          <meshStandardMaterial
            attach="material"
            map={localTexture}
            name={`${blockValue.id}`.toString() + "_mat"}
            transparent={true}
            depthWrite={false}
            depthTest={true}
          />
        </mesh>

        {/* Clock texture resources being harvested */}
        <mesh
          ref={clockRef}
          position={[
            blockValue.posX + 0.5,
            0.2 + blockValue.posY * 0.02,
            blockValue.posY - 0.7,
          ]}
          name={`${blockValue.id}`.toString() + "_clock"}
          rotation={[-Math.PI * 0.5, 0, 0]}
        >
          <planeBufferGeometry
            name={`${blockValue.id}`.toString() + "_geom_clock"}
            attach="geometry"
            args={[3.5, 3.5, 1, 1]}
          />
          <meshStandardMaterial
            attach="material"
            map={clockTexture}
            name={`${blockValue.id}`.toString() + "_mat_clock"}
            transparent={true}
            depthWrite={false}
            depthTest={true}
          />
        </mesh>
      </>
    );
  }
);
