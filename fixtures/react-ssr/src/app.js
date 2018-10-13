import React from "react";
import CodeSurfer from "code-surfer";
import prismTheme from "prism-react-renderer/themes/nightOwl";

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
      alignItems: "center",
      background: prismTheme.plain.backgroundColor
    }}
  >
    <CodeSurfer
      code={code}
      showNumbers
      step={{ lines: [2] }}
      theme={prismTheme}
    />
  </div>
);

export default App;
