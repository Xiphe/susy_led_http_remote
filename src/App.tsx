import { Animation } from "./Animation";
import { Brightness } from "./Brightness";
import { ConfigProvider } from "./config";

export default function App() {
  return (
    <ConfigProvider>
      <Animation />
      <hr />
      <Brightness />
    </ConfigProvider>
  );
}
