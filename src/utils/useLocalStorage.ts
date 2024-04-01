import { Dispatch, SetStateAction, useCallback, useState } from "react";

export function useLocalStorage<S>(
  key: string,
  initialState: S | ((stored: S) => S)
): [S, Dispatch<SetStateAction<S>>];
export function useLocalStorage<S = undefined>(
  key: string
): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
export function useLocalStorage<S>(
  key: string,
  initialState?: unknown | ((stored: unknown) => unknown)
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<unknown>(() => {
    const current = JSON.parse(localStorage.getItem(key) ?? "null");

    let init = current;
    let write = false;
    if (isFunction(initialState)) {
      init = initialState(current);
      write = init !== current;
    } else if (current === null) {
      init = initialState;
      write = true;
    }

    if (write) {
      localStorage.setItem(key, JSON.stringify(init));
    }

    return init;
  });

  const setEffectful: Dispatch<SetStateAction<S>> = useCallback(
    (update) => {
      if (isFunction(update)) {
        setState((prev: S) => {
          const next = update(prev);
          localStorage.setItem(key, JSON.stringify(next));
          return next;
        });
      } else {
        localStorage.setItem(key, JSON.stringify(update));
        setState(update);
      }
    },
    [setState]
  );

  return [state as S, setEffectful];
}

function isFunction(value: unknown): value is CallableFunction {
  return typeof value === "function";
}
