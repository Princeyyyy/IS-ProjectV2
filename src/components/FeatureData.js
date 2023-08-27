import React from "react";
import { Link } from "react-router-dom";

const FeatureDatas = ({ Datas, title }) => {
  return (
    <div>
      <div className="Data-heading text-start pt-3 py-2 mb-4">{title}</div>
      {Datas?.map((item) => (
        <Link
          to={`/detail/${item.id}`}
          key={item.id}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="row pb-3" style={{ cursor: "pointer" }}>
            <div className="col-lg-6 col-md-8 align-self-center">
              <img
                src="/images/image.jpg"
                alt={item.title}
                className="most-popular-img"
                style={{
                  borderRadius: "10px",
                }}
              />
            </div>
            <div className="col-lg-6 col-md-4 padding">
              <div className="text-start most-popular-font">{item.title}</div>
              <div className="text-start most-popular-font-meta">
                <strong>Posted on :</strong>{" "}
                {item.timestamp.toDate().toDateString()}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FeatureDatas;
