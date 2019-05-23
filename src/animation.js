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
  if (!context.lineHeight) {
    return <step from={{}} to={{ height: 0 }} />;
  }
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
  if (!context.lineHeight) {
    return <step from={{ height: 0 }} to={{}} />;
  }
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

export function scrollAnimation({ t, prev, curr, next }) {
  // TODO calc params using info
  const { lineHeight, containerHeight } = curr.dimensions;

  const prevStepDims = prev ? prev.dimensions : {};
  const stepDimensions = curr.dimensions;

  const nextStepDims = next ? next.dimensions : {};

  const currentFocus = curr.focusCenter || 0;
  const prevFocus = prev ? prev.focusCenter || 0 : 0;
  const nextFocus = next ? next.focusCenter || 0 : 0;

  const currZoom = getZoom(curr, lineHeight, containerHeight, stepDimensions);
  const prevZoom =
    getZoom(prev, lineHeight, containerHeight, prevStepDims) || currZoom;
  const nextZoom =
    getZoom(next, lineHeight, containerHeight, nextStepDims) || currZoom;

  const animation = (
    <chain durations={[0.5, 0.5]}>
      <tween
        from={{
          scrollTop: prevFocus * lineHeight,
          scale: prevZoom
        }}
        to={{
          scrollTop: currentFocus * lineHeight,
          scale: currZoom
        }}
        ease={easing.easeInOutQuad}
      />
      <tween
        from={{
          scrollTop: currentFocus * lineHeight,
          scale: currZoom
        }}
        to={{
          scrollTop: nextFocus * lineHeight,
          scale: nextZoom
        }}
        ease={easing.easeInOutQuad}
      />
    </chain>
  );

  return run(animation, t);
}

function getZoom(step, lineHeight, containerHeight, stepDimensions) {
  if (!step) return null;
  const { paddingBottom, paddingTop } = stepDimensions;
  const contentHeight = step.focusCount * lineHeight;
  const availableHeight =
    containerHeight - Math.max(paddingBottom, paddingTop) * 2;
  const zoom = availableHeight / contentHeight;
  return Math.min(zoom, 1);
  // return 1;
}
