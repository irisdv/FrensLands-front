import React, { useMemo, useState, useRef, useEffect } from "react";
import { allAchievements } from "../../data/achievements";
import { useSelectContext } from "../../hooks/useSelectContext";
import { Achievement } from "../../model/achievement";
import UI_Frames from '../../style/resources/front/Ui_Frames3.svg';

export function Achievements(props : any) {
  const [showAchievement, setShowAchievement] = useState(true)
  const [lastAchievement, setLastAchievement] = useState<Achievement>()
  const [showGoal, setShowGoal] = useState(false)
  const [showDesc, setShowDesc] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [lastLevel, setLastLevel] = useState(0)

  const currAchievement = useMemo(() => {
    if (props.level != lastLevel) {
      setLastLevel(props.level)

      allAchievements.map((achievement: Achievement) => {
          if (achievement.level == props.level) {
            setLastAchievement(achievement)
            setShowInfo(true)
            return achievement
          }
      })
    }

  }, [props])

  return (
    <>
      {lastLevel < 9 ? 
        showAchievement ? 
          <div className="btnShowTuto0 pixelated selectDisable" onClick={() => setShowAchievement(!showAchievement)}></div>
        : 
          <div className="btnShowTuto1 pixelated selectDisable" onClick={() => setShowAchievement(!showAchievement)}></div>
        
        : ""
      }

      {!showGoal && showAchievement && lastLevel < 9  &&
        <div 
          className="btnGoals absolute pixelated selectDisable"
          onClick={() => setShowGoal(!showGoal)}
        ></div>

      }
      {showGoal && showAchievement && lastLevel < 9 &&
        <div className="absolute goalFrame pixelated selectDisable">
          {!showDesc && 
            <>
              <img src="resources/front/UI_ObjectiveFrame2.png" className="absolute selectDisable" />
              <p className="goalText fontHPxl-sm selectDisable">{lastAchievement && lastAchievement.goal}</p>
            </>
          }
          <div className="GoalArrowRight pixelated selectDisable" onClick={() => {
            setShowGoal(!showGoal) 
            setShowDesc(!showDesc)
          }}></div>
          
          {!showDesc && <div className="GoalArrowDown selectDisable" onClick={() => setShowDesc(!showDesc)}></div>}

          {showDesc &&
            <div className="selectDisable">
              <img src="resources/front/UI_ObjectiveFrame3.png" className="absolute" />
              <p className="goalText fontHPxl-sm">{lastAchievement && lastAchievement.goal}</p>
              <p className="goalDesc fontHPxl-sm">{lastAchievement && lastAchievement.goalDesc}</p>
              <div className="GoalArrowUp pixelated"onClick={() => setShowDesc(!showDesc)}></div>
           </div>
          }
        </div>
      }

      {showInfo && lastAchievement && lastLevel > 0 ?
        <div className="flex justify-center selectDisable">
          <div className="parentNotif">
            <div className="popUpNotifsAchievement pixelated fontHPxl-sm" style={{zIndex: 1, borderImage: `url(data:image/svg+xml;base64,${btoa(UI_Frames)}) 18 fill stretch` }}>
              <div className="closeAchievement" onClick={() => setShowInfo(false)}></div>
              <div className="achievementText">
                {lastLevel && lastLevel == 1 ? <><p>GM frens !</p><br/></> : ""}
                {lastAchievement && lastAchievement?.description &&  <p>{lastAchievement.description}</p> }
                <br/>
                {showAchievement && lastLevel < 9 ? 
                  <p><span>Next goal: </span>{lastAchievement.goal}</p>
                : ""}
                <br/>
                {lastAchievement && lastAchievement.unlock.length > 0 && <p>You just unlocked : </p>}
                <div className="flex flex-row justify-center inline-block relative">
                  {lastAchievement && lastAchievement.unlock.map((building : number) => {
                    return (
                      <div key={building} style={{width: '64px', height: '64px', position: 'relative'}}>
                        <div className={"building"+`${building}`} style={{marginLeft: "-32px", marginTop: "-32px"}}></div>
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
