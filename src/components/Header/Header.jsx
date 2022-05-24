import style from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className={style.header}>
      <Link to="/" className={style.header__link}>
        MQ Servise
      </Link>
    </header>
  );
};

export default Header;
