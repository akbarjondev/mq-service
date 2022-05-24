import { Routes, Route } from "react-router-dom";
import Header from "./Header/Header";
import Callbacks from "./Callbacks/Callbacks";
import Sidebar from "./Sidebar/Sidebar";
import style from "./App.module.css";
import Categories from "./Categories/Categories";

function App() {
  return (
    <div className={style.app}>
      <Header />

      <div className={style.app__body}>
        <div className={style.app__sidebar}>
          <Sidebar />
        </div>
        <div className={style.app__main}>
          <Routes>
            <Route path="/" element={<Callbacks />} />
            <Route path="/callbacks" element={<Callbacks />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
