import React from "react";

const infoText = (
  <div>
    To succeed in the 21st-century labor market, one needs a comprehensive skill
    set. To help you in your job seeking, we recommend you use the platform
    known as SkillUp by Simplilearn to improve your skills. SkillUp is a
    learning platform from Simplilearn where learners can take free online
    courses. All of the self-learning courses are free of cost, where you can
    explore and learn in-demand skills on your schedule. This free online course
    content is prepared by industry experts & top practitioners. As we at
    SkillConnect work to create our own courses, we still don't want to limit
    your potential. The following are some of the courses we believe are good to
    have and are a good place to start. There is variation in the courses to
    cater for a wide variety of people. Kindly you have an account with
    Simplilearn, which isn't difficult. This can be done by going to{" "}
    <a
      href="https://accounts.simplilearn.com/user/login?redirect_url=https%3A%2F%2Flms.simplilearn.com%2F"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#007bff", // Link color
        textDecoration: "none", // Remove default underline
        fontWeight: "bold", // Make the link bold
        cursor: "pointer", // Show a pointer cursor on hover
      }}
    >
      Simplilearn Login
    </a>
    .
  </div>
);

const heyText = "Hey All 👋";

const cardData = [
  { title: "Card 1", content: "Content for Card 1", buttonUrl: "/page1" },
  { title: "Card 2", content: "Content for Card 2", buttonUrl: "/page2" },
  { title: "Card 3", content: "Content for Card 3", buttonUrl: "/page3" },
  { title: "Card 4", content: "Content for Card 4", buttonUrl: "/page4" },
  { title: "Card 5", content: "Content for Card 5", buttonUrl: "/page5" },
  { title: "Card 6", content: "Content for Card 6", buttonUrl: "/page6" },
  { title: "Card 7", content: "Content for Card 7", buttonUrl: "/page7" },
  { title: "Card 8", content: "Content for Card 8", buttonUrl: "/page8" },
  { title: "Card 9", content: "Content for Card 9", buttonUrl: "/page9" },
  { title: "Card 10", content: "Content for Card 10", buttonUrl: "/page10" },
  { title: "Card 11", content: "Content for Card 11", buttonUrl: "/page11" },
  { title: "Card 12", content: "Content for Card 12", buttonUrl: "/page12" },
  { title: "Card 13", content: "Content for Card 13", buttonUrl: "/page13" },
  { title: "Card 14", content: "Content for Card 14", buttonUrl: "/page14" },
];

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
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  Card: {
    width: "14rem",
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

const SkillDevelopmentMaterials = () => {
  return (
    <div style={styles.SkillDevelopmentMaterials}>
      <p style={styles.HeyText}>{heyText}</p>
      <div style={styles.InfoText}>{infoText}</div>
      <div style={styles.CardContainer}>
        {cardData.map((card, index) => (
          <div key={index} style={styles.Card}>
            <h2>{card.title}</h2>
            <p style={styles.CardContent}>{card.content}</p>
            <div style={styles.ButtonContainer}>
              <a href={card.buttonUrl}>
                <button style={styles.Button}>Go to Page</button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillDevelopmentMaterials;
