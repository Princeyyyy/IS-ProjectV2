import React from "react";
import { Link } from "react-router-dom";

const Category = ({ catgDatasCount }) => {
  return (
    <div className="widget">
      <div className="Data-heading text-start py-2 mb-4">Category</div>
      <div className="link-widget">
        <ul>
          {catgDatasCount?.map((item, index) => (
            <li key={index}>
              <Link
                to={`/category/${item.category}`}
                style={{ textDecoration: "none", float: "left", color: "#001D3D" }}
              >
                {item.category}
                <span>({item.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
