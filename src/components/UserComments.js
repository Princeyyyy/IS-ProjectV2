import React from "react";

const UserComments = ({ name, body, createdAt, msg }) => {
  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="comments-list">
            <div className="media">
              {msg ? (
                <h4 className="mt-5">{msg}</h4>
              ) : (
                <>
                  <div className="media-left">
                    <img
                      src="/images/profile.png"
                      alt="user"
                      className="rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginTop: "6px",
                      }}
                    />
                  </div>
                  <div className="media-body">
                    <h3 className="text-start media-heading user_name">
                      {name} <small>{createdAt.toDate().toDateString()}</small>
                    </h3>
                    <p className="text-start">{body}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComments;
