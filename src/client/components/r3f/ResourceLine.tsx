import React, { useMemo } from "react";
import { ResourceItem } from "./ResourceItem";

export const ResourceLine = (props: any) => {
  const {
    line,
    textArrRef,
    rightBuildingType,
    textureLoader,
    position,
    frontBlockArray,
    textureSelected,
    worldType,
    staticBuildings,
    staticResources,
  } = props;

  const lineValue = useMemo(() => {
    if (line) return line;
  }, [line]);

  return (
    lineValue &&
    lineValue.map((elem: any, key: any) => {
      if (elem && elem.type && elem.type != 0) {
        return (
          <ResourceItem
            key={elem.infraType + "_" + elem.id}
            block={elem}
            textArrRef={textArrRef}
            rightBuildingType={rightBuildingType}
            position={position}
            frontBlockArray={frontBlockArray}
            textureLoader={textureLoader}
            textureSelected={textureSelected}
            worldType={worldType}
            level={elem.state}
            staticBuildings={staticBuildings}
            staticResources={staticResources}
          />
        );
      }
    })
  );
};
