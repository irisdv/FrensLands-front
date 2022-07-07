import { useContext } from "react";
import StateContext from "../contexts/GameContext";

export const useGameContext = () => {
  const context = useContext(StateContext);

  return context;
};
