import { useStarknet, useStarknetCall } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useBuildingsContract } from "../../hooks/contracts/buildings";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useGameContext } from "../../hooks/useGameContext";
import { useSelectContext } from "../../hooks/useSelectContext";

import { allAchievements } from "../../data/achievements";
import { Achievement } from "../../model/achievement";
import UI_Frames2 from '../../style/resources/front/Ui_Frames2.svg';
import DB from '../../db.json';

export function Achievements(props : any) {
  // const { address, showFrame, updateBuildingFrame } = useGameContext();
  const { address } = useGameContext();
  const { tutorial } = useSelectContext();
  const [lastAchievement, setLastAchievement] = useState<Achievement>()
  const [isNew, setIsNew] = useState(0)
  const [showAchievement, setShowAchievement] = useState(0)

  const { level } = props

  const currAchievement = useMemo(() => {
    let _newAchievement : Achievement = allAchievements[0];
    allAchievements.map((achievement: Achievement) => {
        if (achievement.level == level) {
          if (lastAchievement && achievement.level > lastAchievement?.level) {
            setIsNew(1)
            setShowAchievement(1)
          } else if (!lastAchievement) {
            setIsNew(1)
            setShowAchievement(1)
          }
          setLastAchievement(achievement)
          console.log('current achievement', achievement)
          _newAchievement = achievement
        }
    })
    console.log('isNew', isNew)
    return _newAchievement
  }, [props])

  // Close achievement, function met le isNew à 0
  // Show achievement : show le current achievement 

  const closeAchievement = () => {
    setIsNew(0)
    setShowAchievement(0)
  }


  return (
    <>
      {tutorial && showAchievement ?
        <div className="flex justify-center">
          <div className="parentNotif">
            <div className="popUpNotifsAchievement pixelated fontHPxl-sm" style={{zIndex: 1, borderImage: `url(data:image/svg+xml;base64,${btoa(UI_Frames2)}) 18 fill stretch`, borderImageSlice: "67 fill" }}>
              <div className="closeAchievement" onClick={() => closeAchievement()}></div>
              <div className="achievementText">
                {currAchievement && currAchievement?.description &&  <p>{currAchievement.description}</p> }
                <br/>
                <p><span>Next goal: </span>{currAchievement.goal}</p>
                <br/>
                {currAchievement && currAchievement.unlock.length > 0 && <p>You just unlocked : </p>}
                <div className="flex flex-row justify-center inline-block relative">
                  {currAchievement && currAchievement.unlock.map((building : number) => {
                    return (
                      <div style={{width: '64px', height: '64px', position: 'relative'}}>
                        <div className={"building"+`${building}`} style={{marginLeft: "-32px", marginTop: "-32px"}}></div>
                        {/* <p style={{marginTop: '-12px', marginLeft: '-12px'}}>{DB.buildings[building].name}</p> */}
                      </div>)
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      : ''}
    </>
  );
}
