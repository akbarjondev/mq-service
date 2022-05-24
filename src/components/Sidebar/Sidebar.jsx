import { Link } from "react-router-dom";
import callbackIcon from "./../../assets/icons/dashboard.svg";
import categoriesIcon from "./../../assets/icons/layers_alt.svg";
import style from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={style.sidebar}>
      <div className={style.sidebar__list}>
        <Link className={style.sidebar__link} to="callbacks">
          <img
            className={style.sidebar__img}
            src={callbackIcon}
            width={20}
            height={20}
            alt="Callback icon"
          />
          <span className="callback__text">Callbacks</span>
        </Link>
        <Link className={style.sidebar__link} to="categories">
          <img
            className={style.sidebar__img}
            src={categoriesIcon}
            width={20}
            height={20}
            alt="Categories icon"
          />
          <span className="callback__text">Categories</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
