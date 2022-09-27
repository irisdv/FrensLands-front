import { useContext } from 'react'
import SelectContext from '../providers/SelectContext'

export const useSelectContext = () => {
  const context = useContext(SelectContext)

  return context
}
