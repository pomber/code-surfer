import React from "react";

const load = require.context("./", true, /greeting\..*js$/);

export default function GreetingLoader({
  version = "1.1",
  theme,
}) {
  const Greeting = load("./greeting." + version + ".js")
    .default;

  console.log(theme);
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          theme && theme.codeSurfer.code.background,
      }}
    >
      <Greeting name="Mary" />
    </div>
  );
}
