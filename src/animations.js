import { createAnimation, Stagger, Context, run } from "./playhead/playhead";
import easing from "./playhead/easing";

/* @jsx createAnimation */

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

const SlideToLeft = () => (
  <tween
    from={{ x: 0, opacity: 1 }}
    to={{ x: -dx, opacity: outOpacity }}
    ease={easing.easeInQuad}
  />
);

function ShrinkHeight({ lineHeight }) {
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

function ExitLine({ lineHeight }) {
  return (
    <chain durations={[0.35, 0.3, 0.35]}>
      <SlideToLeft />
      <ShrinkHeight lineHeight={lineHeight} />
    </chain>
  );
}

const SlideFromRight = () => (
  <tween
    from={{ x: dx, opacity: outOpacity }}
    to={{ x: 0, opacity: 1 }}
    ease={easing.easeOutQuad}
  />
);

function GrowHeight({ lineHeight }) {
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

function EnterLine({ lineHeight }) {
  return (
    <chain durations={[0.35, 0.3, 0.35]}>
      <delay />
      <GrowHeight lineHeight={lineHeight} />
      <SlideFromRight />
    </chain>
  );
}

export const fadeIn = t => run(<FadeIn />, t);
export const fadeOut = t => run(<FadeOut />, t);
export const fadeOutIn = t => run(<FadeOutIn />, t);

export function switchText(prev, next, t) {
  // TODO merge with fadeBackground and fadeText
  if (t < 0.5) {
    return prev && prev.value;
  } else {
    return next && next.value;
  }
}

export const exitLine = (prev, next, t) => {
  const dimensions = (prev || next).dimensions;
  return run(<ExitLine lineHeight={dimensions && dimensions.lineHeight} />, t);
};
export const enterLine = (prev, next, t) => {
  const dimensions = (prev || next).dimensions;
  return run(<EnterLine lineHeight={dimensions && dimensions.lineHeight} />, t);
};
export const focusLine = (prev, next, t) => {
  return run(
    <tween
      from={{ opacity: prev && prev.focus ? 1 : offOpacity }}
      to={{ opacity: next && next.focus ? 1 : offOpacity }}
    />,
    t
  );
};
export const focusToken = (prev, next, t) => {
  const from = prev && prev.focus === false ? offOpacity : 1;
  const to = next && next.focus === false ? offOpacity : 1;
  return run(<tween from={{ opacity: from }} to={{ opacity: to }} />, t);
};

export const tween = (from, to) => (prev, next, t) => {
  const result = run(
    <tween
      from={{ value: from || 0 }}
      to={{ value: to || 0 }}
      ease={easing.easeInOut}
    />,
    t
  );

  return result.value;
};

export const scaleToFocus = (prev, next, t) => {
  const dimensions = (prev || next).dimensions;

  if (!dimensions) {
    return t => ({
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

function getZoom(step) {
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
