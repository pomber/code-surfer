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
  scaleToFocus,
  switchText,
  focusLine,
  tween,
  focusToken
} from "./animations";
import { Step } from "code-surfer-types";

type ContainerProps = {
  stepPlayhead: number;
  info: {
    dimensions: any;
    steps: Step[];
  };
};

function CodeSurferContainer({ stepPlayhead, info }: ContainerProps) {
  const { dimensions, steps } = info;
  const ctx = useAnimationContext(steps, stepPlayhead);

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
      <Title ctx={ctx.useSelect(step => step.title)} />
      <Subtitle ctx={ctx.useSelect(step => step.subtitle)} />
    </div>
  );
}

const heightChangingAnimations = [
  {
    animation: exitLine,
    when: (prev, next) => prev && !next,
    stagger: 0.2
  },
  {
    animation: enterLine,
    when: (prev, next) => next && !prev,
    stagger: 0.2
  }
];
/**
 * This part wasn't easy...
 * We need to adjust the scroll as the lines keep changing height
 * So we animate between the prev focus center and the next focus center
 * but taking into acount the height of the lines that are on top of the center
 * for each frame
 */
function useScrollTop(dimensions, stepCtx) {
  if (!dimensions) return 0;

  const linesCtx = stepCtx.useSelectMany(step => step.lines);
  const [prevStep, nextStep] = stepCtx.spread();

  const [realPrevCenter, realNextCenter] = React.useMemo(() => {
    const allPrevLines = linesCtx.map(ctx => ctx.animate((prev, next) => prev));
    const allNextLines = linesCtx.map(ctx => ctx.animate((prev, next) => next));

    const prevCenter = prevStep ? prevStep.focusCenter : 0;
    const nextCenter = nextStep ? nextStep.focusCenter : 0;

    const prevCenterLine = prevStep && prevStep.lines[Math.floor(prevCenter)];
    const nextCenterLine = nextStep && nextStep.lines[Math.floor(nextCenter)];

    const realPrevCenter = prevStep
      ? allPrevLines.indexOf(prevCenterLine) + (prevCenter % 1)
      : 0;
    const realNextCenter = nextStep
      ? allNextLines.indexOf(nextCenterLine) + (nextCenter % 1)
      : 0;

    return [realPrevCenter, realNextCenter];
  }, [prevStep, nextStep]);

  const currentCenter = stepCtx.animate(tween(realPrevCenter, realNextCenter));

  let scrollTop = 0;

  const lineStyles = linesCtx.map(ctx =>
    ctx.animations(heightChangingAnimations)
  );

  let i = 0;
  while (i <= currentCenter - 1) {
    const h = lineStyles[i].height;
    scrollTop += h == null ? dimensions.lineHeight : h;
    i += 1;
  }
  if (i != currentCenter) {
    const h = lineStyles[i].height;
    const height = h == null ? dimensions.lineHeight : h;
    scrollTop += height * (currentCenter - i);
  }

  return scrollTop;
}

function CodeSurferContent({ dimensions, ctx }) {
  const ref = React.useRef(null);

  const scrollTop = useScrollTop(dimensions, ctx);
  React.useLayoutEffect(() => {
    ref.current.scrollTop = scrollTop;
  }, [scrollTop]);

  const { scale } = ctx.animate(scaleToFocus);
  const verticalOrigin = dimensions
    ? dimensions.containerHeight / 2 + scrollTop
    : 0;

  const linesCtx = ctx.useSelectMany(step => step.lines);

  console.log(linesCtx.spread());

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
        {linesCtx.map((ctx, key) => (
          <Line ctx={ctx} key={key} />
        ))}
        <div style={{ height: dimensions && dimensions.containerHeight / 2 }} />
      </code>
    </pre>
  );
}

function Line({ ctx }) {
  const lineStyle = ctx.animations([
    ...heightChangingAnimations,
    {
      animation: focusLine
    }
  ]);

  const { lineTokens, key, focusPerToken } = ctx.animate((prev, next) => ({
    lineTokens: (prev || next).tokens,
    key: (prev || next).key,
    focusPerToken: (prev && prev.focusPerToken) || (next && next.focusPerToken)
  }));

  const getStyleForToken = useTokenStyles();

  let tokens = [];

  let tokensCtx = ctx.useSelectMany(line => line.tokens);

  if (focusPerToken) {
    tokens = tokensCtx.map(tokenCtx => ({
      ...tokenCtx.animate((prev, next) => prev || next),
      animatedStyle: tokenCtx.animate(focusToken)
    }));
  } else {
    tokens = lineTokens.map(token => ({ ...token, animatedStyle: {} }));
  }

  return (
    <div
      style={{
        overflow: "hidden",
        ...lineStyle
        // background: "green"
      }}
    >
      <div
        style={{ display: "inline-block" }}
        className={`cs-line cs-line-${key}`}
      >
        {tokens.map((token, i) => (
          <span
            key={i}
            style={{ ...getStyleForToken(token), ...token.animatedStyle }}
          >
            {token.content}
          </span>
        ))}
      </div>
    </div>
  );
}

function Title({ ctx }) {
  const text = ctx.animate(switchText);
  const bgStyle = ctx.animate(fadeBackground);
  const textStyle = ctx.animate(fadeText);

  if (!text) return null;

  return (
    <h4
      className="cs-title"
      style={{
        ...useTitleStyle(),
        ...bgStyle
      }}
    >
      <span style={textStyle}>{text}</span>
    </h4>
  );
}
function Subtitle({ ctx }) {
  const text = ctx.animate(switchText);
  const bgStyle = ctx.animate(fadeBackground);
  const textStyle = ctx.animate(fadeText);

  if (!text) return null;

  return (
    <p
      className="cs-subtitle"
      style={{
        ...useSubtitleStyle(),
        ...bgStyle
      }}
    >
      <span style={textStyle}>{text}</span>
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
