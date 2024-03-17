import { getConfig, readConfig, sendConfig } from "./api";
import { setBitPackedBools, getBitPackedBool } from "./convert";
import * as GROUPS from "./configGroups";

async function getByteConfig(key: void, log: true): Promise<void>;
async function getByteConfig(key: number, log: true): Promise<void>;
async function getByteConfig(key: void, log?: false): Promise<number[]>;
async function getByteConfig(key: number, log?: false): Promise<number>;
async function getByteConfig(
  key: number | void,
  log: boolean = false
): Promise<number | number[] | void> {
  const byteConfig = readConfig(await getConfig());
  if (key == null) {
    if (!log) {
      return byteConfig;
    }
    console.log(byteConfig);
  } else {
    if (!log) {
      return byteConfig[key];
    }
    console.log(byteConfig[key]);
  }
}

(window as any).__api = {
  sendConfig,
  setBitPackedBools,
  getBitPackedBool,
  getConfig(key: number) {
    getByteConfig(key, true);
  },
  async getStripCombi() {
    const config = await getByteConfig();

    console.log(config[10] | (config[11] << 8));
  },
  ...GROUPS,
};
