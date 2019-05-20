import React from "react";
import { useContainerStyle, usePreStyle, useTokenStyles } from "./theming";

function CodeSurferFrame({
  frame,
  dimensions,
  scrollTop = 0,
  scale = 1,
  verticalOrigin = 0
}) {
  const ref = React.useRef();

  React.useLayoutEffect(() => {
    ref.current.scrollTop = scrollTop;
  }, [scrollTop]);

  console.log("scrollTop", scrollTop);
  return (
    <div
      className="cs-container"
      style={{
        ...useContainerStyle(),
        width: "100%",
        height: dimensions ? dimensions.containerHeight : "100%",
        maxHeight: "100%",
        position: "relative"
      }}
    >
      <pre
        className="cs-content"
        ref={ref}
        style={{
          ...usePreStyle(),
          margin: 0,
          height: "100%",
          overflowY: "hidden",
          overflowX: "hidden",
          padding:
            dimensions &&
            `0 ${(dimensions.containerWidth - dimensions.contentWidth) / 2}px`
        }}
      >
        <div
          className="cs-scaled-content"
          style={{
            height: dimensions ? dimensions.contentHeight : "100%",
            transform: `scale(${scale})`,
            transformOrigin: `center ${verticalOrigin}px`
          }}
        >
          <div
            style={{ height: dimensions && dimensions.containerHeight / 2 }}
          />
          {frame.lines.map(line => (
            <Line {...line} />
          ))}
          <div
            style={{ height: dimensions && dimensions.containerHeight / 2 }}
          />
        </div>
      </pre>
      {frame.title && (
        <h4
          className="cs-title"
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            margin: 0,
            padding: "1em 0",
            background: "rgba(190,20,20,0.4)"
          }}
        >
          {frame.title}
        </h4>
      )}
      {frame.subtitle && (
        <h4
          className="cs-subtitle"
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            margin: 0,
            padding: "0.5em 0",
            background: "rgba(190,20,20,0.4)"
          }}
        >
          {frame.subtitle}
        </h4>
      )}
    </div>
  );
}

function Line({ style, tokens }) {
  const getStyleForToken = useTokenStyles();
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div style={{ display: "inline-block" }} className="cs-line">
        {tokens.map((token, i) => (
          <span key={i} style={getStyleForToken(token)}>
            {token.content}
          </span>
        ))}
      </div>
    </div>
  );
}

export default CodeSurferFrame;
