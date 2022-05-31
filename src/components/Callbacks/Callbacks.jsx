import axios from "axios";
import { useQuery } from "react-query";
import style from "./Callbacks.module.css";

const Callbacks = () => {
  const {
    isLoading,
    error,
    data: callbacks,
    refetch,
  } = useQuery("callbacks", () =>
    axios.get(`${import.meta.env.VITE_MAIN_URL}/callbacks`)
  );

  const callbacksJSX = (arrOfCallbacks) => {
    return (
      <>
        {arrOfCallbacks.map((callback, index) => {
          let {
            callback_id,
            callback_title,
            callback_active,
            category_id,
            category_name,
          } = callback;

          return (
            <li className={style.callback} key={callback_id}>
              <div className={style.callback__text}>
                <div className={style.callback__index}>{index + 1}.&nbsp;</div>
                <div className={style.callback__title}>{callback_title}</div>
                <div className={style.callback__category}>{category_name}</div>
                <div
                  className={
                    callback_active
                      ? style["callback__active--on"]
                      : style.callback__active
                  }
                >
                  <span className="visually-hidden">callback status</span>
                </div>
              </div>
              <div className={style.callback__controls}>
                <button
                  className="btn btn-yellow"
                  // onClick={
                  //   // () =>
                  //   // setModalData({
                  //   //   id: callback_id,
                  //   //   name: category_name,
                  //   //   open: true,
                  //   // })
                  // }
                >
                  Edit
                </button>
                <button
                  className="btn btn-red"
                  onClick={() => {
                    // deleteCatMutation.mutate({ id: category_id });
                    // setLoader(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </>
    );
  };

  return (
    <div className={style.callbacks}>
      <h2 className={style.callbacks__heading}>Callbacks</h2>
      <div className={style.callback__header}>
        <div className={`${style.callback__head1} ${style.callback__head}`}>
          Callback title
        </div>
        <div className={`${style.callback__head2} ${style.callback__head}`}>
          Category
        </div>
        <div className={`${style.callback__head3} ${style.callback__head}`}>
          Status
        </div>
        <div className={`${style.callback__head4} ${style.callback__head}`}>
          Control
        </div>
      </div>
      <ol className={style.callbacks__list}>
        {isLoading && <div>Wait a second...</div>}
        {error && <div>{error}</div>}
        {callbacks && callbacksJSX(callbacks.data.data)}
      </ol>
    </div>
  );
};

export default Callbacks;
