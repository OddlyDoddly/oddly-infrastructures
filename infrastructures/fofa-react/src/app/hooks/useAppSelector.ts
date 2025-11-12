import { useSelector } from 'react-redux';
import type { RootState } from '../store';

/**
 * Typed useSelector hook
 * 
 * Use this instead of plain useSelector for type safety.
 */
export const useAppSelector = useSelector.withTypes<RootState>();
