import React from "react";
import CodeSurfer from "code-surfer";
import prismTheme from "prism-react-renderer/themes/duotoneLight";

const code = `
const App = () => (
  <div style={{ height: 100 }}>
    <CodeSurfer code={code} />
  </div>
);

console.log();
`;

const App = () => (
  <div
    style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: prismTheme.plain.backgroundColor,
      border: `1px solid ${prismTheme.plain.color}`,
      borderRadius: "3px",
      boxSizing: "border-box"
    }}
  >
    <div style={{ flex: 1 }} />
    <CodeSurfer
      code={code}
      showNumbers
      step={{ lines: [2] }}
      theme={prismTheme}
    />
    <div style={{ flex: 1 }} />
    <div
      style={{
        padding: "10px",
        overflow: "hidden",
        font: `12px -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
        color: "#586069",
        backgroundColor: "#f7f7f7",
        borderTop: `1px solid ${prismTheme.plain.color}`,
        borderRadius: "0 0 2px 2px"
      }}
    >
      Foo
    </div>
  </div>
);

export default App;
