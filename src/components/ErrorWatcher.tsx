// Example in a component
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { IRootState } from "../store";
import { clearError } from "../features/statusSlice";

export default function ErrorWatcher() {
  const dispatch = useDispatch();
  const {success,error} = useSelector((state: IRootState) => state.status);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error,success, dispatch]);

  return null;
}
