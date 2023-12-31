import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  orderBy,
  where,
} from "firebase/firestore";
import { isEmpty } from "lodash";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CommentBox from "../components/CommentBox";
import Like from "../components/Like";
import FeatureData from "../components/FeatureData";
import RelatedData from "../components/RelatedData";
import UserComments from "../components/UserComments";
import { db } from "../firebase";
import Spinner from "../components/Spinner";

const Detail = ({ setActive, user }) => {
  const spinnerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const userId = user?.uid;
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState(null);
  const [Datas, setDatas] = useState([]);
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);
  let [likes, setLikes] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [RelatedDatas, setRelatedDatas] = useState([]);
  const [isAvailable, setisAvailable] = useState(false);

  useEffect(() => {
    const getRecentDatas = async () => {
      const DataRef = collection(db, "Jobs");
      const recentDatas = query(
        DataRef,
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const docSnapshot = await getDocs(recentDatas);
      setDatas(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    getRecentDatas();
  }, []);

  useEffect(() => {
    id && getDataDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="centered-spinner-container" style={spinnerStyle}>
        {loading && <Spinner />}
      </div>
    );
  }

  const getDataDetail = async () => {
    setLoading(true);
    const DataRef = collection(db, "Jobs");
    const docRef = doc(db, "Jobs", id);
    const DataDetail = await getDoc(docRef);
    const Datas = await getDocs(DataRef);
    let tags = [];
    Datas.docs.map((doc) => tags.push(...doc.get("tags")));
    let uniqueTags = [...new Set(tags)];
    setTags(uniqueTags);
    setData(DataDetail.data());
    const RelatedDatasQuery = query(
      DataRef,
      where("tags", "array-contains-any", DataDetail.data().tags, limit(3))
    );
    setComments(DataDetail.data().comments ? DataDetail.data().comments : []);
    setLikes(DataDetail.data().likes ? DataDetail.data().likes : []);
    const RelatedDataSnapshot = await getDocs(RelatedDatasQuery);
    const RelatedDatas = [];
    RelatedDataSnapshot.forEach((doc) => {
      RelatedDatas.push({ id: doc.id, ...doc.data() });
    });
    setRelatedDatas(RelatedDatas);

    setisAvailable(Data?.isAvailable === "true");

    setActive(null);
    setLoading(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (userComment.trim().length === 0) {
      toast.error("Enter comment before attempting to post");
    } else {
      comments.push({
        createdAt: Timestamp.fromDate(new Date()),
        userId,
        name: user?.displayName,
        body: userComment,
      });

      await updateDoc(doc(db, "Jobs", id), {
        ...Data,
        comments,
        timestamp: serverTimestamp(),
      });
      setComments(comments);
      setUserComment("");

      toast.success("Comment posted successfully");
    }
  };

  const handleLike = async () => {
    if (userId) {
      if (Data?.likes) {
        const index = likes.findIndex((id) => id === userId);
        if (index === -1) {
          likes.push(userId);
          setLikes([...new Set(likes)]);
        } else {
          likes = likes.filter((id) => id !== userId);
          setLikes(likes);
        }
      }
      await updateDoc(doc(db, "Jobs", id), {
        ...Data,
        likes,
        timestamp: serverTimestamp(),
      });
    }
  };

  console.log("RelatedDatas", RelatedDatas);
  return (
    <div className="single">
      <div
        className="Data-title-box"
        style={{
          backgroundImage: `url('/images/image.jpg')`, // Use the imported image
          backgroundSize: "cover", // Adjust as needed
          backgroundRepeat: "no-repeat", // Adjust as needed
          backgroundPosition: "center", // Adjust as needed
        }}
      >
        <div className="overlay"></div>
        <div
          className="Data-title"
          style={{
            color: "white",
          }}
        >
          <span
            style={{
              color: "white",
            }}
          >
            {Data?.timestamp.toDate().toDateString()}
          </span>
          <h2
            style={{
              color: "white",
            }}
          >
            {Data?.title}
          </h2>
        </div>
      </div>
      <div className="container-fluid pb-4 pt-4 padding Data-single-content">
        <div className="container padding">
          <div className="row mx-0">
            <div className="col-md-8">
              <span className="meta-info text-start">
                Posted By <p className="author">{Data?.author}</p> on&nbsp;
                {Data?.timestamp.toDate().toDateString()}
                <Like
                  handleLike={handleLike}
                  likes={likes}
                  userId={userId}
                  downloadUrl={Data?.documentUrl}
                  fileName={Data?.filename}
                />
              </span>
              <br />
              <p className="text-start">
                <strong>
                  Is Job Available?{" "}
                  {String(Data?.isAvailable) === "true" ? "Yes" : "No"}
                </strong>
              </p>

              <p className="text-start">{Data?.description}</p>
              <br />
              <div className="custombox">
                <div className="scroll">
                  <h4 className="small-title">{comments?.length} Comment</h4>
                  {isEmpty(comments) ? (
                    <UserComments
                      msg={
                        "No Comment yet posted on this Job. Be the first to comment"
                      }
                    />
                  ) : (
                    <>
                      {comments?.map((comment) => (
                        <UserComments {...comment} />
                      ))}
                    </>
                  )}
                </div>
              </div>
              <CommentBox
                userId={userId}
                userComment={userComment}
                setUserComment={setUserComment}
                handleComment={handleComment}
              />
            </div>
            <div className="col-md-3">
              <FeatureData title={"Recent Jobs"} Datas={Datas} />
            </div>
          </div>
          <RelatedData id={id} Datas={RelatedDatas} />
        </div>
      </div>
    </div>
  );
};

export default Detail;
