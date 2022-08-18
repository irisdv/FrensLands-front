import React, { useMemo, useState, useRef, useEffect } from "react";
import useResourcesContext from "../../hooks/useResourcesContext";

export function FrameItem(props : any) {
  const { resources, energy, frensCoins } = useResourcesContext();

  if (props.option == 1) {
    resources[10] = frensCoins as number
    resources[11] = energy as number
  }

  return (
    <div className="flex flex-row justify-center inline-block relative">
        <div className={"mb-3 small"+`${props.content[0]}`} style={{marginLeft: '-15px'}}></div>
        <div className={`fontHPxl-sm ${resources[props.content[0]] < props.content[1] && props.option == 1 ? `fontRed` : ``}`} style={{marginTop: '25px', marginLeft: '-20px'}}>{props.inputFuel ? props.content[1] * props.inputFuel : props.content[1]}</div>
    </div>
  )
}