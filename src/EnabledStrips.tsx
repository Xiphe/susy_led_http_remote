import { Fragment } from "react/jsx-runtime";
import { getStripEnabled, setStripEnabled, useConfig } from "./config";

// StripKeys
const STRIPS = [
  "Bett 1",
  "Bett 2",
  "Bett 3",
  "Leinwand Mitte",
  "Leinwand Außen",
  "Tür unten 1",
  "Tür unten 2",
  "Tür oben 1",
  "Tür oben 2",
];

export function EnabledStrips() {
  const [config, setConfig] = useConfig();

  return (
    <>
      {STRIPS.map((name, index) => {
        const checked = getStripEnabled(config, index);

        return (
          <Fragment key={index}>
            <label>
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  setConfig(setStripEnabled(config, index, !checked))
                }
              />{" "}
              {name}
            </label>
            <br />
          </Fragment>
        );
      })}
    </>
  );
}
