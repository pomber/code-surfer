/** @jsx jsx */
import { jsx } from "theme-ui";
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
  tween,
  focusToken
} from "./animations";
import { Step, Line as LineType, Token } from "code-surfer-types";
import { Animation, AnimationAndConfig } from "playhead-types";
import { Styled } from "./styles";

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
function useScrollTop(dimensions: any, stepCtx: Context<Step>) {
  if (!dimensions) return 0;

  const linesCtx = stepCtx.useSelectMany(step => step.lines);
  const [prevStep, nextStep] = stepCtx.spread();

  const [realPrevCenter, realNextCenter] = React.useMemo(() => {
    const allPrevLines = linesCtx.map(ctx =>
      ctx.animate((prev, _next) => prev)
    );
    const allNextLines = linesCtx.map(ctx =>
      ctx.animate((_prev, next) => next)
    );

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

function CodeSurferContent({
  dimensions,
  ctx
}: {
  dimensions: any;
  ctx: Context<Step>;
}) {
  const ref = React.useRef<HTMLPreElement | null>(null);

  const scrollTop = useScrollTop(dimensions, ctx);
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

function Line({ ctx }: { ctx: Context<LineType> }) {
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
    tokens = lineTokens.map(token => ({ ...token, animatedStyle: {} }));
  }

  return (
    <div
      style={{
        overflow: "hidden",
        ...lineStyle
      }}
    >
      <div
        style={{ display: "inline-block" }}
        className={`cs-line cs-line-${key}`}
      >
        {tokens.map((token, i) => (
          <Styled.Token
            key={i}
            style={token.animatedStyle}
            tokenType={token.type}
          >
            {token.content}
          </Styled.Token>
        ))}
      </div>
    </div>
  );
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
