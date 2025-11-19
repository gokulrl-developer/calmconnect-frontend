import { useCallback } from "react";

type QueryParams = Record<string, string | number | null | undefined>;

export function useUpdateQueryParams() {
  const updateQueryParams = useCallback((paramsToUpdate: QueryParams): void => {
    const params = new URLSearchParams(window.location.search);

    Object.keys(paramsToUpdate).forEach((key) => {
      const value = paramsToUpdate[key];
      if (value === null || value === undefined) {
        params.delete(key); 
      } else {
        params.set(key, String(value)); 
      }
    });

    window.history.replaceState({}, "", "?" + params.toString());
  }, []);

  return { updateQueryParams };
}
