import { Fragment } from "react/jsx-runtime";
import {
  getStripEnabled,
  setStripEnabled,
  STRIPS,
  configKeyToName,
  useObjectConfig,
} from "../api";

export function EnabledStrips() {
  const [config, setConfig] = useObjectConfig();

  return (
    <>
      {Object.entries(STRIPS).map(([name, value]) => {
        if (name.startsWith("combi")) {
          return null;
        }

        const checked = getStripEnabled(config, value);

        return (
          <Fragment key={value}>
            <label>
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  setConfig(setStripEnabled(config, value, !checked))
                }
              />{" "}
              {configKeyToName(name, true)}
            </label>
            <br />
          </Fragment>
        );
      })}
    </>
  );
}
