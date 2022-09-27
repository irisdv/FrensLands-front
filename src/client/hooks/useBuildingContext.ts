import { useContext } from "react";
import BuildingContext from "../providers/BuildingContext";

export const useBuildingContext = () => {
  const context = useContext(BuildingContext);

  return context;
};
