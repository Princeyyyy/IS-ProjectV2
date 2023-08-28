import React, { useState, useEffect } from "react";
import "@pathofdev/react-tag-input/build/index.css";
import { db } from "../firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialState = {
  fullName: "",
  email: "",
  number: 0,
};

const UpdateAccount = ({ user }) => {
  const [form, setForm] = useState(initialState);
  const [createDataText, setcreateDataText] = useState(
    "Update Account Details"
  );
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();

  const { fullName, email, number } = form;

  useEffect(() => {
    user.uid && getDataDetail();
  }, [user.uid]);

  const getDataDetail = async () => {
    const docRef = doc(db, "users", user.uid);

    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setForm({ ...snapshot.data() });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fullName && email && number) {
      try {
        setcreateDataText("Updating Account details...");
        setIsDisabled(true);

        await updateDoc(doc(db, "users", user.uid), {
          ...form,
        });

        setcreateDataText("Update Account Details");
        setIsDisabled(false);
        toast.success("Account Details updated successfully");
      } catch (err) {
        toast.success("Error updating account details");
        setIsDisabled(false);
        setcreateDataText("Update Account Details");
        console.log(err);
      }
    } else {
      return toast.error("All fields are mandatory to fill");
    }

    navigate("/");
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
                  name="fullName"
                  value={fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <input
                  type="text"
                  className="form-control input-text-box"
                  placeholder="Course Content"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <input
                  type="tel"
                  className="form-control input-text-box"
                  placeholder="Course Url"
                  name="number"
                  value={number}
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

export default UpdateAccount;
