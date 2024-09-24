
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "../../api/todolists-api";
import { AppRootStateType, AppThunk } from "../../app/store";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { setStatus } from "../../app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addTodolist, removeTodolist, setTodolists } from "./todolists-reducer";
import { createAppAsyncThunk } from "../../hooks/useAppAsyncThunk";

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
      })
      .addCase(fetchTaskTC.rejected, (state, action) => {
        console.log(action.payload);
      })
      .addCase(addTaskTC.fulfilled,(state,action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      
  },
});

export const tasksReducer = tasksSlice.reducer;

export const {removeTask, updateTask } = tasksSlice.actions;

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
