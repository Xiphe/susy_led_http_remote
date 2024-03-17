import { Fragment } from "react/jsx-runtime";
import { useConfig, ANIMATIONS, ANIMATION_PARAMETERS } from "./api";

type AnimationKey = keyof typeof ANIMATIONS;
type Parameter = Exclude<keyof typeof ANIMATION_PARAMETERS, "palette">;

const ANIMATION_TO_PARAM_NAMES: Partial<
  Record<AnimationKey, Partial<Record<Parameter, string>>>
> = {
  wobble: {
    1: "Scale",
    2: "Y Speed",
    3: "X Speed",
    4: "Base Speed",
    5: "Base Offset",
  },
};

export function AnimationParams(props: { n: 1 | 2 }) {
  const [config, setConfig] = useConfig();

  const currentAnimation = Object.entries(ANIMATIONS).find(
    ([_, v]) => v === config[`animation${props.n}`]
  )?.[0] as AnimationKey;

  return (
    <>
      {(
        Object.keys(
          ANIMATION_PARAMETERS
        ) as (keyof typeof ANIMATION_PARAMETERS)[]
      ).map((param) => {
        if (param === "palette") {
          return null;
        }

        const name = ANIMATION_TO_PARAM_NAMES[currentAnimation]?.[param];

        if (!name) {
          return null;
        }

        const key = `animation${props.n}Param${param}` as const;

        return (
          <Fragment key={param}>
            <label>
              <input
                type="range"
                min={0}
                max={255}
                onChange={(ev) => {
                  setConfig({
                    [key]: parseInt(ev.target.value),
                  });
                }}
                value={config[key]}
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
