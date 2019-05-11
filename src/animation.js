/* eslint-disable */
import { createAnimation, Stagger, Context, run } from "./playhead/playhead";
import easing from "./playhead/easing";

const dx = 250;
const offOpacity = 0.3;

/* @jsx createAnimation */

const SlideToLeft = () => (
  <tween
    from={{ x: 0, opacity: 1 }}
    to={{ x: -dx, opacity: 0 }}
    ease={easing.easeInQuad}
  />
);

function ShrinkHeight(props, context) {
  return (
    <tween
      from={{ height: context.lineHeight }}
      to={{ height: 0 }}
      ease={easing.easeInOutQuad}
    />
  );
}

const SlideFromRight = () => (
  <tween
    from={{ x: dx, opacity: 0 }}
    to={{ x: 0, opacity: 1 }}
    ease={easing.easeOutQuad}
  />
);
function GrowHeight(props, context) {
  return (
    <tween
      from={{ height: 0 }}
      to={{ height: context.lineHeight }}
      ease={easing.easeInOutQuad}
    />
  );
}

function SwitchLines(
  { filterExit, filterEnter, prevFocus, nextFocus },
  { lines }
) {
  return (
    <parallel>
      <Stagger interval={0.2} filter={filterExit} targets={lines}>
        <chain durations={[0.35, 0.3, 0.35]}>
          <SlideToLeft />
          <ShrinkHeight />
        </chain>
      </Stagger>
      <Stagger interval={0.2} filter={filterEnter} targets={lines}>
        <chain durations={[0.35, 0.3, 0.35]}>
          <delay />
          <GrowHeight />
          <SlideFromRight />
        </chain>
      </Stagger>
      <list forEach={lines}>
        {line => (
          <tween
            from={{ opacity: prevFocus(line) ? 1 : offOpacity }}
            to={{ opacity: nextFocus(line) ? 1 : offOpacity }}
          />
        )}
      </list>
    </parallel>
  );
}

function Animation() {
  return (
    <chain durations={[0.5, 0.5]}>
      <SwitchLines
        filterExit={line => line.left && !line.middle}
        filterEnter={line => !line.left && line.middle}
        prevFocus={line => line.prevFocus}
        nextFocus={line => line.focus}
      />
      <SwitchLines
        filterExit={line => line.middle && !line.right}
        filterEnter={line => !line.middle && line.right}
        prevFocus={line => line.focus}
        nextFocus={line => line.nextFocus}
      />
    </chain>
  );
}

export function runAnimation({ lineHeight, lines, t }) {
  const animation = (
    <Context lineHeight={lineHeight} lines={lines}>
      <Animation />
    </Context>
  );
  return run(animation, t);
}

export function scrollAnimation({
  lineHeight,
  containerHeight,
  currentFocus,
  prevFocus,
  nextFocus,
  prevStep,
  currStep,
  nextStep,
  t
}) {
  const currZoom = getZoom(currStep, lineHeight, containerHeight);
  const prevZoom = getZoom(prevStep, lineHeight, containerHeight) || currZoom;
  const nextZoom = getZoom(nextStep, lineHeight, containerHeight) || currZoom;

  const animation = (
    <chain durations={[0.5, 0.5]}>
      <tween
        from={{ focusY: prevFocus * lineHeight, scale: prevZoom }}
        to={{ focusY: currentFocus * lineHeight, scale: currZoom }}
        ease={easing.easeInOutQuad}
      />
      <tween
        from={{ focusY: currentFocus * lineHeight, scale: currZoom }}
        to={{ focusY: nextFocus * lineHeight, scale: nextZoom }}
        ease={easing.easeInOutQuad}
      />
    </chain>
  );

  return run(animation, t);
}

function getZoom(step, lineHeight, containerHeight) {
  if (!step) return null;
  const contentHeight = (step.focusCount + 4) * lineHeight;
  const zoom = containerHeight / contentHeight;
  return Math.min(zoom, 1);
}
