import { useConfig, ANIMATIONS, configKeyToName } from "../api";

export function Animation() {
  const [config, setConfig] = useConfig();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ animation1: parseInt(ev.target.value) });
  };

  return (
    <>
      {Object.entries(ANIMATIONS).map(([key, value]) => {
        return (
          <label key={key}>
            <input
              type="radio"
              value={value}
              checked={config.animation1 === value}
              name="animation"
              onChange={handleChange}
            />
            {configKeyToName(key)}
          </label>
        );
      })}
      <br />
    </>
  );
}
