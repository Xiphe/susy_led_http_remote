import { sendConfig, type ByteConfig } from "./api";
import { CONFIG_KEYS } from "./configGroups";

export type Config = Record<keyof typeof CONFIG_KEYS, number>;

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

export function getBitPackedBool(pack: number, entry: number) {
  return (pack & (1 << entry)) !== 0;
}

export function setBitPackedBools(
  input: number,
  updates: [key: number, value: boolean][]
) {
  for (const [key, value] of updates) {
    if (value) {
      input |= 1 << key;
    } else {
      input &= ~(1 << key);
    }
  }
  return input;
}

export function getStripEnabled(config: Config, strip: number): boolean {
  if (strip < 8) {
    return getBitPackedBool(config.enabledStrips1, strip);
  } else if (strip < 16) {
    return getBitPackedBool(config.enabledStrips2, strip - 8);
  }
  return false;
}

export function byteConfigToObject(byteConfig: ByteConfig) {
  const mappedConfig: Config = {} as Config;
  for (const key in CONFIG_KEYS) {
    const configKey = CONFIG_KEYS[key as keyof typeof CONFIG_KEYS];
    mappedConfig[key as keyof typeof CONFIG_KEYS] = byteConfig[configKey];
  }
  return mappedConfig;
}

export function objectToByteConfig(config: Partial<Config>) {
  const byteConfig: ByteConfig = {};
  for (const key in config) {
    const configKey = CONFIG_KEYS[key as keyof typeof CONFIG_KEYS];
    if (configKey == null) {
      throw new Error(`Unknown Config Key: ${key}`);
    }
    byteConfig[configKey] = config[key as keyof typeof config] as number;
  }
  return byteConfig;
}

export function configKeyToName(key: string, umlauts = false) {
  let name = key
    .split(/([A-Z0-9])/g)
    .reduce((memo, t, i) => {
      if (memo.length === 0) {
        return [t];
      }
      if (i % 2 === 0) {
        memo[memo.length - 1] += t;
        return memo;
      }
      return [...memo, t];
    }, [] as string[])
    .filter((t) => t.trim() !== "")
    .map((t) => `${t[0].toUpperCase()}${t.substring(1)}`)
    .join(" ");

  if (umlauts) {
    name = name
      .replace(/sz/g, "ß")
      .replace(/ue/g, "ü")
      .replace(/Ue/g, "Ü")
      .replace(/ae/g, "ä")
      .replace(/Ae/g, "Ä")
      .replace(/oe/g, "ö")
      .replace(/Oe/g, "Ö");
  }

  return name;
}

export async function sendObjectConfig(
  config: Partial<Config>,
  onSend?: () => void | Promise<void>
) {
  return sendConfig(objectToByteConfig(config), onSend);
}
