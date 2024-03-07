import { useConfig } from "./config";

export function Animation() {
  const [config, setConfig] = useConfig();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ animation: parseInt(ev.target.value) });
  };

  return (
    <>
      <label>
        <input
          type="radio"
          value="0"
          checked={config.animation === 0}
          name="animation"
          onChange={handleChange}
        />
        Plain
      </label>
      <label>
        <input
          type="radio"
          value="1"
          checked={config.animation === 1}
          name="animation"
          onChange={handleChange}
        />
        Pictures
      </label>
      <label>
        <input
          type="radio"
          value="2"
          checked={config.animation === 2}
          name="animation"
          onChange={handleChange}
        />
        Wobble
      </label>
      <br />
    </>
  );
}
