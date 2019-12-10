import React from "react";
import "./index.css";
import Stage from "./stage";
import Deck from "./deck";
import Docs from "./docs";
import { Helmet } from "react-helmet";

const card = "https://codesurfer.pomb.us/card.png";

function App() {
  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Code Surfer - Rad Code Slides</title>
        <meta name="og:title" content="Code Surfer - Rad Code Slides" />
        <meta
          name="description"
          content="Code Surfer adds code highlighting, code zooming, code scrolling, code focusing, code morphing, and fun to MDX Deck slides."
        />
        <meta name="image" content={card} />
        <meta property="og:image" content={card} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@pomber" />
      </Helmet>
      <Stage deck={<Deck />}>
        <Docs />
      </Stage>
    </React.Fragment>
  );
}

export default App;
