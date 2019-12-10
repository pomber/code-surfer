import React, { useState } from "react";

export default () => {
  const [count, setCount] = useState(1);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button onClick={_ => setCount(c => c - 1)} style={{ fontSize: "1.5em" }}>
        Less
      </button>
      <h1 style={{ textAlign: "center" }}>{count}</h1>
      <button onClick={_ => setCount(c => c + 1)} style={{ fontSize: "1.5em" }}>
        More
      </button>
    </div>
  );
};
