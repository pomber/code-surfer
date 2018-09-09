import React from "react";
import { Link } from "gatsby";

import gif from "./../images/sample.gif";

const IndexPage = ({ fixtures }) => (
  <div
    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
  >
    <img src={gif} alt="code surfer" style={{ maxHeight: "60vh" }} />
    <h1
      style={{
        fontFamily: `"Merriweather Sans",sans-serif`,
        fontSize: "36px",
        color: "#222"
      }}
    >
      Code Surfer {`<🏄 />`}
    </h1>
    <ul>
      <li>
        <Link to="/react-docs/">Use it with React</Link>
      </li>
      <li>
        <Link to="/sample/">Use it with mdx-deck</Link>
      </li>
    </ul>
    <footer>
      <a href="https://github.com/pomber/code-surfer">GitHub</a>
    </footer>
  </div>
);

export default () => (
  <IndexPage fixtures={["react-docs", "sample", "storybook", "theming"]} />
);
