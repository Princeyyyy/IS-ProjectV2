import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";

const Search = ({ handleChange, filters, categories, setCategories, db }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    if (queryParams.toString()) {
      navigate(`/search?${queryParams.toString()}`);
    } else {
      navigate("/");
    }
  };

  const fetchCategories = async () => {
    const dataRef = collection(db, "Jobs");
    const dataSnapshot = await getDocs(dataRef);
    const categoriesData = [];

    dataSnapshot.docs.forEach((doc) => {
      const category = doc.data().category;
      if (!categoriesData.includes(category)) {
        categoriesData.push(category);
      }
    });

    setCategories(categoriesData);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div style={{ paddingTop: "30px" }}>
      <div className="row align-items-center">
        <div className="Data-heading text-start py-2 mb-4 text-center heading py-2">
          Search
        </div>
        <div className="col-lg-9 col-md-6 col-sm-12">
          <form className="form-inline" onSubmit={handleSubmit}>
            <div className="form-group mx-sm-3 mb-2">
              <input
                type="text"
                name="text"
                value={filters.text}
                className="form-control search-input"
                placeholder="Search datasets..."
                onChange={handleChange}
              />
            </div>
            <div className="form-group mx-sm-3 mb-2">
              <select
                name="category"
                className="form-control"
                value={filters.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mx-sm-3 mb-2">
              <input
                type="text"
                name="tags"
                value={filters.tags}
                className="form-control search-input"
                placeholder="Search tags"
                onChange={handleChange}
              />
            </div>
            <button
              className="btn btn-warning search-btn"
              style={{ color: "white" }}
            >
              <i className="fa fa-search" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Search;
