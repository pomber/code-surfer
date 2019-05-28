import React from "react";
import {
  useContainerStyle,
  usePreStyle,
  useTokenStyles,
  useSubtitleStyle,
  useTitleStyle
} from "./theming";
import { runAnimation, scrollAnimation } from "./animation";
import { useAnimationContext } from "./animation-context";
import { fadeIn, fadeOutIn, fadeOut } from "./animations";
import { prefixed } from "eventemitter3";

function CodeSurferContainer({ t, stepIndex, info }) {
  const { dimensions, steps } = info;
  const step = steps[stepIndex];
  const prev = steps[stepIndex - 1];
  const next = steps[stepIndex + 1];

  const playhead = stepIndex + (t * 2 - 1);
  const ctx = useAnimationContext(steps, playhead);

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
        ctx={ctx}
      />
      {step.title && (
        <Title
          t={t}
          prev={prev && prev.title}
          curr={step.title}
          next={next && next.title}
          ctx={ctx.select(step => step.title)}
        />
      )}
      {step.subtitle && (
        <Subtitle
          t={t}
          prev={prev && prev.subtitle}
          curr={step.subtitle}
          next={next && next.subtitle}
          ctx={ctx.select(step => step.subtitle)}
        />
      )}
    </div>
  );
}

function CodeSurferContent({ dimensions, prev, curr, next, t, ctx }) {
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
        {ctx
          .select(step => step.lines)
          .map(({ key, ctx }, i) => (
            <Line {...ctx.current()} style={styles[i]} ctx={ctx} key={key} />
          ))}
        <div style={{ height: dimensions && dimensions.containerHeight / 2 }} />
      </code>
    </pre>
  );
}

function Line({ style, tokens, ctx }) {
  // const lineStyle = ctx.useAnimations([
  //   {
  //     animation: exitLine,
  //     when: (prev, next) => prev && prev.show && (!next || !next.show),
  //     stagger: 0.2
  //   }
  // ]);

  // console.log(lineStyle);

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

function Title({ ctx }) {
  return (
    <h4
      className="cs-title"
      style={{
        ...useTitleStyle(),
        ...ctx.useAnimation(fadeBackground)
      }}
    >
      <span style={ctx.useAnimation(fadeText)}>{ctx.current().value}</span>
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
      <span style={ctx.useAnimation(fadeText)}>{ctx.current().value}</span>
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
