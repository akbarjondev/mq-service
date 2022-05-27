import loaderGif from "./../../assets/icons/loader.gif";
import style from "./Loader.module.css";

const Loader = ({ width = 36, height = 36 }) => {
  return (
    <img
      className={style.loader}
      src={loaderGif}
      width={width}
      height={height}
      alt="Loader, sppiner"
    />
  );
};

export default Loader;
