import React from "react";
import {
  useContainerStyle,
  usePreStyle,
  useTokenStyles,
  useSubtitleStyle,
  useTitleStyle
} from "./theming";
import { useAnimationContext } from "./animation-context";
import {
  fadeIn,
  fadeOutIn,
  fadeOut,
  exitLine,
  enterLine,
  scrollToFocus,
  scaleToFocus,
  switchText,
  focusLine
} from "./animations";

function CodeSurferContainer({ stepPlayhead, info }) {
  const { dimensions, steps } = info;
  const ctx = useAnimationContext(steps, stepPlayhead);

  const step = ctx.current();

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
      <CodeSurferContent dimensions={dimensions} ctx={ctx} />
      {step.title && <Title ctx={ctx.select(step => step.title)} />}
      {step.subtitle && <Subtitle ctx={ctx.select(step => step.subtitle)} />}
    </div>
  );
}

function CodeSurferContent({ dimensions, ctx }) {
  const ref = React.useRef();

  const { scrollTop } = ctx.useAnimation(scrollToFocus);
  const { scale } = ctx.useAnimation(scaleToFocus);

  // const styles = runAnimation({
  //   lineHeight: curr.dimensions && curr.dimensions.lineHeight,
  //   t,
  //   lines: curr.lines
  // });

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
        {ctx
          .select(step => step.lines)
          .map(({ key, ctx }, i) => (
            <Line ctx={ctx} key={key} />
          ))}
        <div style={{ height: dimensions && dimensions.containerHeight / 2 }} />
      </code>
    </pre>
  );
}

function Line({ ctx }) {
  const lineStyle = ctx.useAnimations([
    {
      animation: exitLine,
      when: (prev, next) => prev && !next,
      stagger: 0.2
    },
    {
      animation: enterLine,
      when: (prev, next) => next && !prev,
      stagger: 0.2
    },
    {
      animation: focusLine
    }
  ]);

  const { tokens, key } = ctx.useAnimation((prev, next) => ({
    tokens: (prev || next).tokens,
    key: (prev || next).key
  }));

  const getStyleForToken = useTokenStyles();
  return (
    <div style={{ overflow: "hidden", ...lineStyle }}>
      <div
        style={{ display: "inline-block" }}
        className={`cs-line cs-line-${key}`}
      >
        {tokens.map((token, i) => (
          <span key={i} style={getStyleForToken(token)}>
            {token.content}
          </span>
        ))}
      </div>
    </div>
  );
}

function Title({ ctx }) {
  return (
    <h4
      className="cs-title"
      style={{
        ...useTitleStyle(),
        ...ctx.useAnimation(fadeBackground)
      }}
    >
      <span style={ctx.useAnimation(fadeText)}>
        {ctx.useAnimation(switchText)}
      </span>
    </h4>
  );
}
function Subtitle({ ctx }) {
  return (
    <p
      className="cs-subtitle"
      style={{
        ...useSubtitleStyle(),
        ...ctx.useAnimation(fadeBackground)
      }}
    >
      <span style={ctx.useAnimation(fadeText)}>
        {ctx.useAnimation(switchText)}
      </span>
    </p>
  );
}

function fadeBackground(prev, next, t) {
  let opacity = 1;
  if (!prev) {
    opacity = t;
  }
  if (!next) {
    opacity = 1 - t;
  }
  return { opacity };
}

function fadeText(prev, next, t) {
  if (prev && next && prev.value !== next.value) {
    return fadeOutIn(t);
  }
  if (!prev) {
    return fadeIn(t);
  }
  if (!next) {
    return fadeOut(t);
  }
  return { opacity: 1 };
}

export default CodeSurferContainer;
