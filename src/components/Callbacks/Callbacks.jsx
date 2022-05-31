import axios from "axios";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import Modal from "../Modal/Modal";
import style from "./Callbacks.module.css";
import { callbackTypes } from "./../../config/config";
import CodeEditor from "./../CodeEditor/CodeEditor";
import { useMutationAxios } from "../../hooks/useMutationRequest";
import Loader from "../Loader/Loader";

const Callbacks = () => {
  const [loader, setLoader] = useState(false);

  const [modalData, setModalData] = useState({
    open: false,
    type: "create",
  });

  const [callbackFormData, setCallbackFormData] = useState({
    title: "",
    url: "",
    type: "",
    active: false,
    category: 0,
    function1: "",
    function2: "",
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

  let createCallbackMutation = useMutationAxios(
    ({ title, url, type, active, category, function1, function2 }) => {
      console.log({ title, url, type, active, category, function1, function2 });
      return axios.post(`${import.meta.env.VITE_MAIN_URL}/callbacks`, {
        callback_title: title,
        callback_url: url,
        callback_type: type,
        category_id: category,
        callback_active: active == "true" ? true : false,
        callback_function1: JSON.stringify(function1),
        callback_function2: JSON.stringify(function2),
      });
    },
    () => {
      refetch();
      setLoader(false);
      setModalData({
        ...modalData,
        open: false,
      });
    }
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
            <tr className={style.callback} key={callback_id}>
              <td className={style.callback__index}>{index + 1}.&nbsp;</td>
              <td className={style.callback__title}>{callback_title}</td>
              <td className={style.callback__category} data-catid={category_id}>
                {category_name}
              </td>
              <td
                className={`${style.callback__active} ${
                  callback_active
                    ? style["callback__active--on"]
                    : style["callback__active--off"]
                }`}
              >
                <span className="visually-hidden">callback status</span>
              </td>
              <td className={style.callback__controls}>
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
              </td>
            </tr>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className={style.callbacks}>
        <div className={style.callbacks__top}>
          <h2 className={style.callbacks__heading}>
            Callbacks {loader && <Loader />}
          </h2>
          <button
            className="btn btn-blue"
            onClick={() => setModalData({ ...modalData, open: true })}
          >
            + Create
          </button>
        </div>

        <table className={style.callbacks__list}>
          {isLoading && <div>Wait a second...</div>}
          {error && <div>{error}</div>}
          {callbacks && callbacksJSX(callbacks.data.data)}
        </table>
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
          <form
            className={style.modal__form}
            onSubmit={(event) => {
              event.prevendivefault();

              createCallbackMutation.mutate(callbackFormData);
            }}
          >
            <div className={style.form__control}>
              <label className="label" htmlFor="title">
                Callback title
              </label>
              <input
                className={`${style.form__input} input`}
                id="title"
                required
                type="text"
                onChange={(event) =>
                  setCallbackFormData({
                    ...callbackFormData,
                    title: event.target.value,
                  })
                }
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
                type="text"
                onChange={(event) =>
                  setCallbackFormData({
                    ...callbackFormData,
                    url: event.target.value,
                  })
                }
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
                  onChange={(event) => {
                    setCallbackFormData({
                      ...callbackFormData,
                      type: event.target.value,
                    });
                  }}
                >
                  <option defaultValue="">Select type</option>
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
                  onChange={(event) => {
                    setCallbackFormData({
                      ...callbackFormData,
                      active: event.target.value,
                    });
                  }}
                >
                  <option defaultValue="">Select status</option>
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
                  onChange={(event) => {
                    setCallbackFormData({
                      ...callbackFormData,
                      category: event.target.value,
                    });
                  }}
                >
                  <option defaultValue="">Select category</option>
                  {cachedCategories &&
                    cachedCategories.map(
                      ({ category_id: id, category_name: name }) => (
                        <option value={id} key={id}>
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
                  onChange={(event) => {
                    setCallbackFormData({
                      ...callbackFormData,
                      function1: event.target.value,
                    });
                  }}
                />
              </div>
              <div className={style.form__control}>
                <label className="label" htmlFor="function2">
                  2 - callback function{" "}
                </label>
                <CodeEditor
                  id="function2"
                  onChange={(event) => {
                    setCallbackFormData({
                      ...callbackFormData,
                      function2: event.target.value,
                    });
                  }}
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
