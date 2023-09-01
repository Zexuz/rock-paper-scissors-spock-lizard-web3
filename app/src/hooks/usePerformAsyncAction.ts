import { useDispatch } from "react-redux";
import { setErrorSnackbar, setSuccessSnackbar } from "../store/uiSlice.ts";

export const usePerformAsyncAction = () => {
  const dispatch = useDispatch();

  const performAction = async (action: Function) => {
    try {
      await action();
      dispatch(setSuccessSnackbar("Action performed successfully"));
    } catch (error) {
      console.error(error);
      dispatch(setErrorSnackbar("Error performing action"));
    }
  };

  return performAction;
};
