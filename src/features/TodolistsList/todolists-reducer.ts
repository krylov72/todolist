import { todolistsAPI, TodolistType } from "../../api/todolists-api";
import { Dispatch } from "redux";

import { AppThunk } from "../../app/store";
import { RequestStatusType, setStatus } from "../../app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleServerNetworkError } from "common/utils/error-utils";

const initialState: Array<TodolistDomainType> = [];

const todolistsSlice = createSlice({
  initialState: initialState,
  name: "todolists",
  reducers: {
    removeTodolist(state, action: PayloadAction<string>) {
      const index = state.findIndex((tl) => tl.id === action.payload);
      state.splice(index, 1);
    },

    addTodolist(state, action: PayloadAction<TodolistType>) {
      state.unshift({ ...action.payload, filter: "all", entityStatus: "idle" });
    },
    changeTodolistTitle(
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].title = action.payload.title;
    },
    changeTodolistFilter(
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },

    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].entityStatus = action.payload.status;
    },

    setTodolists(state, action: PayloadAction<TodolistType[]>) {
      return action.payload.map((tl) => ({
        ...tl,
        filter: "active",
        entityStatus: "idle",
      }));
    },
  },
});

export const todolistsReducer = todolistsSlice.reducer;

export const {
  addTodolist,
  changeTodolistEntityStatus,
  changeTodolistFilter,
  changeTodolistTitle,
  removeTodolist,
  setTodolists,
} = todolistsSlice.actions;

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(setStatus("loading"));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolists(res.data));
        dispatch(setStatus("succeeded"));
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};
export const removeTodolistTC = (todolistId: string): AppThunk => {
  return (dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setStatus("loading"));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatus({ id: todolistId, status: "loading" }));
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolist(todolistId));
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(setStatus("succeeded"));
    });
  };
};
export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch) => {
    dispatch(setStatus("loading"));
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolist(res.data.data.item));
      dispatch(setStatus("succeeded"));
    });
  };
};
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return (dispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(changeTodolistTitle({ id, title }));
    });
  };
};

// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
