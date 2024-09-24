import { LoginParamsType, authAPI } from "../../api/todolists-api";
import { setStatus } from "../../app/app-reducer";

import { AppThunk } from "../../app/store";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../common/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthInitialState = {
  isLoggedIn: boolean;
};

const initialState: AuthInitialState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;

export const { setIsLoggedIn } = authSlice.actions;

// thunks
export const loginTC =
  (data: LoginParamsType): AppThunk =>
  (dispatch) => {
    dispatch(setStatus("loading"));
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedIn(true));
          dispatch(setStatus("succeeded"));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setStatus("loading"));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedIn(false));
        dispatch(setStatus("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
