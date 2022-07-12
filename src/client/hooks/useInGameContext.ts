import { useMemo } from 'react'
import {useGameContext} from "./useGameContext";

export default function useResourcesContext() {
  const { mapArray } = useGameContext()

  return useMemo(() => {
    return ({mapArray : mapArray})
  }, [mapArray])
}