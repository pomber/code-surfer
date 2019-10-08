import React from "react";
import logo from "./logo.small.svg";
import { Helmet } from "react-helmet";
import "./index.css";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "#0D0543"
      }}
    >
      <Helmet>
        <title>Code Surfer: Rad Code Slides</title>
      </Helmet>
      <img
        src={logo}
        alt="Code Surfer Logo"
        style={{
          width: "50%",
          maxWidth: "300px",
          minWidth: "240px",
          height: "auto"
        }}
      />
      <h2 style={{ marginTop: 0 }}>Rad Code Slides</h2>
      <pre
        style={{
          background: "#0D0543",
          color: "#fafafa",
          padding: "15px",
          borderRadius: "6px",
          width: "90%",
          maxWidth: "400px"
        }}
      >
        <code>{`npm init code-surfer-deck my-deck
cd my-deck
npm start`}</code>
      </pre>
      <p style={{ width: "90%", maxWidth: "400px" }}>
        This site is a work in progress, here are the provisional{" "}
        <a href="https://github.com/pomber/code-surfer/blob/code-surfer-v2/readme.md">
          docs for Code Surfer v3.0.0-beta.1
        </a>
      </p>
    </div>
  );
}
