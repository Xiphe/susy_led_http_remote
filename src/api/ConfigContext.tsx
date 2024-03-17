import { THROTTLE_DROPPED, createThrottle } from "ichschwoer";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Config, byteConfigToObject, objectToByteConfig } from "./convert";
import { getConfig, readConfig, sendConfig } from "./api";
import { env } from "../env";

declare global {
  interface Window {
    config: string;
  }
}

const ConfigContext = createContext<
  | readonly [
      config: Config,
      updateConfig: (newConfig: Partial<Config>) => void,
      loading: boolean
    ]
  | null
>(null);

export function ConfigProvider(props: PropsWithChildren) {
  const throttle = useMemo(() => createThrottle(300), []);
  const discardedUpdates = useRef<Partial<Config>>({});
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Config>(() =>
    byteConfigToObject(readConfig(window.config))
  );
  const updateConfig = useCallback(async (newConfig: Partial<Config>) => {
    let previousConfig: Config;
    setConfig((prev) => {
      previousConfig = prev;
      return { ...prev, ...newConfig };
    });

    const res = await throttle.push(async () => {
      setLoading(true);
      const update = { ...discardedUpdates.current, ...newConfig };
      discardedUpdates.current = {};
      try {
        await sendConfig(...objectToByteConfig(update));
      } catch (err) {
        setConfig(previousConfig);
        if (env !== "production") {
          console.error(err);
        }
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    });

    if (res === THROTTLE_DROPPED) {
      Object.assign(discardedUpdates, newConfig);
      return;
    }
  }, []);
  const value = useMemo(
    () => [config, updateConfig, loading] as const,
    [config, updateConfig, loading]
  );
  useEffect(() => {
    const i = setInterval(() => {
      getConfig()
        .then((data) => {
          setConfig(byteConfigToObject(readConfig(data)));
        })
        .catch((err) => {
          setError(err instanceof Error ? err : new Error(String(err)));
        });
    }, 10_000);

    return () => clearInterval(i);
  }, []);

  return (
    <ConfigContext.Provider value={value}>
      {error !== null ? (
        <div role="alert">
          <h4>Failed to write config</h4>
          <h5>{error.message}</h5>
          {env !== "production" ? (
            <pre>
              <code>{error.stack}</code>
            </pre>
          ) : null}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      ) : null}
      {props.children}
    </ConfigContext.Provider>
  );
}
export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (ctx === null) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return ctx;
}
