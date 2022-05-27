import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useMutationAxios } from "../../hooks/useMutationRequest";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import style from "./Categories.module.css";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [loader, setLoader] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    name: null,
    open: false,
  });

  const {
    isLoading,
    error,
    data: categoriesReponse,
    refetch,
  } = useQuery("categories", () =>
    axios.get(`${import.meta.env.VITE_MAIN_URL}/categories`)
  );

  let createCatMutation = useMutationAxios(
    (catName) => {
      return axios.post(`${import.meta.env.VITE_MAIN_URL}/categories`, {
        name: catName,
      });
    },
    () => {
      refetch();
      setCategoryName("");
      setLoader(false);
    }
  );

  const editCatMutation = useMutationAxios(
    ({ id, name }) => {
      return axios.put(`${import.meta.env.VITE_MAIN_URL}/categories`, {
        id,
        name,
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

  return (
    <div className={style.categories__wrapper}>
      <form
        className={style.categories__form}
        onSubmit={(event) => {
          event.preventDefault();
          createCatMutation.mutate(categoryName);
          setLoader(true);
        }}
      >
        <div className={style.categories__control}>
          <label className={style.label} htmlFor="category">
            Create new category
            {loader && <Loader />}
          </label>
          <input
            className={style.categories__input + " input"}
            id="category"
            placeholder="Type here..."
            onChange={(event) => setCategoryName(event.target.value)}
            value={categoryName}
            required
          />
        </div>
        <button className="btn btn-blue">+ Create</button>
      </form>
      <h2 className={style.categories__heading}>Categories</h2>
      <ol className={style.categories}>
        {isLoading && <div>Wait a second...</div>}
        {error && <div>{error}</div>}
        {categoriesReponse &&
          categoriesReponse.data.data.map(
            ({ category_id, category_name }, index) => {
              return (
                <li className={style.category} key={category_id}>
                  {index + 1}. {category_name}
                  <div className={style.category__controls}>
                    <button
                      className="btn btn-yellow"
                      onClick={() =>
                        setModalData({
                          id: category_id,
                          name: category_name,
                          open: true,
                        })
                      }
                    >
                      Edit
                    </button>
                    <button className="btn btn-red">Delete</button>
                  </div>
                </li>
              );
            }
          )}
      </ol>
      <Modal
        className={style.modal}
        modalData={modalData}
        isOpen={modalData.open}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: "rgba(41, 41, 41, 0.5)",
          },
          content: {
            width: 500,
            height: 200,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <h3 className={style.modal__heading}>Edit category</h3>

        <div className={style.modal__body}>
          <input
            className={style.categories__input + " input"}
            placeholder="Type here..."
            type="text"
            value={modalData.name}
            onChange={(event) =>
              setModalData({
                ...modalData,
                name: event.target.value,
              })
            }
          />
        </div>

        <div className={style.modal__btnwrapper}>
          <button
            className={style.modal__btn + " btn btn-green"}
            onClick={() => {
              editCatMutation.mutate({
                id: modalData.id,
                name: modalData.name,
              });
              setLoader(true);
            }}
          >
            Save
          </button>
          <button
            className={style.modal__btn + " btn btn-red"}
            onClick={() =>
              setModalData({
                ...modalData,
                open: false,
              })
            }
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
