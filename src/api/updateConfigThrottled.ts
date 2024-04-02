import { THROTTLE_DROPPED, createThrottle } from "ichschwoer";
import { Config, objectToByteConfig } from "./convert";
import { sendConfig } from "./api";

let discardedUpdates: Partial<Config> = {};
const throttle = createThrottle(300);

export async function updateConfigThrottled(
  newConfig: Partial<Config>,
  onSend?: () => void | Promise<void>
) {
  const update = { ...discardedUpdates, ...newConfig };
  discardedUpdates = {};

  const res = await throttle.push(() =>
    Promise.all([sendConfig(...objectToByteConfig(update)), onSend?.()])
  );

  if (res === THROTTLE_DROPPED) {
    Object.assign(discardedUpdates, update);
  }
}
