import React from "react";
import Card from "./Card";

const RelatedData = ({ Datas, id }) => {
  return (
    <div>
      <div className="Datas-heading text-start pt-3 py-2 mb-4">
        Related Data
      </div>
      <div className="col-md-12 text-left justify-content-center">
        <div className="row gx-5">
          {Datas.length === 1 && (
            <h5 className="text-center">
              Related Data not found with this current Data
            </h5>
          )}
          {Datas
            ?.filter((Datas) => Datas.id !== id)
            .map((item) => (
              <Card {...item} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedData;
