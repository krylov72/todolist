import { Dispatch } from "redux";
import { authAPI } from "../api/todolists-api";
import { setIsLoggedIn } from "../features/Login/auth-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "./store";
import { addTaskTC, fetchTaskTC, updateTaskTC } from "../features/TodolistsList/tasks-reducer";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType;
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null;
  // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
  isInitialized: boolean;
};

const initialState: InitialStateType = {
  status: "idle",
  error: null,
  isInitialized: false,
};

export const appSlice = createSlice({
  initialState: initialState,
  name: "app",
  reducers: {
    setStatus(state, action: PayloadAction<RequestStatusType>) {
      state.status = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setIsInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskTC.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTaskTC.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(fetchTaskTC.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addTaskTC.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addTaskTC.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addTaskTC.pending,(state,action) => {
        state.status = 'loading';
      })
      .addCase(updateTaskTC.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateTaskTC.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateTaskTC.pending,(state,action) => {
        state.status = 'loading';
      })
  },
});

export const appReducer = appSlice.reducer;
export const { setError, setIsInitialized, setStatus } = appSlice.actions;

export const initializeAppTC = (): AppThunk => (dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn(true));
    } else {
    }

    dispatch(setIsInitialized(true));
  });
};
