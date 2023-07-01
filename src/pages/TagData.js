import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DataSection from "../components/DataSection";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const TagData = ({setActive}) => {
  const [tagDatas, setTagDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { tag } = useParams();

  const getTagDatas = async () => {
    setLoading(true);
    const DataRef = collection(db, "Datas");
    const tagDataQuery = query(DataRef, where("tags", "array-contains", tag));
    const docSnapshot = await getDocs(tagDataQuery);
    let tagDatas = [];
    docSnapshot.forEach((doc) => {
      tagDatas.push({ id: doc.id, ...doc.data() });
    });
    setTagDatas(tagDatas);
    setLoading(false);
  };

  useEffect(() => {
    getTagDatas();
    setActive(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="Data-heading text-center py-2 mb-4">
            Tag: <strong>{tag.toLocaleUpperCase()}</strong>
          </div>
          {tagDatas?.map((item) => (
            <div className="col-md-6">
              <DataSection key={item.id} {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagData;
