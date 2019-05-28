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

const SlideToLeft = () => (
  <tween
    from={{ x: 0, opacity: 1 }}
    to={{ x: -dx, opacity: 0 }}
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
      to={{ height: 0 }}
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

export const fadeIn = t => run(<FadeIn />, t);
export const fadeOut = t => run(<FadeOut />, t);
export const fadeOutIn = t => run(<FadeOutIn />, t);
export const exitLine = (prev, next, t) => {
  return run(
    <ExitLine lineHeight={prev.dimensions && prev.dimensions.lineHeight} />,
    t
  );
};
