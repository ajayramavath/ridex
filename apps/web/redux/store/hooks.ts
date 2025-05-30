import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Typed `useDispatch`
export const useAppDispatch: () => AppDispatch = useDispatch;

// Typed `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
