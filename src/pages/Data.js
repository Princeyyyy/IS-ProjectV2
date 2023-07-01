import {
  collection,
  endAt,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import DataSection from "../components/DataSection";
import Pagination from "../components/Pagination";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { isEmpty, isNull } from "lodash";

const Datas = ({ setActive }) => {
  const [loading, setLoading] = useState(false);
  const [Datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const [noOfPages, setNoOfPages] = useState(null);
  const [count, setCount] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [hide, setHide] = useState(false);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getDatasData();
    getTotalDatas();
    setActive("Datas");
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const getDatasData = async () => {
    setLoading(true);
    const DataRef = collection(db, "Datas");
    const first = query(DataRef, orderBy("title"), limit(6));
    const docSnapshot = await getDocs(first);
    setDatas(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setCount(docSnapshot.size);
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    setLoading(false);
  };

  const getTotalDatas = async () => {
    const DataRef = collection(db, "Datas");
    const docSnapshot = await getDocs(DataRef);
    const totalDatas = docSnapshot.size;
    const totalPage = Math.ceil(totalDatas / 4);
    setNoOfPages(totalPage);
    setTotalCount(totalDatas);
  };

  const fetchMore = async () => {
    setLoading(true);
    const DataRef = collection(db, "Datas");
    const nextDatasQuery = query(
      DataRef,
      orderBy("title"),
      startAfter(lastVisible),
      limit(6)
    );
    const nextDatasSnaphot = await getDocs(nextDatasQuery);
    setDatas(
      nextDatasSnaphot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
    setCount(nextDatasSnaphot.size);
    setLastVisible(nextDatasSnaphot.docs[nextDatasSnaphot.docs.length - 1]);
    setLoading(false);
  };

  const fetchPrev = async () => {
    setLoading(true);
    const DataRef = collection(db, "Datas");
    const end =
      noOfPages !== currentPage ? endAt(lastVisible) : endBefore(lastVisible);
    const limitData =
      noOfPages !== currentPage
        ? limit(6)
        : count <= 4 && noOfPages % 2 === 0
        ? limit(6)
        : limitToLast(6);
    const prevDatasQuery = query(DataRef, orderBy("title"), end, limitData);
    const prevDatasSnaphot = await getDocs(prevDatasQuery);
    setDatas(
      prevDatasSnaphot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
    setCount(prevDatasSnaphot.size);
    setLastVisible(prevDatasSnaphot.docs[prevDatasSnaphot.docs.length - 1]);
    setLoading(false);
  };

  const handlePageChange = (value) => {
    if (value === "Next") {
      setCurrentPage((page) => page + 1);
      fetchMore();
    } else if (value === "Prev") {
      setCurrentPage((page) => page - 1);
      fetchPrev();
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (isEmpty(value)) {
      console.log("test");
      getDatasData();
      setHide(false);
    }
    setSearch(value);
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div
            style={{ fontWeight: "bold" }}
            className="Data-heading text-center py-2 mb-4"
          >
            Data: {totalCount} datasets
          </div>
          {Datas?.map((Data) => (
            <div className="col-md-6" key={Data.id}>
              <DataSection {...Data} />
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          noOfPages={noOfPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Datas;
