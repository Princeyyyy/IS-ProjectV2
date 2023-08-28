import React, { useState } from "react";
import "@pathofdev/react-tag-input/build/index.css";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";

const initialState = {
  title: "",
  content: "",
  url: "",
};

const AddSkills = () => {
  const [form, setForm] = useState(initialState);
  const [createDataText, setcreateDataText] = useState("Add Skills");
  const [isDisabled, setIsDisabled] = useState(false);

  const { title, content, url } = form;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && content && url) {
      try {
        setcreateDataText("Adding skill details...");
        setIsDisabled(true);

        await addDoc(collection(db, "Materials"), {
          ...form,
        });

        // Clear the form by setting it back to the initial state
        setForm(initialState);

        setcreateDataText("Add skills");
        setIsDisabled(false);
        toast.success("Skills created successfully");
      } catch (err) {
        toast.success("Error adding skills");
        setIsDisabled(false);
        setcreateDataText("Add Skills");
        console.log(err);
      }
    } else {
      return toast.error("All fields are mandatory to fill");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12 text-center">
          <div className="text-center heading py-2">{"Add Skill Details"}</div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row Data-form" onSubmit={handleSubmit}>
              <div className="col-12 py-3">
                <input
                  type="text"
                  className="form-control input-text-box"
                  placeholder="Course Title"
                  name="title"
                  value={title}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <input
                  type="text"
                  className="form-control input-text-box"
                  placeholder="Course Content"
                  name="content"
                  value={content}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <input
                  type="text"
                  className="form-control input-text-box"
                  placeholder="Course Url"
                  name="url"
                  value={url}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3 text-center">
                <button
                  className={`btn btn-sign-in`}
                  type="submit"
                  disabled={isDisabled}
                >
                  {createDataText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSkills;
