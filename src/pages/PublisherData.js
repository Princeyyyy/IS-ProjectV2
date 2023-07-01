import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DataSection from "../components/DataSection";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const UserData = ({ setActive }) => {
  const [UserDatas, setUserDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { author } = useParams();

  const getUserDatas = async () => {
    setLoading(true);
    const DataRef = collection(db, "Datas");
    const UserDataQuery = query(DataRef, where("author", "==", author));
    const docSnapshot = await getDocs(UserDataQuery);
    let UserDatas = [];
    let uniqueCategories = new Set();
    docSnapshot.forEach((doc) => {
      UserDatas.push({ id: doc.id, ...doc.data() });
      uniqueCategories.add(doc.data().category);
    });

    console.log("UserDatas", UserDatas);
    console.log("uniqueCategories", uniqueCategories);

    setUserDatas(UserDatas);
    setCategories([...uniqueCategories]);
    setLoading(false);
  };

  useEffect(() => {
    getUserDatas();
    setActive(null);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const displayedData = selectedCategory
    ? UserDatas.filter((item) => item.category === selectedCategory)
    : UserDatas;

    console.log("displayedData", displayedData);


  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="Data-heading text-center py-2 mb-4">
            Publisher: <strong>{author.toLocaleUpperCase()}</strong>
          </div>
          <div className="text-center mb-4">
            <button
              className="btn btn-secondary me-2"
              onClick={() => handleCategoryChange(null)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className="btn btn-secondary me-2"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
          {displayedData.map((item) => (
            <div className="col-md-6" key={item.id}>
              <DataSection {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserData;
