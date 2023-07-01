import React, { useEffect } from "react";
import { Tooltip } from "bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";


const Like = ({ handleLike, likes, userId, downloadUrl, fileName }) => {
  useEffect(() => {
    let tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    let tootipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });
  }, []);

  const LikeStatus = () => {
    if (likes?.length > 0) {
      return likes.find((id) => id === userId) ? (
        <>
          <i className="bi bi-hand-thumbs-up-fill" />
          &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </>
      ) : (
        <>
          <i className="bi bi-hand-thumbs-up" />
          &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }
    return (
      <>
        <i className="bi bi-hand-thumbs-up" />
        &nbsp;Like
      </>
    );
  };

  return (
    <>
      <span
        style={{
          float: "right",
          cursor: "pointer",
          marginTop: "-10px",
          marginLeft: "10px",
        }}
      >
        <a
          href={downloadUrl}
          download
          style={{ textDecoration: "none", color: "#000814" }}
        >
          <button
            type="button"
            className="border border-gray-800 px-4 py-2 rounded uppercase"
          >
            <FontAwesomeIcon icon={faDownload} style={{paddingRight:'5px'}} /> {" "}
            <span style={{ color: "#FF5722" }}>{fileName}</span>
          </button>
        </a>
      </span>

      <span
        style={{ float: "right", cursor: "pointer", marginTop: "-7px" }}
        onClick={!userId ? null : handleLike}
      >
        {!userId ? (
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Please Login to like post"
          >
            <LikeStatus />
          </button>
        ) : (
          <button type="button" className="btn btn-primary">
            <LikeStatus />
          </button>
        )}
      </span>
    </>
  );
};

export default Like;
