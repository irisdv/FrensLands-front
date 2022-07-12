import { useContext } from "react";
import StateContext from "../providers/GameContext";

export const useGameContext = () => {
  const context = useContext(StateContext);

  return context;
};
