import React, { useState, useEffect } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { db, storage } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const initialState = {
  title: "",
  tags: [],
  category: "",
  description: "",
  comments: [],
  likes: [],
};

const categoryOption = [
  "Administrative and office",
  "Customer service",
  "Sales and marketing",
  "IT and computer",
  "Engineering",
  "Healthcare",
  "Education",
  "Business and financial",
  "Legal",
  "Creative",
  "Service",
];

const AddEditData = ({ user, setActive }) => {
  const [form, setForm] = useState(initialState);

  const [createDataText, setcreateDataText] = useState("Add Job Listing");
  const [updateDataText, setupdateDataText] = useState("Update Job Listing");
  const [isDisabled, setIsDisabled] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();

  const { title, tags, category, description } = form;

  const [document, setDocument] = useState(null);

  const [isUploaded, setIsUploaded] = useState(false);

  const [username, setUsername] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        // Create a reference to the document with the specified user ID
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        setUsername(userDocSnapshot.data().fullName);
      } catch (error) {
        console.error("Error retrieving user full name: ", error);
      }
    };

    getUser();
  }, [user.uid]);

  useEffect(() => {
    const uploadDocument = () => {
      const storageRef = ref(storage, document.name);
      const uploadTask = uploadBytesResumable(storageRef, document);
      const fileName = document.name;

      if (id) {
        setupdateDataText("Uploading...");
        setIsDisabled(true);
      } else {
        setcreateDataText("Uploading...");
        setIsDisabled(true);
      }

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info("Document uploaded to firebase successfully");
            setIsUploaded(true);

            if (id) {
              setupdateDataText("Update Job Posting");
              setIsDisabled(false);
            } else {
              setcreateDataText("Create Job Posting");
              setIsDisabled(false);
            }

            setForm((prev) => ({ ...prev, documentUrl: downloadUrl }));
            setForm((prev) => ({ ...prev, filename: fileName }));
          });
        }
      );
    };

    document && uploadDocument();
  }, [document]);

  useEffect(() => {
    id && getDataDetail();
  }, [id]);

  const getDataDetail = async () => {
    const docRef = doc(db, "Jobs", id);

    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setForm({ ...snapshot.data() });
    }
    setActive(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTags = (tags) => {
    setForm({ ...form, tags });
  };

  const onCategoryChange = (e) => {
    setForm({
      ...form,
      category: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category && tags && title && description && isUploaded) {
      if (!id) {
        try {
          setcreateDataText("Adding job details...");
          setIsDisabled(true);

          await addDoc(collection(db, "Jobs"), {
            ...form,
            timestamp: serverTimestamp(),
            author: username,
            userId: user.uid,
          });
          toast.success("Posting created successfully");
        } catch (err) {
          console.log(err);
        }
      } else {
        setupdateDataText("Updating job details...");
        setIsDisabled(true);

        try {
          await updateDoc(doc(db, "Jobs", id), {
            ...form,
            timestamp: serverTimestamp(),
            author: username,
            userId: user.uid,
          });
          toast.success("Posting updated successfully");
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      return toast.error("All fields are mandatory to fill");
    }

    navigate("/");
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12">
          <div className="text-center heading py-2">
            {id ? "Update Job Listing" : "Create Job Listing"}
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row Data-form" onSubmit={handleSubmit}>
              <div className="col-12 py-3">
                <input
                  type="text"
                  className="form-control input-text-box"
                  placeholder="Title"
                  name="title"
                  value={title}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <ReactTagInput
                  tags={tags}
                  placeholder="Tags"
                  onChange={handleTags}
                />
              </div>
              <div className="col-12 py-3">
                <select
                  value={category}
                  onChange={onCategoryChange}
                  className="catg-dropdown"
                >
                  <option>Please select category</option>
                  {/* Category */}
                  {categoryOption.map((option, index) => (
                    <option value={option || ""} key={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 py-3">
                <textarea
                  className="form-control description-box"
                  placeholder="Description"
                  value={description}
                  name="description"
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <div className="text-center heading">
                  Upload Supporting Document:
                </div>
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  placeholder="Upload supporting file"
                  onChange={(e) => setDocument(e.target.files[0])}
                />
              </div>
              <div className="col-12 py-3 text-center">
                <button
                  className="btn btn-add"
                  type="submit"
                  disabled={isDisabled}
                >
                  {id ? updateDataText : createDataText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditData;
