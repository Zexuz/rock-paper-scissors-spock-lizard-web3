import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearSuccessSnackbar,
  clearErrorSnackbar
} from '../store/uiSlice';
import {RootState} from "../store/store";

export const SnackBar = () => {
  const dispatch = useDispatch();
  const successSnackbar = useSelector((state: RootState) => state.ui.successSnackbar);
  const errorSnackbar = useSelector((state: RootState) => state.ui.errorSnackbar);

  useEffect(() => {
    if (successSnackbar || errorSnackbar) {
      const timer = setTimeout(() => {
        if (successSnackbar) {
          dispatch(clearSuccessSnackbar());
        }
        if (errorSnackbar) {
          dispatch(clearErrorSnackbar());
        }
      }, 5000); // hides after 5000ms or 5 seconds
      return () => clearTimeout(timer);
    }
  }, [successSnackbar, errorSnackbar, dispatch]);

  const renderSnackbar = (type: string, message: string) => {
    const classes = type === 'success' ? 'bg-green-400' : 'bg-red-400';
    return (
      <div className={`fixed bottom-0 right-0 m-4 p-4 text-white ${classes}`}>
        {message}
      </div>
    );
  };

  return (
    <>
      {successSnackbar && renderSnackbar('success', successSnackbar)}
      {errorSnackbar && renderSnackbar('error', errorSnackbar)}
    </>
  );
}
