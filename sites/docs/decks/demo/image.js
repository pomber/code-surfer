import React from "react";
import img from "./surfer.jpg";

export default ({ style }) => {
  return (
    <div
      style={{
        width: "70%",
        paddingLeft: "15%"
      }}
    >
      <img
        src={img}
        alt="surfer"
        style={{
          width: "100%",
          margin: "22% 0",
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
    Photo by{" "}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://unsplash.com/@bady?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
    >
      bady qb
    </a>{" "}
    on Unsplash
  </div>
);
