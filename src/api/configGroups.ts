import { BYTE_CONFIG } from "./config";
import { getConfigKeys } from "./getConfigKeys";

export const CONFIG_KEYS = getConfigKeys(BYTE_CONFIG, "CONFIG_");
export const STRIPS = getConfigKeys(BYTE_CONFIG, "STRIP_");
export const PALETTE_CONFIG = getConfigKeys(BYTE_CONFIG, "PALETTE_CONFIG_");
export const PALETTE_OFFSETS = getConfigKeys(
  BYTE_CONFIG,
  "OFFSET_CONFIG_PALETTE_"
);
export const PALETTE_KEYS = getConfigKeys(BYTE_CONFIG, "PALETTE_KEY_");
export const PREVIEW = getConfigKeys(BYTE_CONFIG, "PREVIEW_");
export const ANIMATIONS = getConfigKeys(BYTE_CONFIG, "ANIMATION_");
export const ANIMATION_PARAMETERS = getConfigKeys(
  BYTE_CONFIG,
  "CONFIG_ANIMATION_1_PARAM_"
);
