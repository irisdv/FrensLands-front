import { useMemo } from 'react'
import {useGameContext} from "./useGameContext";

export default function useResourcesContext() {
  const { energy, frensCoins, wood, rock, coal, metal, populationBusy, populationFree, meat, cereal } = useGameContext()

  return useMemo(() => {
    return (
        {
            energy, frensCoins, wood, rock, coal, metal, populationBusy, populationFree, meat, cereal
        }
    )
  }, [energy, frensCoins])
}
