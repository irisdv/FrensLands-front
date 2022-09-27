import React, { useReducer } from 'react'

export interface IFrame {
  id?: number
  unique_id?: string
  level?: number
  posX?: any
  posY?: any
  selected?: any
}

export interface IPopUp {
  id?: number // id of bat_type
  unique_id?: string
  type?: number
  posX?: any
  posY?: any
  pop?: number
}

export interface ISelectState {
  showFrame?: boolean
  frameData?: IFrame
  updateBuildingFrame: (show: boolean, data: {}) => void
  sound?: boolean
  // updateSound: (val : boolean) => void;
  updateZoom: (val: boolean, account: string) => void
  // initZoom: (val : boolean) => void;
  zoomMode?: boolean
  tutoMode?: boolean
  updateTuto: (val: boolean, account: string) => void
  initSettings: (val: any) => void
}

export const SelectState: ISelectState = {
  showFrame: false,
  frameData: undefined,
  updateBuildingFrame: (show, data) => {},
  sound: true,
  // updateSound: (val) => {},
  zoomMode: true,
  updateZoom: (val, account) => {},
  // initZoom: (val) => {},
  tutoMode: undefined,
  updateTuto: (val, account) => {},
  initSettings: (val) => {}
}

const SelectContext = React.createContext(SelectState)

interface SetError {
  type: 'set_error'
  error: Error
}

interface SetShowFrame {
  type: 'set_showFrame'
  showFrame?: boolean
  frameData?: IFrame
  buildingSelected?: number
}
interface SetZoom {
  type: 'set_zoom'
  zoomMode?: boolean
}
interface SetTuto {
  type: 'set_tuto'
  tutoMode?: boolean
}
interface SetSettings {
  type: 'set_settings'
  zoomMode?: boolean
  tutoMode?: boolean
  sound?: boolean
}

type Action =
  | SetShowFrame
  // | SetSound
  | SetZoom
  | SetTuto
  | SetSettings
  | SetError

function reducer (state: ISelectState, action: Action): ISelectState {
  console.log('action type', action)
  switch (action.type) {
    case 'set_showFrame': {
      return {
        ...state,
        showFrame: action.showFrame,
        frameData: action.frameData
      }
    }
    case 'set_zoom': {
      return {
        ...state,
        zoomMode: action.zoomMode
      }
    }
    case 'set_tuto': {
      return {
        ...state,
        tutoMode: action.tutoMode
      }
    }
    case 'set_settings': {
      return {
        ...state,
        zoomMode: action.zoomMode,
        tutoMode: action.tutoMode,
        sound: action.sound
      }
    }
    case 'set_error': {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
    default: {
      return state
    }
  }
}

export const SelectStateProvider: React.FC<
React.PropsWithChildren<{ children: any }>
> = (props: React.PropsWithChildren<{ children: any }>): React.ReactElement => {
  const [state, dispatch] = useReducer(reducer, SelectState)

  const updateBuildingFrame = React.useCallback((show: boolean, data: {}) => {
    dispatch({
      type: 'set_showFrame',
      showFrame: show,
      frameData: data
    })
  }, [])

  const initSettings = React.useCallback((val: any) => {
    // {zoom: val, tutorial: val, sound: val}
    dispatch({
      type: 'set_settings',
      zoomMode: val.zoom as boolean,
      tutoMode: val.tutorial as boolean,
      sound: val.sound as boolean
    })
  }, [])

  const updateZoom = React.useCallback((val: boolean, account: string) => {
    fetch('http://localhost:3001/api/users/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('user') as string
      },
      body: JSON.stringify({ account, setting: { zoom: val } })
    })
      .then(async (response) => {
        return await response.text()
      })
      .then((data) => {
        console.log('Updated user settings successfully')
        dispatch({
          type: 'set_zoom',
          zoomMode: val
        })
      })
  }, [])

  const updateTuto = React.useCallback((val: boolean, account: string) => {
    fetch('http://localhost:3001/api/users/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('user') as string
      },
      body: JSON.stringify({ account, setting: { tutorial: val } })
    })
      .then(async (response) => {
        return await response.text()
      })
      .then((data) => {
        console.log('Updated user settings successfully')
        dispatch({
          type: 'set_tuto',
          tutoMode: val
        })
      })
  }, [])

  return (
    <SelectContext.Provider
      value={{
        frameData: state.frameData,
        showFrame: state.showFrame,
        updateBuildingFrame,
        sound: state.sound,
        // updateSound,
        zoomMode: state.zoomMode,
        updateZoom,
        // initZoom,
        tutoMode: state.tutoMode,
        updateTuto,
        initSettings
      }}
    >
      {props.children}
    </SelectContext.Provider>
  )
}

export default SelectContext
