import { bindActionCreators } from "@reduxjs/toolkit";
import { useAppDispatch } from "../store"
import { AccessActionCreators } from '../store/access/AccessSlice'

export const useActions = () => {
  const dispatch = useAppDispatch();
  return bindActionCreators(AccessActionCreators, dispatch);
}
