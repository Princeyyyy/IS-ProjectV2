import React from "react";

const UpdateAccount = () => {
  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12 text-center">
          <div className="text-center heading py-2">
            {"Update Account Details"}
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row">
              <div className="col-12 py-3">
                <input
                  type="text"
                  className="form-control input-text-box"
                  placeholder="Full Name"
                  name="fullName"
                  //   value={fullName}
                  //   onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <p className="role">Do you want to be a recruiter?</p>
                <div className="form-check-inline mx-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="recruiter"
                    name="radioOption"
                    // checked={role === "recruiter"}
                    // onChange={handlerole}
                  />
                  <label htmlFor="radioOption" className="form-check-label">
                    &nbsp; Yes &nbsp;
                  </label>
                  <input
                    type="radio"
                    className="form-check-input"
                    value="recruitee"
                    name="radioOption"
                    // checked={role === "recruitee"}
                    // onChange={handlerole}
                  />
                  <label htmlFor="radioOption" className="form-check-label">
                    &nbsp; No &nbsp;
                  </label>
                </div>
              </div>
              <div className="col-12 py-3">
                <input
                  type="email"
                  className="form-control input-text-box"
                  placeholder="Email"
                  name="email"
                  //   value={email}
                  //   onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <input
                  type="tel"
                  className="form-control input-text-box"
                  placeholder="Phone Number"
                  name="number"
                  //   value={number}
                  //   onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3 text-center">
                <button
                  //   className={`btn ${!sign ? "btn-sign-in" : "btn-sign-up"}`}
                  type="submit"
                  //   disabled={isDisabled}
                >
                  {"Update Account Details"}
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
