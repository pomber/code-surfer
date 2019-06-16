import React from "react";
import Row from "./row";

export default function Greeting(props) {
  const [name, setName] = ???

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
