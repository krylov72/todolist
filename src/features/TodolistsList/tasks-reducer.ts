import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "../../api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType, AppThunk } from "../../app/store";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { setStatus } from "../../app/app-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addTodolist, removeTodolist, setTodolists } from "./todolists-reducer";

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

const initialState: TasksStateType = {};

const tasksSlice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    removeTask(
      state,
      action: PayloadAction<{ taskId: string; todolistId: string }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      tasks.splice(index, 1);
    },
    addTask(state, action: PayloadAction<TaskType>) {
      const tasks = state[action.payload.todoListId];
      tasks.unshift(action.payload);
    },
    updateTask(
      state,
      action: PayloadAction<{
        taskId: string;
        model: UpdateDomainTaskModelType;
        todolistId: string;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);

      tasks[index] = { ...tasks[index], ...action.payload.model };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodolist, (state, action) => {
        return { ...state, [action.payload.id]: [] };
      })
      .addCase(removeTodolist, (state, action) => {
        const copyState = { ...state };
        delete copyState[action.payload];
        return copyState;
      })
      .addCase(setTodolists, (state, action) => {
        const copyState = { ...state };
        action.payload.forEach((tl) => {
          copyState[tl.id] = [];
        });
        return copyState;
      })
      .addCase(fetchTaskTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      });
  },
});

export const tasksReducer = tasksSlice.reducer;

export const { addTask, removeTask, updateTask } = tasksSlice.actions;

// thunks

export const fetchTaskTC = createAsyncThunk(
  "tasks/fetch-task",
  async (todolistId: string, { dispatch }) => {
    const res = await todolistsAPI.getTasks(todolistId);
    const tasks = res.data.items;
    return { tasks, todolistId };
  }
);

export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
      const action = removeTask({ taskId, todolistId });
      dispatch(action);
    });
  };
export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setStatus("loading"));
    todolistsAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const task = res.data.data.item;
          const action = addTask(task);
          dispatch(action);
          dispatch(setStatus("succeeded"));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const updateTaskTC =
  (
    taskId: string,
    domainModel: UpdateDomainTaskModelType,
    todolistId: string
  ): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state");
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const action = updateTask({ taskId, model: domainModel, todolistId });
          dispatch(action);
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
