import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

const initialState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "recruitee",
};

const Auth = ({ setActive, setUser, sign }) => {
  const [state, setState] = useState(initialState);

  const [signUpText, setsignUpText] = useState("Sign Up");
  const [signInText, setsignInText] = useState("Sign In");
  const [isDisabled, setIsDisabled] = useState(false);

  const { email, password, fullName, confirmPassword, role } = state;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handlerole = (e) => {
    setState({ ...state, role: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!sign) {
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
          toast.success("Welcome to SkillConnect");
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
      if (fullName && email && password) {
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
            fullName: fullName,
            email: email,
            role: role,
            approved: false,
          });

          setUser(user);
          setActive("home");

          //Navigate and toast
          toast.success("Welcome to SkillConnect");
          navigate("/");
        } catch (error) {
          // Catch and console log Firebase authentication errors
          setsignUpText("Sign Up");
          setIsDisabled(false);
          toast.error(error.message);
          console.error("Sign Up error:", error);
        }
      } else {
        return toast.error("All fields are mandatory to fill/check");
      }
    }
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12 text-center">
          <div className="text-center heading py-2">
            {!sign ? "Sign-In" : "Create an Account"}
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row" onSubmit={handleAuth}>
              {sign && (
                <>
                  <div className="col-12 py-3">
                    <input
                      type="text"
                      className="form-control input-text-box"
                      placeholder="Full Name"
                      name="fullName"
                      value={fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 py-3">
                    <p className="role">Are you a recruiter?</p>
                    <div className="form-check-inline mx-2">
                      <input
                        type="radio"
                        className="form-check-input"
                        value="recruiter"
                        name="radioOption"
                        checked={role === "recruiter"}
                        onChange={handlerole}
                      />
                      <label htmlFor="radioOption" className="form-check-label">
                        Yes&nbsp;
                      </label>
                      <input
                        type="radio"
                        className="form-check-input"
                        value="recruitee"
                        name="radioOption"
                        checked={role === "recruitee"}
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
              {sign && (
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
                  className={`btn ${!sign ? "btn-sign-in" : "btn-sign-up"}`}
                  type="submit"
                  disabled={isDisabled}
                >
                  {!sign ? signInText : signUpText}
                </button>
              </div>
            </form>
            <div>
              {!sign ? (
                <>
                  <div className="text-center justify-content-center mt-2 pt-2">
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      Don't have an account ?&nbsp;
                      <span
                        className="link-danger"
                        style={{
                          textDecoration: "none",
                          cursor: "pointer",
                          color: "#ff5722",
                        }}
                        onClick={() => {
                          setActive("signup");
                          navigate("/signup");
                        }}
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
                          color: "#0068ca",
                        }}
                        onClick={() => {
                          setActive("login");
                          navigate("/login");
                        }}
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
