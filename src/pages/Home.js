import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  orderBy,
  where,
  startAfter,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import DataSection from "../components/DataSection";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { toast } from "react-toastify";
import FeatureDatas from "../components/FeatureData";
import Search from "../components/Search";
import { useLocation } from "react-router-dom";
import Category from "../components/Category";
import Publisher from "../components/Publisher";

const initialState = {
  isAdmin: false,
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ setActive, user, active }) => {
  const spinnerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [Datas, setDatas] = useState([]);
  const [search, setSearch] = useState({
    text: null,
    category: null,
    tags: null,
  });
  const [lastVisible, setLastVisible] = useState(null);
  const [totalDatas, setTotalDatas] = useState(null);
  const [hide, setHide] = useState(false);
  const queryString = useQuery();
  //const searchQuery = queryString.get("searchQuery");
  const location = useLocation();
  const [isAdmin, setisAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    text: null,
    category: null,
    tags: null,
  });
  const [filters, setFilters] = useState({ text: "", category: "", tags: "" });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setSearch("");
    const unsub = onSnapshot(
      collection(db, "Jobs"),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get("tags"));
          list.push({ id: doc.id, ...doc.data() });
        });
        const uniqueTags = [...new Set(tags)];
        setTotalDatas(list);
        setLoading(false);
        setActive("home");
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [setActive, active]);

  useEffect(() => {
    getDatas();
    setHide(false);
  }, [active]);

  const getDatas = async () => {
    const DataRef = collection(db, "Jobs");
    console.log(DataRef);
    const firstFour = query(DataRef, orderBy("timestamp", "desc"), limit(4));
    const docSnapshot = await getDocs(firstFour);
    setDatas(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
  };

  console.log("Jobs", Datas);

  const updateState = (docSnapshot) => {
    const isCollectionEmpty = docSnapshot.size === 0;
    if (!isCollectionEmpty) {
      const DatasData = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDatas((Datas) => [...Datas, ...DatasData]);
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } else {
      toast.info("No more Jobs to display");
      setHide(true);
    }
  };

  const fetchMore = async () => {
    setLoading(true);
    const DataRef = collection(db, "Jobs");
    const nextFour = query(
      DataRef,
      orderBy("timestamp"),
      limit(4),
      startAfter(lastVisible)
    );
    const docSnapshot = await getDocs(nextFour);
    updateState(docSnapshot);
    setLoading(false);
  };

  const searchDatas = async () => {
    const DataRef = collection(db, "Jobs");
    let searchQueryRef;

    const conditions = [];

    if (filters.text) {
      conditions.push(where("title", "==", filters.text));
    }
    if (filters.category) {
      conditions.push(where("category", "==", filters.category));
    }
    if (filters.tags) {
      conditions.push(where("tags", "array-contains", filters.tags));
    }

    searchQueryRef = query(DataRef, ...conditions);
    const searchSnapshot = await getDocs(searchQueryRef);

    let searchData = [];
    searchSnapshot.forEach((doc) => {
      searchData.push({ id: doc.id, ...doc.data() });
    });

    setDatas(searchData);
    setHide(true);
  };

  useEffect(() => {
    if (filters.text || filters.category || filters.tags) {
      searchDatas();
    }
  }, [filters]);

  if (loading) {
    return (
      <div className="centered-spinner-container" style={spinnerStyle}>
        {loading && <Spinner />}
        {/* Your other content */}
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure wanted to delete that Job Posting ?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "Jobs", id));
        toast.success("Posting deleted successfully");
        setLoading(false);

        setTimeout(() => {
          window.location.reload(false);
        }, 3000);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // category count
  const counts = totalDatas.reduce((prevValue, currentValue) => {
    let name = currentValue.category;
    if (!prevValue.hasOwnProperty(name)) {
      prevValue[name] = 0;
    }
    prevValue[name]++;
    return prevValue;
  }, {});

  const categoryCount = Object.keys(counts).map((k) => {
    return {
      category: k,
      count: counts[k],
    };
  });

  console.log("categoryCount", categoryCount);

  // recruiter count
  const totals = totalDatas.reduce((prevValue, currentValue) => {
    let name = currentValue.author;

    if (!prevValue.hasOwnProperty(name)) {
      prevValue[name] = 0;
    }

    prevValue[name]++;
    return prevValue;
  }, {});

  const recruiterCount = Object.keys(totals).map((k) => {
    return {
      author: k,
      count: totals[k],
    };
  });

  console.log("recruiterCount", recruiterCount);

  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <div className="row mx-0" style={{ textAlign: "center" }}>
          <Search
            filters={filters}
            handleChange={handleChange}
            categories={categories}
            setCategories={setCategories}
            db={db}
          />
          <div style={{ paddingTop: "30px" }} className="col-md-8">
            <div className="Data-heading text-start py-2 mb-4 text-center heading py-2">
              Jobs
            </div>
            {Datas.length === 0 && location.pathname !== "/" && (
              <>
                <h4>
                  No Jobs found with search keyword:{" "}
                  <strong>{searchQuery}</strong>
                </h4>
              </>
            )}
            {Datas?.map((Data) => (
              <DataSection
                key={Data.id}
                user={user}
                handleDelete={handleDelete}
                {...Data}
                adminStatus={isAdmin}
                tags={Data.tags}
              />
            ))}

            {!hide && (
              <button className="btn btn-primary" onClick={fetchMore}>
                Load More
              </button>
            )}
          </div>
          <div className="col-md-3" style={{ paddingTop: "30px" }}>
            <Category catgDatasCount={categoryCount} />
            <Publisher pubDataCount={recruiterCount} />
            <FeatureDatas title={"Most Popular"} Datas={Datas} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
