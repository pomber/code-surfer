import React from "react";
import img from "./surfer.jpg";

export default ({ style }) => {
  return (
    <div>
      <img
        src={img}
        alt="surfer"
        style={{
          height: "400px",
          borderRadius: "10px",
          transition: "0.8s",
          ...style
        }}
      ></img>
      {credit}
    </div>
  );
};

const credit = (
  <div style={{ fontSize: "12px", textAlign: "center" }}>
    Photo by
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://unsplash.com/@bady?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    >
      {" "}
      bady qb
    </a>{" "}
    on Unsplash
  </div>
);
