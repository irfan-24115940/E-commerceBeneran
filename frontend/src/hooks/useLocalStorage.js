import { useState } from "react";

function useLocalStorage(
  key,
  initialValue
) {
  // GET DATA FROM LOCAL STORAGE
  const [storedValue, setStoredValue] =
    useState(() => {
      try {
        const item =
          localStorage.getItem(key);

        return item
          ? JSON.parse(item)
          : initialValue;
      } catch (error) {
        console.log(error);

        return initialValue;
      }
    });

  // SAVE DATA TO LOCAL STORAGE
  const setValue = (value) => {
    try {
      setStoredValue(value);

      localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;