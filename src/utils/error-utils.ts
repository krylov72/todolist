import { ResponseType } from "../api/todolists-api";
import { Dispatch } from "redux";
import { setError, setStatus } from "../app/app-reducer";

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch
) => {
  if (data.messages.length) {
    dispatch(setError(data.messages[0]));
  } else {
    dispatch(setError("Some error occurred"));
  }
  dispatch(setStatus("failed"));
};

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: Dispatch
) => {
  dispatch(setError(error.message ? error.message : "Some error occurred"));
  dispatch(setStatus("failed"));
};
