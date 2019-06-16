import React from "react";
import Row from "./row";

export default function Greeting(props) {
  return (
    <section>
      <Row label="Name">{props.name}</Row>
    </section>
  );
}
