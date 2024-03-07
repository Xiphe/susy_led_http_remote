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

// CONFIG KEYS
const CONFIG_KEYS = {
  brightness: 1,
  animation: 2,
  enabledStrips1: 10,
  enabledStrips2: 11,
  disabledStripBleed: 12,
} as const;

const API_URL = "http://led.local";
declare global {
  interface Window {
    config: string;
  }
}

export type SelectiveByteConfigEntry = [key: number, value: number];
export type SelectiveByteConfig = SelectiveByteConfigEntry[];
export type FullByteConfig = number[];

type Config = Record<keyof typeof CONFIG_KEYS, number>;

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
          <pre>
            <code>{error.stack}</code>
          </pre>
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

export function setStripEnabled(config: Config, strip: number, value: boolean) {
  const nextConfig = {
    enabledStrips1: config.enabledStrips1,
    enabledStrips2: config.enabledStrips2,
  } satisfies Partial<Config>;

  if (strip < 8) {
    if (value) {
      nextConfig.enabledStrips1 |= 1 << strip;
    } else {
      nextConfig.enabledStrips1 &= ~(1 << strip);
    }
  } else if (strip < 16) {
    if (value) {
      nextConfig.enabledStrips2 |= 1 << (strip - 8);
    } else {
      nextConfig.enabledStrips2 &= ~(1 << (strip - 8));
    }
  }

  return nextConfig;
}

export function getStripEnabled(config: Config, strip: number): boolean {
  if (strip < 8) {
    return (config.enabledStrips1 & (1 << strip)) !== 0;
  } else if (strip < 16) {
    return (config.enabledStrips2 & (1 << (strip - 8))) !== 0;
  }
  return false;
}

function byteConfigToObject(byteConfig: FullByteConfig) {
  const mappedConfig: Config = {} as Config;
  for (const key in CONFIG_KEYS) {
    const configKey = CONFIG_KEYS[key as keyof typeof CONFIG_KEYS];
    mappedConfig[key as keyof typeof CONFIG_KEYS] = byteConfig[configKey];
  }
  return mappedConfig;
}

function objectToByteConfig(config: Partial<Config>) {
  const byteConfig: SelectiveByteConfig = [];
  for (const key in config) {
    const configKey = CONFIG_KEYS[key as keyof typeof CONFIG_KEYS];
    byteConfig.push([configKey, config[key as keyof typeof config] as number]);
  }
  return byteConfig;
}

function readConfig(config: string) {
  // Extract the received checksum
  const receivedChecksumHex = config.substring(0, 2);
  const receivedChecksum = parseInt(receivedChecksumHex, 16);

  // Data string without the checksum
  const dataString = config.substring(2);

  // Calculate checksum from the data part
  let calculatedChecksum = 0;
  const pairs: FullByteConfig = [];
  for (let i = 0; i < dataString.length; i += 2) {
    const byteValue = parseInt(dataString.substring(i, i + 2), 16);
    pairs.push(byteValue);
    calculatedChecksum ^= byteValue;
  }

  // Validate checksum
  if (calculatedChecksum !== receivedChecksum) {
    throw new Error("Checksum mismatch. Data may be corrupted.");
  }

  return pairs;
}

async function sendConfig(...pairs: SelectiveByteConfig) {
  const res = await fetch(`${API_URL}/config`, {
    method: "POST",
    body: encodeData(...pairs),
  });

  if (res.status !== 204) {
    throw new Error(`Failed to send config: ${res.status} ${res.statusText}`);
  }

  return "ok" as const;
}

async function getConfig() {
  const res = await fetch(`${API_URL}/config`);
  if (res.status !== 200) {
    throw new Error(`Failed to get config: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

function encodeData(...pairs: SelectiveByteConfig) {
  let data = "";
  let checksum = 0;

  // Process each key-value pair
  pairs.forEach((pair) => {
    const [key, value] = pair.map((num) =>
      num.toString(16).padStart(2, "0").toUpperCase()
    );
    data += key + value;
    // Update checksum for both key and value
    checksum ^= parseInt(key, 16) ^ parseInt(value, 16);
  });

  // Convert checksum to hex and pad if necessary
  const checksumHex = checksum.toString(16).padStart(2, "0").toUpperCase();

  // Prepend checksum to data
  const encodedData = checksumHex + data;

  return encodedData;
}
