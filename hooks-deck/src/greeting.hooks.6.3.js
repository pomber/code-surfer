import React, {
  useState,
  useContext,
  useEffect,
} from "react";
import Row from "./row";
import { ThemeContext, LocaleContext } from "./context";

export default function Greeting(props) {
  const name = useFormInput("Mary");
  const surname = useFormInput("Poppins");
  const theme = useContext(ThemeContext);
  const locale = useContext(LocaleContext);
  const width = useWindowWidth();
  useDocumentTitle(name.value + " " + surname.value);

  return (
    <section className={theme}>
      <Row label="Name">
        <input {...name} />
      </Row>
      <Row label="Surname">
        <input {...surname} />
      </Row>
      <Row label="Language">{locale}</Row>
      <Row label="Width">{width}</Row>
    </section>
  );
}

function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  function handleChange(e) {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange,
  };
}

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  });
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  return width;
}
