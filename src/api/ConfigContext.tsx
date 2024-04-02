import { Deferred } from "ichschwoer";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Config, byteConfigToObject, objectToByteConfig } from "./convert";
import { getConfig, isSending, readConfig } from "./api";
import { env } from "../env";
import { updateConfigThrottled } from "./updateConfigThrottled";

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
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Config>(() =>
    byteConfigToObject(readConfig(window.config))
  );

  const updateConfig = useCallback((newConfig: Partial<Config>) => {
    const d = new Deferred();
    const updateController = async (previousConfig: Config) => {
      try {
        await updateConfigThrottled(newConfig, () => {
          setLoading(true);
        });
      } catch (err) {
        setConfig(previousConfig);
        if (env !== "production") {
          console.error(err);
        }
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    setConfig((prev) => {
      updateController(prev).then(d.resolve, d.reject);
      return { ...prev, ...newConfig };
    });

    return d.promise;
  }, []);
  const value = useMemo(
    () => [config, updateConfig, loading] as const,
    [config, updateConfig, loading]
  );

  useEffect(() => {
    const i = setInterval(() => {
      if (isSending) {
        return;
      }

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
