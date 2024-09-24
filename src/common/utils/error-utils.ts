import { ResponseType } from "api/todolists-api";
import { setError, setStatus } from "app/app-reducer";
import { Dispatch } from "redux";


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
