import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

/**
 * Typed useDispatch hook
 * 
 * Use this instead of plain useDispatch for type safety.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
