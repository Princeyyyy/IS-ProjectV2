import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import emailjs from "emailjs-com";

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

          if (role === "recruiter") {
            const templateParams = {
              name: fullName,
              email: email,
              message:
                "I hope this message finds you well. We wanted to personally extend our gratitude for signing up to use our platform for your job postings. We appreciate your interest and trust in our services. We would like to inform you that your account is currently under review as part of our verification process. This process is in place to ensure the quality and authenticity of job postings on our platform. Please rest assured that we are working diligently to review your account, and you can expect this process to be completed within the next 2-3 business days. Once your account has been successfully reviewed and verified, you will be able to start posting jobs and utilizing all the features our platform has to offer. We are excited to have you on board and look forward to supporting your recruitment efforts. If you have any questions, need assistance, or want to share your success stories, don't hesitate to reach out to us. Our team is here to ensure that your experience on our platform is nothing short of exceptional. Thank you once again for choosing our platform, and we can't wait to see the positive impact your job postings will make.",
            };

            emailjs
              .send(
                "service_8lbs1m7",
                "template_yl5f2ag",
                templateParams,
                "7U8CVNeb53dTolad0"
              )
              .then(
                function (response) {
                  console.log("SUCCESS!", response.status, response.text);
                },
                function (error) {
                  console.log("FAILED...", error);
                }
              );
          } else {
            const templateParams = {
              name: fullName,
              email: email,
              message:
                "Welcome aboard to our platform! We're thrilled to have you join our community of motivated job seekers and career enthusiasts. Your decision to become a part of our platform reflects your dedication to advancing your career and personal growth, and we're here to support you every step of the way. As you embark on your journey with us, we want you to know that our platform is designed to empower you with opportunities and resources to enhance your skills and expand your horizons. Whether you're searching for your dream job, aiming to upskill, or exploring new career avenues, our platform is your ally in achieving your goals. In addition to job listings, we offer a wealth of development materials, including tutorials, articles, webinars, and more, all curated to help you sharpen your skills and stay ahead in today's dynamic job market. Feel free to explore these resources and make the most of your time on our platform. Your journey has just begun, and we can't wait to witness your achievements and growth. If you have any questions, need assistance, or want to share your success stories, don't hesitate to reach out to us. Our team is here to ensure that your experience on our platform is nothing short of exceptional. Thank you for entrusting us with a part of your career journey. Let's embark on this exciting path together and turn your dreams into reality.",
            };

            emailjs
              .send(
                "service_8lbs1m7",
                "template_yl5f2ag",
                templateParams,
                "7U8CVNeb53dTolad0"
              )
              .then(
                function (response) {
                  console.log("SUCCESS!", response.status, response.text);
                },
                function (error) {
                  console.log("FAILED...", error);
                }
              );
          }

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
