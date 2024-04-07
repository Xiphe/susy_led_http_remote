import { PALETTE_KEYS, configKeyToName, useObjectConfig } from "../api";

export type Props = {
  n: 1 | 2;
};
export function Palette({ n }: Props) {
  const key = `animation${n}ParamPalette` as const;
  const [config, setConfig] = useObjectConfig();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ [key]: parseInt(ev.target.value) });
  };

  return (
    <>
      {Object.entries(PALETTE_KEYS).map(([palette, value]) => {
        return (
          <label key={palette}>
            <input
              type="radio"
              value={value}
              checked={config[key] === value}
              name={`palette_${n}`}
              onChange={handleChange}
            />
            {configKeyToName(palette)}
          </label>
        );
      })}
    </>
  );
}
