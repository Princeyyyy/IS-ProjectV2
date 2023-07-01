import React from "react";
import { Link } from "react-router-dom";

const Publisher = ({ pubDataCount }) => {
  return (
    <div className="widget">
      <div className="Data-heading text-start py-2 mb-4">Publishers</div>
      <div className="link-widget">
        <ul>
          {pubDataCount?.map((item, index) => (
            <li key={index}>
              <Link
                to={`/author/${item.author}`}
                style={{ textDecoration: "none", float: "left", color: "#001D3D" }}
              >
                {item.author}
                <span>({item.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Publisher;
