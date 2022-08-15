import React, { useMemo, useState, useRef, useEffect } from "react";
import useResourcesContext from "../../hooks/useResourcesContext";

export function FrameItem(props : any) {
  const { resources} = useResourcesContext();

  return (
    <div className="flex flex-row justify-center inline-block relative">
        <div className={"mb-3 small"+`${props.content[0]}`} style={{marginLeft: '-12px'}}></div>
        <div className={`fontHPxl-sm ${props.content[1] >= resources[props.content[0]] ? `fontRed` : ``}`} style={{marginTop: '25px', marginLeft: '-20px'}}>{props.inputFuel ? props.content[1] * props.inputFuel : props.content[1]}</div>
    </div>
  )
}