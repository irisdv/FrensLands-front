import { useContext } from "react";
import SelectContext from "../contexts/SelectContext";

export const useSelectContext = () => {
  const context = useContext(SelectContext);

  return context;
};
