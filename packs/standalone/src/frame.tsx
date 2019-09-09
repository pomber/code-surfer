import React from "react";
import { useAnimationContext, Context } from "./animation-context";
import { Step } from "code-surfer-types";
import { Styled } from "./styles";
import { LineList } from "./lines";
import {
  fadeOutIn,
  halfFadeIn,
  halfFadeOut,
  scrollToFocus,
  scaleToFocus
} from "./animation";
import { Tuple } from "./tuple";

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

  // caption props
  const titlePair = ctx.useSelect(step => step.title && step.title.value).tuple;
  const subtitlePair = ctx.useSelect(
    step => step.subtitle && step.subtitle.value
  ).tuple;
  const progress = ctx.t;

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
      <Title textPair={titlePair} progress={progress} />
      <Subtitle textPair={subtitlePair} progress={progress} />
    </div>
  );
}

function CodeSurferContent({
  dimensions,
  ctx
}: {
  dimensions: any;
  ctx: Context<Step>;
}) {
  const ref = React.useRef<HTMLPreElement | null>(null);

  // lines props
  const stepPair = ctx.tuple.select(s => ({
    focus: s.xFocus,
    lines: s.xLines,
    focusCenter: s.focusCenter,
    focusCount: s.focusCount,
    dimensions: s.dimensions && {
      paddingBottom: s.dimensions.paddingBottom,
      paddingTop: s.dimensions.paddingTop
    }
  }));
  const progress = ctx.t;
  const tokens = ctx.tuple.any().xTokens;
  const types = ctx.tuple.any().xTypes;
  const ds = dimensions && {
    lineHeight: dimensions.lineHeight as number,
    containerHeight: dimensions.containerHeight,
    containerWidth: dimensions.containerWidth,
    contentWidth: dimensions.contentWidth
  };

  const scrollTop = scrollToFocus(progress, stepPair, dimensions);

  const scale = scaleToFocus(progress, stepPair, ds);

  const verticalOrigin = dimensions
    ? dimensions.containerHeight / 2 + scrollTop
    : 0;

  React.useLayoutEffect(() => {
    if (ref.current == null) return;
    ref.current.scrollTop = scrollTop;
  }, [scrollTop]);

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
        <LineList
          stepPair={stepPair}
          progress={progress}
          tokens={tokens}
          types={types}
          dimensions={ds}
        />
        <div style={{ height: dimensions && dimensions.containerHeight / 2 }} />
      </Styled.Code>
    </Styled.Pre>
  );
}

type CaptionProps = { textPair: Tuple<string>; progress: number };
function Title({ textPair, progress }: CaptionProps) {
  if (!textPair.any()) {
    return null;
  }

  const [prev, next] = textPair.spread();
  const text = progress < 0.5 ? prev : next;
  const textStyle = prev !== next ? fadeOutIn()(progress) : undefined;
  const backgroundStyle =
    prev && next
      ? undefined
      : !prev
      ? halfFadeIn()(progress)
      : halfFadeOut()(progress);

  return (
    <Styled.Title className="cs-title" style={backgroundStyle}>
      <span style={textStyle}>{text}</span>
    </Styled.Title>
  );
}
function Subtitle({ textPair, progress }: CaptionProps) {
  if (!textPair.any()) {
    return null;
  }

  const [prev, next] = textPair.spread();
  const text = progress < 0.5 ? prev : next;
  const textStyle = prev !== next ? fadeOutIn()(progress) : undefined;
  const backgroundStyle =
    prev && next
      ? undefined
      : !prev
      ? halfFadeIn()(progress)
      : halfFadeOut()(progress);

  return (
    <Styled.Subtitle className="cs-subtitle" style={backgroundStyle}>
      <span style={textStyle}>{text}</span>
    </Styled.Subtitle>
  );
}

export default CodeSurferContainer;
