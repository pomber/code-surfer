import React from "react";
import { Step, Dimensions } from "code-surfer-types";
import { Styled } from "@code-surfer/themes";
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
  progress: number;
  dimensions?: Dimensions;
  steps: Step[];
  tokens: string[][];
  types: string[][];
};

function CodeSurferContainer({
  progress,
  dimensions,
  steps,
  tokens,
  types
}: ContainerProps) {
  const prev = steps[Math.floor(progress)];
  const next = steps[Math.floor(progress) + 1];
  const stepPair = React.useMemo(() => new Tuple(prev, next), [prev, next]);

  const titlePair = React.useMemo(() => stepPair.select(step => step.title), [
    stepPair
  ]);
  const subtitlePair = React.useMemo(
    () => stepPair.select(step => step.subtitle),
    [stepPair]
  );

  const t = progress % 1;

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
      <CodeSurferContent
        dimensions={dimensions}
        stepPair={stepPair}
        t={t}
        tokens={tokens}
        types={types}
      />
      <Title textPair={titlePair} t={t} />
      <Subtitle textPair={subtitlePair} t={t} />
    </div>
  );
}

function CodeSurferContent({
  dimensions,
  stepPair,
  t,
  tokens,
  types
}: {
  dimensions?: Dimensions;
  stepPair: Tuple<Step>;
  t: number;
  tokens: string[][];
  types: string[][];
}) {
  const ref = React.useRef<HTMLPreElement | null>(null);

  const scaleAnimation = React.useMemo(
    () => scaleToFocus(stepPair, dimensions),
    [stepPair, dimensions]
  );

  const scrollAnimation = React.useMemo(
    () => scrollToFocus(stepPair, dimensions),
    [stepPair, dimensions]
  );

  const scale = scaleAnimation(t);
  const scrollTop = scrollAnimation(t);
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
          //TODO isnt contentHeight always undefined?
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
          t={t}
          tokens={tokens}
          types={types}
          dimensions={dimensions}
        />
        <div style={{ height: dimensions && dimensions.containerHeight / 2 }} />
      </Styled.Code>
    </Styled.Pre>
  );
}

type CaptionProps = { textPair: Tuple<string | undefined>; t: number };

function Title({ textPair, t }: CaptionProps) {
  if (!textPair.any()) {
    return null;
  }

  const [prev, next] = textPair.spread();
  const text = t < 0.5 ? prev : next;
  const textStyle = prev !== next ? fadeOutIn()(t) : undefined;
  const backgroundStyle =
    prev && next ? undefined : !prev ? halfFadeIn()(t) : halfFadeOut()(t);

  return (
    <Styled.Title className="cs-title" style={backgroundStyle}>
      <span style={textStyle}>{text}</span>
    </Styled.Title>
  );
}

function Subtitle({ textPair, t }: CaptionProps) {
  if (!textPair.any()) {
    return null;
  }

  const [prev, next] = textPair.spread();
  const text = t < 0.5 ? prev : next;
  const textStyle = prev !== next ? fadeOutIn()(t) : undefined;
  const backgroundStyle =
    prev && next ? undefined : !prev ? halfFadeIn()(t) : halfFadeOut()(t);

  return (
    <Styled.Subtitle className="cs-subtitle" style={backgroundStyle}>
      <span style={textStyle}>{text}</span>
    </Styled.Subtitle>
  );
}

export default CodeSurferContainer;
