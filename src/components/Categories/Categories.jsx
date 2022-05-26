import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import Loader from "../Loader/Loader";
import style from "./Categories.module.css";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [loader, setLoader] = useState(false);

  const {
    isLoading,
    error,
    data: categoriesReponse,
    refetch,
  } = useQuery("categories", () =>
    axios.get(`${import.meta.env.VITE_MAIN_URL}/categories`)
  );

  const mutation = useMutation(
    (catName) => {
      return axios.post(`${import.meta.env.VITE_MAIN_URL}/categories`, {
        name: catName,
      });
    },
    {
      onSuccess: () => {
        refetch();
        setCategoryName("");
        setLoader(false);
      },
    }
  );

  return (
    <div className={style.categories__wrapper}>
      <form
        className={style.categories__form}
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(categoryName);
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
          categoriesReponse.data.data.map(({ category_id, category_name }) => {
            return (
              <li className={style.category} key={category_id}>
                {category_name}
              </li>
            );
          })}
      </ol>
    </div>
  );
};

export default Categories;
