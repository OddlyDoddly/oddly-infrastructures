import { useSelector } from 'react-redux'
import type { RootState } from '../store'

/**
 * Typed useSelector hook
 * Use throughout app instead of plain `useSelector`
 */
export const useAppSelector = useSelector.withTypes<RootState>()
