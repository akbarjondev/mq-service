import loaderGif from "./../../assets/icons/loader.gif";

const Loader = ({ width = 24, height = 24 }) => {
  return (
    <img src={loaderGif} width={width} height={height} alt="Loader, sppiner" />
  );
};

export default Loader;
