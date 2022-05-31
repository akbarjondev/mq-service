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

  const [callbackFormData, setCallbackFormData] = useState({});

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
      return axios.post(`${import.meta.env.VITE_MAIN_URL}/callbacks`, {
        callback_title: title,
        callback_url: url,
        callback_type: type,
        category_id: category,
        callback_active: active,
        callback_function1: function1,
        callback_function2: function2,
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

  let editCallbackMutation = useMutationAxios(
    ({ title, url, type, active, category, function1, function2, id }) => {
      return axios.put(`${import.meta.env.VITE_MAIN_URL}/callbacks`, {
        callback_title: title,
        callback_url: url,
        callback_type: type,
        category_id: category,
        callback_active: active,
        callback_function1: function1,
        callback_function2: function2,
        callback_id: id,
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
            callback_url,
            callback_type,
            callback_active,
            category_id,
            category_name,
            callback_function1,
            callback_function2,
          } = callback;

          return (
            <tr className={style.callback} key={callback_id}>
              <td className={style.callback__title}>
                {index + 1}.&nbsp;{callback_title}
              </td>
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
                  onClick={() => {
                    setModalData({
                      type: "edit",
                      open: true,
                    });

                    setCallbackFormData({
                      id: callback_id,
                      title: callback_title,
                      url: callback_url,
                      type: callback_type,
                      active: callback_active,
                      category: category_id,
                      function1: callback_function1,
                      function2: callback_function2,
                    });
                  }}
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
          <h2 className={style.callbacks__heading}>Callbacks</h2>
          <button
            className="btn btn-blue"
            onClick={() => {
              setModalData({ ...modalData, type: "create", open: true });
              setCallbackFormData({});
            }}
          >
            + Create
          </button>
          {loader && <Loader />}
        </div>

        {isLoading && <div>Wait a second...</div>}
        {error && <div>{error}</div>}

        <table className={style.callbacks__list}>
          <tbody>{callbacks && callbacksJSX(callbacks.data.data)}</tbody>
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
              event.preventDefault();
              setLoader(true);

              if (modalData.type === "create") {
                createCallbackMutation.mutate(callbackFormData);
              } else {
                editCallbackMutation.mutate(callbackFormData);
              }
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
                value={callbackFormData.title}
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
                value={callbackFormData.url}
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
                  value={callbackFormData.type}
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
                  value={callbackFormData.active}
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
                  value={callbackFormData.category}
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
                  1 - callback function
                </label>
                <CodeEditor
                  id="function1"
                  onChange={(event) => {
                    setCallbackFormData({
                      ...callbackFormData,
                      function1: event.target.value,
                    });
                  }}
                  code={
                    callbackFormData.function1 ? callbackFormData.function1 : ""
                  }
                />
              </div>
              <div className={style.form__control}>
                <label className="label" htmlFor="function2">
                  2 - callback function
                </label>
                <CodeEditor
                  id="function2"
                  onChange={(event) => {
                    setCallbackFormData({
                      ...callbackFormData,
                      function2: event.target.value,
                    });
                  }}
                  code={
                    callbackFormData.function2 ? callbackFormData.function2 : ""
                  }
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
