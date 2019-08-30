import React, { useState } from "react";
import Row from "./Row";

export default function Greeting(props) {
  const [name, setName] = useState("Mary");

  function handleNameChange(e) {
    setName(e.target.value);
  }

  return (
    <section>
      <Row label="Name">
        <input value={name} onChange={handleNameChange} />
      </Row>
    </section>
  );
}
