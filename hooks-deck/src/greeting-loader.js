import React from "react";

const load = require.context("./", true, /greeting\..*js$/);

export default function GreetingLoader({
  version = "1.1",
}) {
  const Greeting = load("./greeting." + version + ".js")
    .default;
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Greeting name="Mary" />
    </div>
  );
}
