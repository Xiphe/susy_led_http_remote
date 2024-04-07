import { THROTTLE_DROPPED, createThrottle } from "ichschwoer";

const API_URL = "http://led.local";

export type ByteConfig = Record<number, number>;

export function readConfig(config: string): ByteConfig {
  // Extract the received checksum
  const receivedChecksumHex = config.substring(0, 2);
  const receivedChecksum = parseInt(receivedChecksumHex, 16);

  // Data string without the checksum
  const dataString = config.substring(2);

  // Calculate checksum from the data part
  let calculatedChecksum = 0;
  const entries: [key: number, value: number][] = [];
  for (let i = 0; i < dataString.length; i += 2) {
    const byteValue = parseInt(dataString.substring(i, i + 2), 16);
    entries.push([i / 2, byteValue]);
    calculatedChecksum ^= byteValue;
  }

  // Validate checksum
  if (calculatedChecksum !== receivedChecksum) {
    throw new Error("Checksum mismatch. Data may be corrupted.");
  }

  return Object.fromEntries(entries);
}

export let isSending = false;
let discardedUpdates: ByteConfig = {};
let t: number;
const throttle = createThrottle(300);

export async function sendConfig(
  config: ByteConfig,
  onSend?: () => void | Promise<void>
) {
  const update = { ...discardedUpdates, ...config };
  discardedUpdates = {};

  const res = await throttle.push(async () => {
    clearTimeout(t);
    isSending = true;
    const [res] = await Promise.all([
      fetch(`${API_URL}/config`, {
        method: "POST",
        body: encodeData(update),
      }),
      onSend?.(),
    ]);

    t = setTimeout(() => {
      isSending = false;
    }, 300);

    if (res.status !== 204) {
      throw new Error(`Failed to send config: ${res.status} ${res.statusText}`);
    }
  });

  if (res === THROTTLE_DROPPED) {
    Object.assign(discardedUpdates, update);
  }
}

export function encodeData(config: ByteConfig) {
  let data = "";
  let checksum = 0;

  // Process each key-value pair
  Object.entries(config).forEach((pair) => {
    const [key, value] = pair.map((num) =>
      (typeof num === "string" ? parseInt(num) : num)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()
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

export async function getConfig() {
  const res = await fetch(`${API_URL}/config`);
  if (res.status !== 200) {
    throw new Error(`Failed to get config: ${res.status} ${res.statusText}`);
  }
  return res.text();
}
