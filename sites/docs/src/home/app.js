import React from "react";
import "./index.css";
import Stage from "./stage";
import Deck from "./deck";
import Docs from "./docs";

function App() {
  return (
    <Stage deck={<Deck />}>
      <Docs />
    </Stage>
  );
}

export default App;
