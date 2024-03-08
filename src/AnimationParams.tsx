import { Fragment } from "react/jsx-runtime";
import { ANIMATIONS } from "./Animation";
import { useConfig } from "./config";

const PARAMS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

const ANIMATION_TO_PARAM_NAMES: Partial<
  Record<
    (typeof ANIMATIONS)[number],
    Partial<Record<(typeof PARAMS)[number], string>>
  >
> = {
  Wobble: {
    1: "Scale",
    2: "Y Speed",
    3: "X Speed",
    4: "Base Speed",
    5: "Base Offset",
  },
};

export function AnimationParams(props: { n: 1 | 2 }) {
  const [config, setConfig] = useConfig();

  const currentAnimation = ANIMATIONS[config[`animation${props.n}`]];

  if (!ANIMATION_TO_PARAM_NAMES[currentAnimation]) {
    return null;
  }

  return (
    <>
      {PARAMS.map((param, index) => {
        const name = ANIMATION_TO_PARAM_NAMES[currentAnimation]?.[param];

        if (!name) {
          return null;
        }

        return (
          <Fragment key={param}>
            <label>
              <input
                type="range"
                min={0}
                max={255}
                onChange={(ev) => {
                  setConfig({
                    [`animation${props.n}param${param}`]: parseInt(
                      ev.target.value
                    ),
                  });
                }}
                value={config[`animation${props.n}param${param}`]}
              />
              {name}
            </label>
            <br />
          </Fragment>
        );
      })}
    </>
  );
}
