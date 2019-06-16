import React from "react";
import Row from "./row";

export default function Greeting(props) {
  const name = ???

  return (
    <section>
      <Row label="Name">
        <input value={name} />
      </Row>
    </section>
  );
}
