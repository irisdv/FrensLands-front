import React, { useReducer } from "react";
  
  
  export interface IFrame {
    id?: number;
    unique_id?: string;
    level?: number;
    posX?: any;
    posY?: any;
    selected?: any;
  }
  
  export interface IPopUp {
    id?: number; // id of bat_type
    unique_id?: string;
    type?: number;
    posX?: any;
    posY?: any;
    pop?: number;
  }
  
  export interface ISelectState {
    showFrame?: boolean;
    frameData?: IFrame;
    updateBuildingFrame: (show: boolean, data: {}) => void;
    sound?: boolean
    updateSound: (val : boolean) => void;
    zoomMode?: boolean
    updateZoom: (val : boolean) => void;
  }
  
  export const SelectState: ISelectState = {
    showFrame: false,
    frameData: undefined,
    updateBuildingFrame: (show, data) => {},
    sound: true,
    updateSound: (val) => {},
    zoomMode: false,
    updateZoom: (val) => {},
  };
  
  const SelectContext = React.createContext(SelectState);
  
  interface SetError {
    type: "set_error";
    error: Error;
  }
  
  interface SetShowFrame {
    type: "set_showFrame";
    showFrame?: boolean;
    frameData?: IFrame;
    buildingSelected?: number;
  }

  interface SetSound {
    type: "set_sound";
    sound?: boolean
  }

  interface SetZoom {
    type: "set_zoom";
    zoomMode?: boolean
  }
  
  type Action =
    | SetShowFrame
    | SetSound
    | SetZoom
    | SetError;
  
  function reducer(state: ISelectState, action: Action): ISelectState {
    switch (action.type) {
      case "set_showFrame": {
        return { ...state, 
          showFrame: action.showFrame, 
          frameData: action.frameData,
        };
      }
      case "set_sound": {
        return { ...state, 
          sound: action.sound
        };
      }
      case "set_zoom": {
        return { ...state, 
          zoomMode: action.zoomMode
        };
      }
      case "set_error": {
        throw new Error(`Unhandled action type: ${action.type}`);
      }
      default: {
        return state;
      }
    }
  }
  
  
  export const SelectStateProvider: React.FC<
    React.PropsWithChildren<{ children: any }>
  > = (props: React.PropsWithChildren<{ children: any }>): React.ReactElement => {  
    const [state, dispatch] = useReducer(reducer, SelectState);

    const updateBuildingFrame = React.useCallback((show: boolean, data: {}) => {
        dispatch({
          type: "set_showFrame",
          showFrame: show,
          frameData: data
        });
      },
      []
    );

    const updateSound = React.useCallback((val: boolean) => {
      dispatch({
        type: "set_sound",
        sound: val,
      });
    },
    []
  );

  const updateZoom = React.useCallback((val: boolean) => {
      dispatch({
        type: "set_zoom",
        zoomMode: val
      });
    },
    []
  );


    return (
      <SelectContext.Provider
        value={{
          frameData: state.frameData,
          showFrame: state.showFrame,
          updateBuildingFrame,
          sound: state.sound,
          updateSound,
          zoomMode: state.zoomMode,
          updateZoom
        }}
      >
        {props.children}
      </SelectContext.Provider>
    );
  };
  
  export default SelectContext;
  