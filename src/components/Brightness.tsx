import { useConfig } from "../api";

export function Brightness() {
  const [config, setConfig] = useConfig();

  return (
    <label>
      Brightness <br />
      <button
        disabled={config.brightness === 0}
        onClick={() =>
          setConfig({ brightness: Math.max(0, config.brightness - 10) })
        }
      >
        Decrease
      </button>
      <input
        type="range"
        min={0}
        max={255}
        value={config.brightness}
        onChange={(ev) => setConfig({ brightness: parseInt(ev.target.value) })}
      />
      <button
        disabled={config.brightness === 255}
        onClick={() =>
          setConfig({ brightness: Math.min(255, config.brightness + 10) })
        }
      >
        Increase
      </button>
    </label>
  );
}
