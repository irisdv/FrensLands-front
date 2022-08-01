import React, { useMemo, useState, useRef, useEffect } from "react";

export function FrameItem(props : any) {

    console.log('props', props.content)


  return (
    <div key={props.key} className="flex flex-row justify-center inline-block relative">
        <div className={"mb-3 small"+`${props.content[0]}`} style={{marginLeft: '-12px'}}></div>
        <div className="fontHPxl-sm" style={{marginTop: '25px', marginLeft: '-20px'}}>{props.inputFuel ? props.content[1] * props.inputFuel : props.content[1]}</div>
    </div>
  )
}