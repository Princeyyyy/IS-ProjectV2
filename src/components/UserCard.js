import React from "react";
import { db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";

const UserCard = ({ name, id }) => {
  const approveButtonStyle = {
    borderRadius: "20px",
    backgroundColor: "#00FF00",
    color: "#000000",
    padding: "10px 20px",
    marginRight: "20px",
    border: "none",
    fontWeight: "bold",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const handleApprove = async (isApproved) => {
    if (isApproved) {
      const userDocRef = doc(db, "users", id);
      const userDocSnapshot = await getDoc(userDocRef);
      const email = userDocSnapshot.data().email;
      const fullName = userDocSnapshot.data().fullName;

      console.log("Account has been approved.");

      updateDoc(doc(db, "users", id), {
        approved: isApproved,
      });

      toast.success("User has been approved!");

      const templateParams = {
        name: fullName,
        email: email,
        message:
          "We are pleased to inform you that your account on our platform has been successfully approved! You now have full access to all the features and functionalities that our platform offers. Feel free to start posting jobs, connecting with potential candidates, and utilizing our platform's tools to streamline your recruitment process. We are excited to have you as part of our community and look forward to the opportunities and partnerships that lie ahead. Should you have any questions or require assistance as you navigate our platform, please do not hesitate to reach out to our support team. Your success is important to us, and we are here to provide any help you may need. Thank you for choosing our platform for your recruiting needs. We're eager to see the positive impact you'll make through your job listings and interactions within our network.",
      };

      emailjs
        .send(
          "service_8lbs1m7",
          "template_lxltl3e",
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
      console.log("Account has been rejected.");

      updateDoc(doc(db, "users", id), {
        approved: isApproved,
      });

      toast.error("User has been rejected!");
    }

    setTimeout(() => {
      window.location.reload(false);
    }, 2200);
  };

  return (
    <div style={containerStyle} className="col-sm-2 col-lg-3 mb-5">
      <div className="related-content card text-decoration-none overflow-hidden h-100">
        <div className="related-body card-body p-4">
          <h5 className="title text-start py-2">{name}</h5>
          <div className="d-flex justify-content-between">
            <div>
              <button
                type="button"
                style={approveButtonStyle}
                onClick={() => handleApprove(true)}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
