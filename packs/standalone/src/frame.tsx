import React from "react";
import { useAnimationContext, Context } from "./animation-context";
import {
  fadeIn,
  fadeOutIn,
  fadeOut,
  exitLine,
  enterLine,
  scaleToFocus,
  switchText,
  focusLine,
  focusToken,
  scrollToFocus,
  slideToLeft,
  slideFromRight
} from "./animations";
import { Step, Line as LineType, Token } from "code-surfer-types";
import { Animation, AnimationAndConfig } from "playhead-types";
import { Styled, getClassFromTokenType } from "./styles";

type ContainerProps = {
  stepPlayhead: number;
  dimensions?: any;
  steps: Step[];
};

function CodeSurferContainer({
  stepPlayhead,
  dimensions,
  steps
}: ContainerProps) {
  const ctx = useAnimationContext(steps, stepPlayhead);

  return (
    <div
      className="cs-container"
      style={{
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

const heightChangingAnimations: AnimationAndConfig<any, any>[] = [
  {
    animation: slideToLeft,
    when: (prev, next) => prev && !next,
    stagger: 0.15
  },
  {
    animation: slideFromRight,
    when: (prev, next) => next && !prev,
    stagger: 0.15
  },
  {
    animation: exitLine,
    when: (prev, next) => prev && !next
  },
  {
    animation: enterLine,
    when: (prev, next) => next && !prev
  }
];

function CodeSurferContent({
  dimensions,
  ctx
}: {
  dimensions: any;
  ctx: Context<Step>;
}) {
  const ref = React.useRef<HTMLPreElement | null>(null);

  const { scrollTop } = ctx.animate(scrollToFocus);
  React.useLayoutEffect(() => {
    if (ref.current == null) return;
    ref.current.scrollTop = scrollTop;
  }, [scrollTop]);

  const { scale } = ctx.animate(scaleToFocus);
  const verticalOrigin = dimensions
    ? dimensions.containerHeight / 2 + scrollTop
    : 0;

  const linesCtx = ctx.useSelectMany(step => step.lines);

  return (
    <Styled.Pre
      className="cs-content"
      ref={ref}
      style={{
        margin: 0,
        height: "100%",
        overflow: "hidden"
      }}
    >
      <Styled.Code
        className="cs-scaled-content"
        style={{
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
      </Styled.Code>
    </Styled.Pre>
  );
}

type LineProps = { ctx: Context<LineType> };
const Line = React.memo(function Line({ ctx }: LineProps) {
  const lineStyle = ctx.animations([
    ...heightChangingAnimations,
    {
      animation: focusLine
    }
  ]);

  const { lineTokens, key, focusPerToken } = ctx.animate((prev, next) => {
    const line = (prev || next) as LineType;
    return {
      lineTokens: line.tokens,
      key: line.key,
      focusPerToken:
        (prev && prev.focusPerToken) || (next && next.focusPerToken)
    };
  });

  let tokens: (Token & { animatedStyle: React.CSSProperties })[] = [];

  let tokensCtx = ctx.useSelectMany(line => line.tokens);

  if (focusPerToken) {
    tokens = tokensCtx.map(tokenCtx => ({
      ...tokenCtx.animate((prev, next) => (prev || next) as Token),
      animatedStyle: tokenCtx.animate(focusToken)
    }));
  } else {
    // TODO memoize token elements (yes, React elements)
    tokens = lineTokens.map(token => ({ ...token, animatedStyle: {} }));
  }

  return (
    <div
      style={{
        overflow: "hidden",
        // border: "1px solid red",
        // boxSizing: "border-box",
        ...lineStyle
      }}
    >
      <div
        style={{ display: "inline-block" }}
        className={`cs-line cs-line-${key}`}
      >
        {tokens.map((token, i) => (
          <span
            key={i}
            style={token.animatedStyle}
            className={getClassFromTokenType(token.type)}
          >
            {token.content}
          </span>
        ))}
      </div>
    </div>
  );
}, isLineStatic);

function isLineStatic(prev: LineProps, next: LineProps) {
  if (!prev || !next || Math.floor(prev.ctx.t) !== Math.floor(prev.ctx.t)) {
    // if we are changing steps
    return false;
  }
  const [prevLine, nextLine] = next.ctx.spread();
  if (!prevLine || !nextLine) {
    // we are moving the line
    return false;
  }

  return prevLine.focus === nextLine.focus;
}

function Title({ ctx }: { ctx: Context<{ value: string } | undefined> }) {
  const text = ctx.animate(switchText);
  const bgStyle = ctx.animate(fadeBackground);
  const textStyle = ctx.animate(fadeText);

  if (!text) return null;

  return (
    <Styled.Title className="cs-title" style={bgStyle}>
      <span style={textStyle}>{text}</span>
    </Styled.Title>
  );
}
function Subtitle({ ctx }: { ctx: Context<{ value: string } | undefined> }) {
  const text = ctx.animate(switchText);
  const bgStyle = ctx.animate(fadeBackground);
  const textStyle = ctx.animate(fadeText);

  if (!text) return null;

  return (
    <Styled.Subtitle className="cs-subtitle" style={bgStyle}>
      <span style={textStyle}>{text}</span>
    </Styled.Subtitle>
  );
}

const fadeBackground: Animation<any, { opacity: number }> = (prev, next, t) => {
  let opacity = 1;
  if (!prev) {
    opacity = t;
  }
  if (!next) {
    opacity = 1 - t;
  }
  return { opacity };
};

const fadeText: Animation<{ value: any } | undefined, { opacity: number }> = (
  prev,
  next,
  t
) => {
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
};

export default CodeSurferContainer;
