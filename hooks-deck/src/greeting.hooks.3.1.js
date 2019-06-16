import React, { useState, useContext } from "react";
import Row from "./row";
import { ThemeContext, LocaleContext } from "./context";

export default function Greeting(props) {
  const [name, setName] = useState("Mary");
  const [surname, setSurname] = useState("Poppins");

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleSurnameChange(e) {
    setSurname(e.target.value);
  }

  return (
    <section>
      <Row label="Name">
        <input value={name} onChange={handleNameChange} />
      </Row>
      <Row label="Surname">
        <input
          value={surname}
          onChange={handleSurnameChange}
        />
      </Row>
    </section>
  );
}
