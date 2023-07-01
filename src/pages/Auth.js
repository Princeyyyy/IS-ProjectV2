import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

const initialState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "consumer",
};

const Auth = ({ setActive, setUser }) => {
  const [state, setState] = useState(initialState);
  const [signUp, setSignUp] = useState(false);

  const [signUpText, setsignUpText] = useState("Sign Up");
  const [signInText, setsignInText] = useState("Sign In");
  const [isDisabled, setIsDisabled] = useState(false);

  const { email, password, userName, confirmPassword, role } = state;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handlerole = (e) => {
    setState({ ...state, role: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!signUp) {
      if (email && password) {
        setsignInText("Signing in...");
        setIsDisabled(true);

        try {
          // Perform login using Firebase authentication
          const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          setUser(user);
          setActive("home");

          //Navigate and toast
          toast.success("Welcome to the Open Data Portal");
          navigate("/");
        } catch (error) {
          // Catch and console log Firebase authentication errors
          setsignInText("Sign In");
          setIsDisabled(false);
          toast.error(error.message);
          console.error("Login error:", error);
        }
      } else {
        return toast.error("All fields are mandatory to fill");
      }
    } else {
      if (password !== confirmPassword) {
        return toast.error("Password don't match");
      }
      if (userName && email && password) {
        setsignUpText("Creating your account...");
        setIsDisabled(true);

        try {
          // Perform signup using Firebase authentication
          const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          // Save the user's details to a new document with their user ID as the document ID
          await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: userName,
            email: email,
            role: role,
            approved: false,
          });

          setUser(user);
          setActive("home");

          //Navigate and toast
          toast.success("Welcome to the Open Data Portal");
          navigate("/");
        } catch (error) {
          // Catch and console log Firebase authentication errors
          setsignUpText("Sign Up");
          setIsDisabled(false);
          toast.error(error.message);
          console.error("Sign Up error:", error);
        }
      } else {
        return toast.error("All fields are mandatory to fill");
      }
    }
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12 text-center">
          <div className="text-center heading py-2">
            {!signUp ? "Sign-In" : "Sign-Up"}
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row" onSubmit={handleAuth}>
              {signUp && (
                <>
                  <div className="col-12 py-3">
                    <input
                      type="text"
                      className="form-control input-text-box"
                      placeholder="Username"
                      name="userName"
                      value={userName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 py-3">
                    <p className="role">Do you wish to be a publisher?</p>
                    <div className="form-check-inline mx-2">
                      <input
                        type="radio"
                        className="form-check-input"
                        value="publisher"
                        name="radioOption"
                        checked={role === "publisher"}
                        onChange={handlerole}
                      />
                      <label htmlFor="radioOption" className="form-check-label">
                        Yes&nbsp;
                      </label>
                      <input
                        type="radio"
                        className="form-check-input"
                        value="normal"
                        name="radioOption"
                        checked={role === "consumer"}
                        onChange={handlerole}
                      />
                      <label htmlFor="radioOption" className="form-check-label">
                        No
                      </label>
                    </div>
                  </div>
                </>
              )}
              <div className="col-12 py-3">
                <input
                  type="email"
                  className="form-control input-text-box"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <input
                  type="password"
                  className="form-control input-text-box"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </div>
              {signUp && (
                <div className="col-12 py-3">
                  <input
                    type="password"
                    className="form-control input-text-box"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="col-12 py-3 text-center">
                <button
                  className={`btn ${!signUp ? "btn-sign-in" : "btn-sign-up"}`}
                  type="submit"
                  disabled={isDisabled}
                >
                  {!signUp ? signInText : signUpText}
                </button>
              </div>
            </form>
            <div>
              {!signUp ? (
                <>
                  <div className="text-center justify-content-center mt-2 pt-2">
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      Don't have an account ?&nbsp;
                      <span
                        className="link-danger"
                        style={{ textDecoration: "none", cursor: "pointer" }}
                        onClick={() => setSignUp(true)}
                      >
                        Sign Up
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center justify-content-center mt-2 pt-2">
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      Already have an account ?&nbsp;
                      <span
                        style={{
                          textDecoration: "none",
                          cursor: "pointer",
                          color: "#003566",
                        }}
                        onClick={() => setSignUp(false)}
                      >
                        Sign In
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
