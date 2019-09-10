import { CSSProperties } from "react";
import easing, { Easing } from "./easing";
import { Tuple } from "./tuple";
import { Step, Dimensions } from "code-surfer-types";

const distx = 250;
const outOpacity = 0;
const outHeight = 0;

// 20% line slide to left
// 80% line change height and scroll
// 20% line slide from right
const [EXIT, SCROLL, ENTER] = [0.2, 0.8, 1];

type Animation<T> = (t: number) => T;
export type StyleAnimation = (t: number) => CSSProperties;

export function exitLine(
  fromOpacity: number,
  lineHeight: number = 100
): StyleAnimation {
  return chain([
    [EXIT, slideToLeft(fromOpacity)],
    [SCROLL, shrinkHeight(lineHeight)],
    [ENTER, undefined]
  ]);
}

export function enterLine(toOpacity: number, lineHeight: number = 100) {
  return chain(
    [
      [EXIT, undefined],
      [SCROLL, growHeight(lineHeight)],
      [ENTER, slideFromRight(toOpacity)]
    ],
    {
      transform: `translateX(${distx}px)`,
      height: 0,
      opacity: 0
    }
  );
}

export function focus(offOpacity: number) {
  return (t: number) => ({ opacity: tween(offOpacity, 1, t) });
}

export function unfocus(offOpacity: number) {
  return (t: number) => ({ opacity: tween(1, offOpacity, t) });
}

export function fadeOutIn(offOpacity = 0) {
  return chain([[0.5, fadeOut(offOpacity)], [1, fadeIn(offOpacity)]]);
}

export function halfFadeIn(offOpacity = 0) {
  return chain([[0.5, undefined], [1, fadeIn(offOpacity)]], { opacity: 0 });
}

export function halfFadeOut(offOpacity = 0) {
  return chain([[0.5, fadeOut(offOpacity)], [1, undefined]]);
}

export function scrollToFocus(
  stepPair: Tuple<Step>,
  dimensions?: Dimensions
): Animation<number> {
  if (!dimensions) {
    return () => 0;
  }

  const [prevStep, nextStep] = stepPair.spread();

  const prevCenter = prevStep
    ? prevStep.focusCenter * dimensions.lineHeight
    : 0;
  const nextCenter = nextStep
    ? nextStep.focusCenter * dimensions.lineHeight
    : 0;

  const animation = chain(
    [
      [EXIT, undefined],
      [
        SCROLL,
        t => ({
          scroll: tween(prevCenter, nextCenter, t, easing.easeInOutQuad)
        })
      ],
      [ENTER, undefined]
    ],
    { scroll: prevCenter }
  );

  return t => animation(t).scroll;
}

export function scaleToFocus(
  stepPair: Tuple<Step>,
  dimensions?: Dimensions
): Animation<number> {
  if (!dimensions) {
    return () => 1;
  }

  const [prev, next] = stepPair.spread();

  const prevZoom = getZoom(prev, dimensions);
  const nextZoom = getZoom(next, dimensions);

  return t =>
    tween(
      prevZoom || nextZoom!,
      nextZoom || prevZoom!,
      t,
      easing.easeInOutQuad
    );
}

//

function slideToLeft(startOpacity: number): StyleAnimation {
  return (t: number) => ({
    opacity: tween(startOpacity, outOpacity, t),
    transform: `translateX(${tween(0, -distx, t)}px)`
  });
}

function slideFromRight(endOpacity: number): StyleAnimation {
  return (t: number) => ({
    opacity: tween(outOpacity, endOpacity, t),
    transform: `translateX(${tween(distx, 0, t)}px)`
  });
}

function shrinkHeight(lineHeight: number): StyleAnimation {
  return (t: number) => ({
    height: tween(lineHeight, outHeight, t, easing.easeInOutQuad)
  });
}

function growHeight(lineHeight: number): StyleAnimation {
  return (t: number) => ({
    height: tween(outHeight, lineHeight, t, easing.easeInOutQuad)
  });
}

export function fadeOut(offOpacity: number = 0): StyleAnimation {
  return (t: number) => ({ opacity: tween(1, offOpacity, t) });
}

export function fadeIn(offOpacity: number = 0): StyleAnimation {
  return (t: number) => ({ opacity: tween(offOpacity, 1, t) });
}

export function tween(
  from: number,
  to: number,
  t: number,
  ease: Easing = easing.linear
) {
  return from + (to - from) * ease(t);
}

export function chain<T extends object>(
  steps: [number, undefined | ((t: number) => T)][],
  start: T = {} as T
): Animation<T> {
  return (t: number) => {
    let style = Object.assign({}, start);
    let prevTop = 0;
    for (let i = 0; i < steps.length; i++) {
      const [top, fn] = steps[i];

      const stept = t > top ? 1 : (t - prevTop) / (top - prevTop);

      if (fn) {
        Object.assign(style, fn(stept));
      }

      if (t < top) {
        return style;
      }

      prevTop = top;
    }
    return style;
  };
}

function getZoom(step: Maybe<Step>, dimensions: Dimensions): number | null {
  if (!step) return null;

  if (!dimensions || !step.dimensions)
    throw new Error("Can't get zoom without dimensions");

  const {
    containerHeight,
    containerWidth,
    contentWidth,
    lineHeight
  } = dimensions;

  const { paddingBottom, paddingTop } = step.dimensions;

  const contentHeight = step.focusCount * lineHeight;
  const availableHeight =
    containerHeight - Math.max(paddingBottom, paddingTop) * 2;
  const yZoom = availableHeight / contentHeight;

  // if there are lines that are too long for the container
  const xZoom = (0.9 * containerWidth) / contentWidth;

  return Math.min(yZoom, 1, xZoom);
}
