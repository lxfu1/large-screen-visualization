import { Home } from "./pages/home";
import { Header } from "./components/header";
import { Bottom } from "./components/bottom";
import { Background } from "src/components/background";

import style from "./app.module.scss";

function App() {
  return (
    <div className={style.container}>
      <div className={style.background}>
        <Background />
      </div>
      <div className={style.content}>
        <Header />
        <Home />
        <Bottom />
      </div>
    </div>
  );
}

export default App;
