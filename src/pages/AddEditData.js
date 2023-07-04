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
  imgUrl: "",
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

const imageOption = [
  "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/office.jpg?alt=media&token=96c2e329-4d52-4bce-a179-4f6d492c2f54",
  "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/service.jpg?alt=media&token=e4e17001-5d66-4aa4-a5fb-c5976827bd79",
  "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/sales.jpg?alt=media&token=e0316345-b9a4-477c-8193-a8dc856d25b0",
  "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/tech.png?alt=media&token=7a86eda3-229c-41ef-b158-738e20e432c9",
  "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/engineering.jpg?alt=media&token=91c42db1-bdd5-4e01-9964-c438fcc44739",
  "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/healthcare.jpg?alt=media&token=554f5d52-4693-47e3-b9b1-58cdbe62d717",
  "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/education.jpg?alt=media&token=69eeada6-d5df-44c0-8ce6-c6183f1753a1",
  "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/financial.jpg?alt=media&token=d343aa4e-c4a5-416e-87c1-574a1a575fd4",
  "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/legal.jpg?alt=media&token=fbce4ec4-c417-4af5-bb42-378d2595bb3d",
  "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/wp2659176-art-wallpaper.jpg?alt=media&token=324f048a-9b3a-4156-aa11-0182071bdc0b",
  "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/service.jpg?alt=media&token=e4e17001-5d66-4aa4-a5fb-c5976827bd79",
];

const AddEditData = ({ user, setActive }) => {
  const [form, setForm] = useState(initialState);

  const [createDataText, setcreateDataText] = useState("Add Job Listing");
  const [updateDataText, setupdateDataText] = useState("Update Job Listing");
  const [isDisabled, setIsDisabled] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();

  const { title, tags, category, description, imgUrl } = form;

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

            setForm((prev) => ({ ...prev, imgUrl: imgUrl }));
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
      imgUrl: getMindList(e.target.value),
    });
  };

  // Function to get the mind list based on the selected item from hello
  const getMindList = (selectedItem) => {
    // Example logic for generating the mind list based on the selected item
    switch (selectedItem) {
      case "Administrative and office":
        return "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/office.jpg?alt=media&token=96c2e329-4d52-4bce-a179-4f6d492c2f54";
      case "Customer service":
        return "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/service.jpg?alt=media&token=e4e17001-5d66-4aa4-a5fb-c5976827bd79";
      case "Sales and marketing":
        return "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/sales.jpg?alt=media&token=e0316345-b9a4-477c-8193-a8dc856d25b0";
      case "IT and computer":
        return "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/tech.png?alt=media&token=7a86eda3-229c-41ef-b158-738e20e432c9";
      case "Engineering":
        return "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/engineering.jpg?alt=media&token=91c42db1-bdd5-4e01-9964-c438fcc44739";
      case "Healthcare":
        return "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/healthcare.jpg?alt=media&token=554f5d52-4693-47e3-b9b1-58cdbe62d717";
      case "Education":
        return "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/education.jpg?alt=media&token=69eeada6-d5df-44c0-8ce6-c6183f1753a1";
      case "Business and financial":
        return "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/financial.jpg?alt=media&token=d343aa4e-c4a5-416e-87c1-574a1a575fd4";
      case "Legal":
        return "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/legal.jpg?alt=media&token=fbce4ec4-c417-4af5-bb42-378d2595bb3d";
      case "Creative":
        return "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/wp2659176-art-wallpaper.jpg?alt=media&token=324f048a-9b3a-4156-aa11-0182071bdc0b";
      case "Service":
        return "https://firebasestorage.googleapis.com/v0/b/skillconnect-f6945.appspot.com/o/service.jpg?alt=media&token=e4e17001-5d66-4aa4-a5fb-c5976827bd79";
      default:
        return "";
    }
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
