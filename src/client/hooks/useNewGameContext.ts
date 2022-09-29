import { useContext } from "react";
import NewStateContext from "../providers/NewGameContext";

export const useNewGameContext = () => {
  const context = useContext(NewStateContext);

  return context;
};
