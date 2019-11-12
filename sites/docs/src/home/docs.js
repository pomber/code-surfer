import React from "react";
import Readme from "./readme.mdx";
import { MDXRenderer } from "gatsby-plugin-mdx";

export default function Docs() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "800px", width: "90%" }}>
        <Readme />
      </div>
    </div>
  );
}
