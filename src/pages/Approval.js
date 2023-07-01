import { collection, getDocs, query, where } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import UserCard from "../components/UserCard";

const Approval = ({ setActive }) => {
  const [loading, setLoading] = useState(false);
  const [Datas, setDatas] = useState([]);

  useEffect(() => {
    const getDatasData = async () => {
      setLoading(true);
      const DataRef = collection(db, "users");
      const first = query(
        DataRef,
        where("approved", "==", false),
        where("role", "==", "publisher")
      );
      const docSnapshot = await getDocs(first);
      setDatas(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    getDatasData();
    setActive("approval");
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="col-12">
        <div className="text-center heading py-2">Approvals</div>
      </div>
      <div className="col-md-12 text-left justify-content-center">
        <div className="row gx-5">
          {Datas.length === 0 && (
            <h5 className="text-center">
              There are no users needing approvals right now. New approval
              requests will appear here
            </h5>
          )}
          {Datas?.map((item) => (
            <UserCard {...item} name={item.username} id={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Approval;
