const API_URL = "http://led.local";

export type SelectiveByteConfigEntry = [key: number, value: number];
export type SelectiveByteConfig = SelectiveByteConfigEntry[];
export type FullByteConfig = number[];

export function readConfig(config: string) {
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

export let isSending = false;
let t: number | undefined;
let lastSend: string | null = null;
export async function sendConfig(...pairs: SelectiveByteConfig) {
  const data = encodeData(...pairs);

  if (lastSend === data) {
    return "ok" as const;
  }

  clearTimeout(t);
  isSending = true;
  const res = await fetch(`${API_URL}/config`, {
    method: "POST",
    body: encodeData(...pairs),
  });
  t = setTimeout(() => {
    isSending = false;
  }, 300);

  if (res.status !== 204) {
    lastSend = null;
    throw new Error(`Failed to send config: ${res.status} ${res.statusText}`);
  }

  lastSend = data;
  return "ok" as const;
}

export async function getConfig() {
  const res = await fetch(`${API_URL}/config`);
  if (res.status !== 200) {
    throw new Error(`Failed to get config: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

export function encodeData(...pairs: SelectiveByteConfig) {
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
