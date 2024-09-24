
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "../../api/todolists-api";
import { AppRootStateType, AppThunk } from "../../app/store";
import { setStatus } from "../../app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addTodolist, removeTodolist, setTodolists } from "./todolists-reducer";

import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils";
import { createAppAsyncThunk } from "common";


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
    }
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
      })
      .addCase(fetchTaskTC.rejected, (state, action) => {
        console.log(action.payload);
      })
      .addCase(addTaskTC.fulfilled,(state,action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      .addCase(updateTaskTC.fulfilled,(state,action) => {
        const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);

      tasks[index] = { ...tasks[index], ...action.payload.model };
      })
      
  },
});

export const tasksReducer = tasksSlice.reducer;

export const {removeTask } = tasksSlice.actions;

// thunks

export const fetchTaskTC = createAppAsyncThunk<
  {
    tasks: TaskType[];
    todolistId: string;
  },
  string
>(
  "tasks/fetch-task",
  async (todolistId: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await todolistsAPI.getTasks(todolistId);
      const tasks = res.data.items;
      return { tasks, todolistId };
    } catch (e: any) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
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

export const addTaskTC = createAppAsyncThunk<{task:TaskType},{todolistId:string,title:string}>("tasks/add-task", async ({todolistId,title},{dispatch,rejectWithValue}) => {
  try{
     const res = await todolistsAPI.createTask(todolistId, title)
        if (res.data.resultCode === 0) {
          const task = res.data.data.item;
          return {task}
        } else {
          handleServerAppError(res.data, dispatch);
          return rejectWithValue(null)
        }
        
  } catch(e:any) {
    handleServerNetworkError(e,dispatch)
    return rejectWithValue(null)
  }
})

export const updateTaskTC = createAppAsyncThunk<{taskId:string, model: UpdateDomainTaskModelType, todolistId:string},{ taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todolistId: string}>('tasks/update-task',async({todolistId,domainModel,taskId},{dispatch,rejectWithValue,getState}) => {
  const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state");
      return rejectWithValue(null);
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

    const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
     try{
      if (res.data.resultCode === 0) {
        return { taskId, model: domainModel, todolistId }
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null)
      }
     }
      catch(error:any) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null)
      }
})
