import axios from "axios";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import Modal from "../Modal/Modal";
import style from "./Callbacks.module.css";
import { callbackTypes } from "./../../config/config";
import CodeEditor from "./../CodeEditor/CodeEditor";

const Callbacks = () => {
  const [modalData, setModalData] = useState({
    open: false,
    type: "create",
    data: {},
  });

  // get callbakcs
  const {
    isLoading,
    error,
    data: callbacks,
    refetch,
  } = useQuery("callbacks", () =>
    axios.get(`${import.meta.env.VITE_MAIN_URL}/callbacks`)
  );

  // get categories
  const { isSuccess, data: categories } = useQuery("categories", () =>
    axios.get(`${import.meta.env.VITE_MAIN_URL}/categories`)
  );

  const cachedCategories = useMemo(() => {
    if (isSuccess) return categories.data.data;

    return null;
  }, [isSuccess, categories]);

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
                <div
                  className={style.callback__category}
                  data-catid={category_id}
                >
                  {category_name}
                </div>
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
    <>
      <div className={style.callbacks}>
        <div className={style.callbacks__top}>
          <h2 className={style.callbacks__heading}>Callbacks</h2>
          <button
            className="btn btn-blue"
            onClick={() => setModalData({ ...modalData, open: true })}
          >
            + Create
          </button>
        </div>
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
      <Modal
        modalData={modalData}
        isOpen={modalData.open}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: "rgba(41, 41, 41, 0.5)",
          },
          content: {
            width: 1110,
            height: 610,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div className={style.modal__body}>
          <h3 className={style.modal__heading}>
            {modalData.type === "create" ? "Create" : "Edit"}
          </h3>
          <form className={style.modal__form}>
            <div className={style.form__control}>
              <label className="label" htmlFor="title">
                Callback title
              </label>
              <input
                className={`${style.form__input} input`}
                id="title"
                required
              />
            </div>

            <div className={style.form__control}>
              <label className="label" htmlFor="url">
                Callback URL
              </label>
              <input
                className={`${style.form__input} input`}
                id="url"
                required
              />
            </div>

            <div className={style.form__wrapper}>
              <div className={style.form__control}>
                <label className="label" htmlFor="type">
                  Callback type
                </label>
                <select
                  className={`${style.form__input} input`}
                  id="type"
                  required
                  type="text"
                >
                  {callbackTypes.map(({ id, name }) => (
                    <option value={name} key={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={style.form__control}>
                <label className="label" htmlFor="status">
                  Callback status
                </label>
                <select
                  className={`${style.form__input} input`}
                  id="status"
                  required
                  type="text"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Passive</option>
                </select>
              </div>

              <div className={style.form__control}>
                <label className="label" htmlFor="category">
                  Category
                </label>
                <select
                  className={`${style.form__input} input`}
                  id="category"
                  required
                >
                  {cachedCategories &&
                    cachedCategories.map(
                      ({ category_id: id, category_name: name }) => (
                        <option value={name} key={id}>
                          {name}
                        </option>
                      )
                    )}
                </select>
              </div>
            </div>

            <div className={style.form__functions}>
              <div className={style.form__control}>
                <label className="label" htmlFor="function1">
                  1 - callback function{" "}
                </label>
                <CodeEditor
                  id="function1"
                  onChange={(event) => console.log(event)}
                />
              </div>
              <div className={style.form__control}>
                <label className="label" htmlFor="function2">
                  2 - callback function{" "}
                </label>
                <CodeEditor
                  id="function2"
                  onChange={(event) => console.log(event)}
                />
              </div>
            </div>

            <div className={style.form__buttons}>
              <button className="btn btn-green" type="submit">
                Save
              </button>
              <button
                className="btn btn-red"
                onClick={() => setModalData({ ...modalData, open: false })}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Callbacks;
