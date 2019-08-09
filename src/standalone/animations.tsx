/* @jsx createAnimation */
import { createAnimation, run } from "./playhead/playhead";
import easing from "./playhead/easing";

function FadeIn() {
  return <tween from={{ opacity: 0 }} to={{ opacity: 1 }} />;
}
function FadeOut() {
  return <tween from={{ opacity: 1 }} to={{ opacity: 0 }} />;
}

function FadeOutIn() {
  return (
    <chain durations={[0.5, 0.5]}>
      <FadeOut />
      <FadeIn />
    </chain>
  );
}

const dx = 250;
const offOpacity = 0.3;
const outOpacity = 0;
const outHieght = 0;
const lineDurations = [0.25, 0.5, 0.25];

const SlideToLeft = () => (
  <chain durations={lineDurations}>
    <tween
      from={{ x: 0, opacity: 1 }}
      to={{ x: -dx, opacity: outOpacity }}
      ease={easing.easeInQuad}
    />
    <delay />
    <delay />
  </chain>
);

const SlideFromRight = () => (
  <chain durations={lineDurations}>
    <delay />
    <delay />
    <tween
      from={{ x: dx, opacity: outOpacity }}
      to={{ x: 0, opacity: 1 }}
      ease={easing.easeOutQuad}
    />
  </chain>
);

function ShrinkHeight({ lineHeight }: { lineHeight?: number }) {
  if (!lineHeight) {
    return <step from={{ height: null }} to={{ height: 0 }} />;
  }
  return (
    <tween
      from={{ height: lineHeight }}
      to={{ height: outHieght }}
      ease={easing.easeInOutQuad}
    />
  );
}

function ExitLine({ lineHeight }: { lineHeight?: number }) {
  return (
    <chain durations={lineDurations}>
      <delay />
      <ShrinkHeight lineHeight={lineHeight} />
    </chain>
  );
}

function GrowHeight({ lineHeight }: { lineHeight?: number }) {
  if (!lineHeight) {
    return <step from={{ height: 0 }} to={{ height: null }} />;
  }
  return (
    <tween
      from={{ height: outHieght }}
      to={{ height: lineHeight }}
      ease={easing.easeInOutQuad}
    />
  );
}

function EnterLine({ lineHeight }: { lineHeight?: number }) {
  return (
    <chain durations={lineDurations}>
      <delay />
      <GrowHeight lineHeight={lineHeight} />
      <delay />
    </chain>
  );
}

export const fadeIn = (t: number) => run(<FadeIn />, t);
export const fadeOut = (t: number) => run(<FadeOut />, t);
export const fadeOutIn = (t: number) => run(<FadeOutIn />, t);

export function switchText<T>(
  prev: Maybe<{ value: T }>,
  next: Maybe<{ value: T }>,
  t: number
) {
  // TODO merge with fadeBackground and fadeText
  if (t < 0.5) {
    return prev && prev.value;
  } else {
    return next && next.value;
  }
}

function any<T>(prev: Maybe<T>, next: Maybe<T>): T {
  return (prev || next) as T;
}

export const exitLine = (
  prev: Maybe<{ dimensions?: any }>,
  next: Maybe<{ dimensions?: any }>,
  t: number
) => {
  const dimensions = any(prev, next).dimensions;
  return run(<ExitLine lineHeight={dimensions && dimensions.lineHeight} />, t);
};
export const enterLine = (
  prev: Maybe<{ dimensions?: any }>,
  next: Maybe<{ dimensions?: any }>,
  t: number
) => {
  const dimensions = any(prev, next).dimensions;
  return run(<EnterLine lineHeight={dimensions && dimensions.lineHeight} />, t);
};
export const slideToLeft = (
  prev: Maybe<{ dimensions?: any }>,
  next: Maybe<{ dimensions?: any }>,
  t: number
) => {
  return run(<SlideToLeft />, t);
};
export const slideFromRight = (
  prev: Maybe<{ dimensions?: any }>,
  next: Maybe<{ dimensions?: any }>,
  t: number
) => {
  return run(<SlideFromRight />, t);
};
export const focusLine = (
  prev: Maybe<{ focus?: any }>,
  next: Maybe<{ focus?: any }>,
  t: number
) => {
  return run(
    <tween
      from={{ opacity: prev && prev.focus ? 1 : offOpacity }}
      to={{ opacity: next && next.focus ? 1 : offOpacity }}
    />,
    t
  );
};
export const focusToken = (
  prev: Maybe<{ focus?: any }>,
  next: Maybe<{ focus?: any }>,
  t: number
) => {
  const from = prev && prev.focus === false ? offOpacity : 1;
  const to = next && next.focus === false ? offOpacity : 1;
  return run(<tween from={{ opacity: from }} to={{ opacity: to }} />, t);
};

export const tween = (from?: number, to?: number) => (
  _prev: any,
  _next: any,
  t: number
) => {
  const result = run(
    <tween
      from={{ value: from || 0 }}
      to={{ value: to || 0 }}
      ease={easing.easeInOutQuad}
    />,
    t
  );

  return result.value;
};

export const scaleToFocus = (
  prev: Maybe<{ dimensions?: any }>,
  next: Maybe<{ dimensions?: any }>,
  t: number
) => {
  const dimensions = any(prev, next).dimensions;

  if (!dimensions) {
    return (_: number) => ({
      scale: 1
    });
  }

  const prevZoom = getZoom(prev);
  const nextZoom = getZoom(next);

  return run(
    <tween
      from={{
        scale: prevZoom || nextZoom
      }}
      to={{
        scale: nextZoom || prevZoom
      }}
      ease={easing.easeInOutQuad}
    />,
    t
  );
};

export const scrollToFocus = (
  prevStep: Maybe<{ dimensions?: any; focusCenter: number }>,
  nextStep: Maybe<{ dimensions?: any; focusCenter: number }>,
  t: number
) => {
  const dimensions = any(prevStep, nextStep).dimensions;

  if (!dimensions) {
    return (_: number) => ({
      scrollTop: 0
    });
  }

  const prevCenter = prevStep
    ? prevStep.focusCenter * dimensions.lineHeight
    : 0;
  const nextCenter = nextStep
    ? nextStep.focusCenter * dimensions.lineHeight
    : 0;

  return run(
    <chain durations={lineDurations}>
      <delay />
      <tween
        from={{
          scrollTop: prevCenter
        }}
        to={{
          scrollTop: nextCenter
        }}
        ease={easing.easeInOutQuad}
      />
      <delay />
    </chain>,
    t
  );
};

function getZoom(step: any): number | null {
  if (!step) return null;

  const {
    paddingBottom,
    paddingTop,
    containerHeight,
    containerWidth,
    contentWidth,
    lineHeight
  } = step.dimensions;

  const contentHeight = step.focusCount * lineHeight;
  const availableHeight =
    containerHeight - Math.max(paddingBottom, paddingTop) * 2;
  const yZoom = availableHeight / contentHeight;

  // if there are lines that are too long for the container
  const xZoom = (0.9 * containerWidth) / contentWidth;

  return Math.min(yZoom, 1, xZoom);
  // return 1;
}
