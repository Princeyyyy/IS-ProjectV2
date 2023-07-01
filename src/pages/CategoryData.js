import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DataSection from "../components/DataSection";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const CategoryData = ({ setActive }) => {
  const [categoryDatas, setCategoryDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { category } = useParams();

  const getCategoryDatas = async () => {
    setLoading(true);
    const DataRef = collection(db, "Datas");
    const categoryDataQuery = query(DataRef, where("category", "==", category));
    const docSnapshot = await getDocs(categoryDataQuery);
    let categoryDatas = [];
    docSnapshot.forEach((doc) => {
      categoryDatas.push({ id: doc.id, ...doc.data() });
    });
    setCategoryDatas(categoryDatas);
    setLoading(false);
  };

  useEffect(() => {
    getCategoryDatas();
    setActive(null);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="Data-heading text-center py-2 mb-4">
            Category: <strong>{category.toLocaleUpperCase()}</strong>
          </div>
          {categoryDatas?.map((item) => (
            <div className="col-md-6">
              <DataSection key={item.id} {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryData;
