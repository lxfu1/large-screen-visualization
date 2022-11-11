import { useSnapshot } from "valtio";
import { Graph } from "./million";
import { state } from "./models";
import "./App.css";

function App() {
  const snap = useSnapshot(state);
  return (
    <div className="app">
      <span>{snap.count}</span>
      <input type="text" />
      <Graph />
    </div>
  );
}

export default App;
