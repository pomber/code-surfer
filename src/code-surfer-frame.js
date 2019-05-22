import React from "react";
import { useContainerStyle, usePreStyle, useTokenStyles } from "./theming";
import { useTheme } from "./use-theme";

function CodeSurferContainer({
  frame,
  dimensions,
  scale,
  verticalOrigin,
  scrollTop,
  t
}) {
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
      <CodeSurferContent
        dimensions={dimensions}
        scale={scale}
        verticalOrigin={verticalOrigin}
        frame={frame}
        scrollTop={scrollTop}
      />
      {frame.title && <Title text={frame.title} t={t} />}
      {frame.subtitle && <Subitle text={frame.subtitle} t={t} />}
    </div>
  );
}

function CodeSurferContent({
  dimensions,
  scale,
  verticalOrigin,
  frame,
  scrollTop
}) {
  const ref = React.useRef();

  React.useLayoutEffect(() => {
    ref.current.scrollTop = scrollTop;
  }, [scrollTop]);

  return (
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
        <div style={{ height: dimensions && dimensions.containerHeight / 2 }} />
        {frame.lines.map(line => (
          <Line {...line} />
        ))}
        <div style={{ height: dimensions && dimensions.containerHeight / 2 }} />
      </div>
    </pre>
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

function Title({ text, t }) {
  let o;
  // if (t && t < 0.5 && prev) {
  //   o = (t - 0.25) * 4;
  // } else if (t && t >= 0.5 && next) {
  //   o = (0.75 - t) * 4;
  // }
  return (
    <h4
      className="cs-title"
      style={{
        ...useTheme().codeSurfer.title,
        position: "absolute",
        top: 0,
        width: "100%",
        margin: 0,
        padding: "1em 0"
      }}
    >
      <span style={{ opacity: o }}>{text}</span>
    </h4>
  );
}
function Subitle({ text, t }) {
  let o;
  // if (t && t < 0.5 && prev) {
  //   o = (t - 0.25) * 4;
  // } else if (t && t >= 0.5 && next) {
  //   o = (0.75 - t) * 4;
  // }
  return (
    <p
      className="cs-subtitle"
      style={{
        position: "absolute",
        bottom: 0,
        width: "calc(100% - 2em)",
        boxSizing: "border-box",
        margin: "0.3em 1em",
        padding: "0.5em",
        background: "rgba(2,2,2,0.9)"
      }}
    >
      <span
        style={{
          opacity: o
        }}
      >
        {text}
      </span>
    </p>
  );
}

export default CodeSurferContainer;
