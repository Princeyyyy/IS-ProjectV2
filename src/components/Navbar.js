import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const initialState = {
  display: false,
  isAdmin: false,
  approved: false,
  username: null,
};

const Navbar = ({ active, setActive, user, handleLogout }) => {
  const [state, setState] = useState(initialState);
  const userId = user?.uid;
  const [display, setDisplayBoolean] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);
  const [approved, isApproved] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        // Check if userId is defined and valid
        if (!userId) {
          console.error("User ID is not defined.");
          return;
        }

        // Create a reference to the document with the specified user ID
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          setUsername(userDocSnapshot.data().fullName);

          // Check state of the user
          if (userDocSnapshot.data().role === "consumer") {
            setDisplayBoolean(false);
            setisAdmin(false);
            console.log("Recruitee");
          } else if (userDocSnapshot.data().role === "recruiter") {
            setDisplayBoolean(true);
            setisAdmin(false);
            console.log("Recruiter");
          } else if (userDocSnapshot.data().role === "admin") {
            setisAdmin(true);
            setDisplayBoolean(true);
            console.log("Admin");
          } else {
            setisAdmin(false);
            setDisplayBoolean(false);
            console.log("Unknown User Type");
          }

          // Check if user has been approved to publish
          if (userDocSnapshot.data().approved === true) {
            isApproved(true);
          } else {
            isApproved(false);
          }
        } else {
          // Handle the case where the document doesn't exist
          console.error("User document does not exist.");
        }
      } catch (error) {
        console.error("Error retrieving user status: ", error);
      }
    };

    getUser();
  }, [userId]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid bg-faded padding-media">
        <div className="container padding-media">
          <nav className="navbar navbar-toggleable-md navbar-light">
            <button
              className="navbar-toggler mt-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              data-bs-parent="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="true"
              aria-label="Toggle Navigation"
            >
              <span className="fa fa-bars"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <li
                    className={`nav-item nav-link ${
                      active === "home" ? "active" : ""
                    }`}
                    onClick={() => setActive("home")}
                  >
                    Home
                  </li>
                </Link>

                <Link to="/Jobs" style={{ textDecoration: "none" }}>
                  <li
                    className={`nav-item nav-link ${
                      active === "Jobs" ? "active" : ""
                    }`}
                    onClick={() => setActive("Jobs")}
                  >
                    Jobs
                  </li>
                </Link>

                {userId && display ? (
                  approved ? (
                    <Link to="/create" style={{ textDecoration: "none" }}>
                      <li
                        className={`nav-item nav-link ${
                          active === "create" ? "active" : ""
                        }`}
                        onClick={() => setActive("create")}
                      >
                        Add Job Listings
                      </li>
                    </Link>
                  ) : (
                    <Link to="/" style={{ textDecoration: "none" }}>
                      <li
                        className={`nav-item nav-link ${
                          active === "create" ? "active" : ""
                        }`}
                        onClick={() =>
                          toast.error("Wait for Approval from Admin")
                        }
                      >
                        Add Job Listings
                      </li>
                    </Link>
                  )
                ) : null}

                {userId && isAdmin ? (
                  <Link to="/approval" style={{ textDecoration: "none" }}>
                    <li
                      className={`nav-item nav-link ${
                        active === "approval" ? "active" : ""
                      }`}
                      onClick={() => setActive("approval")}
                    >
                      Approvals
                    </li>
                  </Link>
                ) : null}

                <Link to="/skillmaterial" style={{ textDecoration: "none" }}>
                  <li
                    className={`nav-item nav-link ${
                      active === "skillmaterial" ? "active" : ""
                    }`}
                    onClick={() => setActive("skillmaterial")}
                  >
                    Skill Development Materials
                  </li>
                </Link>

                <Link to="/about" style={{ textDecoration: "none" }}>
                  <li
                    className={`nav-item nav-link ${
                      active === "about" ? "active" : ""
                    }`}
                    onClick={() => setActive("about")}
                  >
                    About
                  </li>
                </Link>
              </ul>
              <div className="row g-3">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  {userId ? (
                    <>
                      <Link
                        to="/updateaccount"
                        style={{ textDecoration: "none" }}
                      >
                        <div className="profile-logo">
                          <img
                            src="/images/profile.png"
                            alt="logo"
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              marginTop: "12px",
                            }}
                          />
                        </div>
                      </Link>
                      {userId && isAdmin ? (
                        <Link
                          to="/addskills"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <p style={{ marginTop: "14px", marginLeft: "10px" }}>
                            {username}
                          </p>
                        </Link>
                      ) : (
                        <p style={{ marginTop: "14px", marginLeft: "10px" }}>
                          {username}
                        </p>
                      )}
                      <li className="nav-item nav-link" onClick={handleLogout}>
                        Logout
                      </li>
                    </>
                  ) : (
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <li
                        className={`nav-item nav-link ${
                          active === "login" ? "active" : ""
                        }`}
                        onClick={() => setActive("login")}
                      >
                        Login
                      </li>
                    </Link>
                  )}

                  {userId ? null : (
                    <Link to="/signup" style={{ textDecoration: "none" }}>
                      <li
                        className={`nav-item nav-link ${
                          active === "signup" ? "active" : ""
                        }`}
                        onClick={() => setActive("signup")}
                      >
                        Create Account
                      </li>
                    </Link>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
