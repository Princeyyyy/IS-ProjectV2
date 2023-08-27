import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const infoText = (
  <div>
    To succeed in the 21st-century labor market, one needs a comprehensive skill
    set. To help you in your job seeking, we recommend you use the platform
    known as Alison to improve your skills. Alison is a learning platform where
    learners can take free online courses. All of the self-learning courses are
    free of cost, where you can explore and learn in-demand skills on your
    schedule. This free online course content is prepared by industry experts &
    top practitioners. As we at SkillConnect work to create our own courses, we
    still don't want to limit your potential. The following are some of the
    courses we believe are good to have and are a good place to start. There is
    variation in the courses to cater for a wide variety of people. Kindly
    ensure you have an account with Alison, which isn't difficult. This can be
    done by going to{" "}
    <a
      href="https://alison.com/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#007bff", // Link color
        textDecoration: "none", // Remove default underline
        fontWeight: "bold", // Make the link bold
        cursor: "pointer", // Show a pointer cursor on hover
      }}
    >
      Alison
    </a>
    . Once you are there click sign upif you don't have an account or Log in if
    you have one.
  </div>
);

const heyText = "Hey All 👋";

const styles = {
  SkillDevelopmentMaterials: {
    textAlign: "center",
    padding: "20px",
  },

  HeyText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "20px",
  },

  InfoText: {
    fontStyle: "italic",
    fontSize: "16px",
    textAlign: "center",
  },

  CardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // Three columns with equal width
    gap: "20px",
    marginTop: "20px",
  },

  Card: {
    width: "calc(95% - 20px)",
    padding: "1rem",
    border: "1px solid #ccc",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
  },

  CardContent: {
    marginBottom: "1rem",
  },

  ButtonContainer: {
    marginTop: "auto",
    display: "flex",
    justifyContent: "flex-end",
  },

  Button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

const SkillDevelopmentMaterials = ({ setActive }) => {
  const spinnerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const [loading, setLoading] = useState(false);
  const [Datas, setDatas] = useState([]);

  const getDatasData = async () => {
    setLoading(true);
    const DataRef = collection(db, "Materials");
    const first = query(DataRef, orderBy("title"));
    const docSnapshot = await getDocs(first);
    setDatas(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    getDatasData();
    setActive("skillmaterial");
  }, []);

  if (loading) {
    return (
      <div className="centered-spinner-container" style={spinnerStyle}>
        {loading && <Spinner />}
        {/* Your other content */}
      </div>
    );
  }

  return (
    <div style={styles.SkillDevelopmentMaterials}>
      <p style={styles.HeyText}>{heyText}</p>
      <div style={styles.InfoText}>{infoText}</div>
      <div style={styles.CardContainer}>
        {Datas.map((card, index) => (
          <div key={index} style={styles.Card}>
            <h2>{card.title}</h2>
            <p style={styles.CardContent}>{card.content}</p>
            <div style={styles.ButtonContainer}>
              <a
                href={card.buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button style={styles.Button}>Go to Course Page</button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillDevelopmentMaterials;
