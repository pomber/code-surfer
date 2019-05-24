import React from "react";
import {
  useContainerStyle,
  usePreStyle,
  useTokenStyles,
  useSubtitleStyle,
  useTitleStyle
} from "./theming";
import { runAnimation, scrollAnimation } from "./animation";

function CodeSurferContainer({ t, stepIndex, info }) {
  const { dimensions, steps } = info;
  const step = steps[stepIndex];
  const prev = steps[stepIndex - 1];
  const next = steps[stepIndex + 1];

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
        t={t}
        prev={prev}
        curr={step}
        next={next}
      />
      {step.title && (
        <Title
          t={t}
          prev={prev && prev.title}
          curr={step.title}
          next={next && next.title}
        />
      )}
      {step.subtitle && (
        <Subtitle
          t={t}
          prev={prev && prev.subtitle}
          curr={step.subtitle}
          next={next && next.subtitle}
        />
      )}
    </div>
  );
}

function CodeSurferContent({ dimensions, prev, curr, next, t }) {
  const ref = React.useRef();

  const { scrollTop, scale } = curr.dimensions
    ? scrollAnimation({ t, curr, prev, next })
    : { scrollTop: 0, scale: 1 };

  const styles = runAnimation({
    lineHeight: curr.dimensions && curr.dimensions.lineHeight,
    t,
    lines: curr.lines
  });

  React.useLayoutEffect(() => {
    ref.current.scrollTop = scrollTop;
  }, [scrollTop]);

  const verticalOrigin = dimensions
    ? dimensions.containerHeight / 2 + scrollTop
    : 0;

  return (
    <pre
      className="cs-content"
      ref={ref}
      style={{
        ...usePreStyle(),
        margin: 0,
        height: "100%",
        overflow: "hidden"
      }}
    >
      <code
        className="cs-scaled-content"
        style={{
          ...usePreStyle(),
          display: "block",
          height: dimensions ? dimensions.contentHeight : "100%",
          width: dimensions && dimensions.contentWidth,
          margin:
            dimensions &&
            `0 ${(dimensions.containerWidth - dimensions.contentWidth) / 2}px`,
          transform: `scale(${scale})`,
          transformOrigin: `center ${verticalOrigin}px`
        }}
      >
        <div style={{ height: dimensions && dimensions.containerHeight / 2 }} />
        {curr.lines.map((line, i) => (
          <Line {...line} style={styles[i]} />
        ))}
        <div style={{ height: dimensions && dimensions.containerHeight / 2 }} />
      </code>
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

function Title({ t, prev, curr, next }) {
  return (
    <h4
      className="cs-title"
      style={{
        ...useTitleStyle(),
        opacity: tweenBackgroundOpacity(t, prev, curr, next)
      }}
    >
      <span style={{ opacity: tweenTextOpacity(t, prev, curr, next) }}>
        {curr.value}
      </span>
    </h4>
  );
}

function Subtitle({ t, prev, curr, next }) {
  return (
    <p
      className="cs-subtitle"
      style={{
        ...useSubtitleStyle(),
        opacity: tweenBackgroundOpacity(t, prev, curr, next)
      }}
    >
      <span
        style={{
          opacity: tweenTextOpacity(t, prev, curr, next)
        }}
      >
        {curr.value}
      </span>
    </p>
  );
}

function tweenBackgroundOpacity(t, prev, curr, next) {
  let opacity;
  if (t && t < 0.5 && !prev) {
    opacity = (t - 0.25) * 4;
  } else if (t && t >= 0.5 && !next) {
    opacity = (0.75 - t) * 4;
  }
  return opacity;
}

function tweenTextOpacity(t, prev, curr, next) {
  let opacity;
  if (t && t < 0.5 && prev && prev.value != curr.value) {
    opacity = (t - 0.25) * 4;
  } else if (t && t >= 0.5 && next && next.value != curr.value) {
    opacity = (0.75 - t) * 4;
  }
  return opacity;
}

export default CodeSurferContainer;
