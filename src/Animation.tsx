import { useConfig } from "./config";

export const ANIMATIONS = ["Plain", "Pictures", "Wobble"] as const;

export function Animation() {
  const [config, setConfig] = useConfig();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ animation1: parseInt(ev.target.value) });
  };

  return (
    <>
      {ANIMATIONS.map((animation, index) => {
        return (
          <label key={animation}>
            <input
              type="radio"
              value={index}
              checked={config.animation1 === index}
              name="animation"
              onChange={handleChange}
            />
            {animation}
          </label>
        );
      })}
      <br />
    </>
  );
}
