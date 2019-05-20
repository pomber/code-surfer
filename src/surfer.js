import React from "react";
import { useTheme } from "./use-theme";

function Surfer({ container, content, focus }) {
  // const scrollTop = focus.start;
  return (
    <container.component>
      <content.component />
    </container.component>
  );
}

function App() {
  const container = (
    <div style={{ height: 50, width: 50, background: "red" }} />
  );
  const content = <section>Foo Section</section>;

  return (
    <Surfer
      container={{ component: "h1" }}
      content={{ component: () => "Foo" }}
    />
  );
}

function Bis() {
  const ref = React.useRef();
  const scale = 0.9;
  return (
    <pre ref={ref} style={{ border: "1px solid green" }}>
      <code
        style={{
          transform: `scale(${scale})`,
          display: "block"
        }}
      >
        <div>Foo</div>
        <div>Foo</div>
        <div>Foo</div>
        <div>Foo</div>
        <div>Foo</div>
      </code>
    </pre>
  );
}

export default Bis;
