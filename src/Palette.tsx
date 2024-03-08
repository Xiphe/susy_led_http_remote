import { useConfig } from "./config";

const PALETTES = [
  "Custom 1",
  "Custom 2",
  "Rainbow Stripe",
  "Rainbow",
  "Party",
  "Ocean",
  "Lava",
  "Heat",
  "Forest",
  "Cloud",
];

export function Palette() {
  const [config, setConfig] = useConfig();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ animation1gradient: parseInt(ev.target.value) });
  };

  return (
    <>
      {PALETTES.map((palette, index) => {
        return (
          <label key={palette}>
            <input
              type="radio"
              value={index}
              checked={config.animation1gradient === index}
              name="palette_1"
              onChange={handleChange}
            />
            {palette}
          </label>
        );
      })}
    </>
  );
}
