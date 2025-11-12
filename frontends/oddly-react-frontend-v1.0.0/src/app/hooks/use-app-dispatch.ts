import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'

/**
 * Typed useDispatch hook
 * Use throughout app instead of plain `useDispatch`
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
