/* eslint-disable */
import { createAnimation, Stagger, Context, run } from "./playhead/playhead";
import easing from "./playhead/easing";
import { getZoom } from "./code-surfer-measurer";

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

export function scrollAnimation({ info, currentStepIndex, t }) {
  // TODO calc params using info
  const { steps, dimensions } = info;
  const { lineHeight, containerHeight } = dimensions;

  const prevStepDims = steps[currentStepIndex - 1]
    ? steps[currentStepIndex - 1].dimensions
    : {};
  const stepDimensions = steps[currentStepIndex].dimensions;

  const nextStepDims = steps[currentStepIndex + 1]
    ? steps[currentStepIndex + 1].dimensions
    : {};

  const prevStep = steps[currentStepIndex - 1];
  const currStep = steps[currentStepIndex];
  const nextStep = steps[currentStepIndex + 1];
  const currentFocus = steps[currentStepIndex].focusCenter || 0;
  const prevFocus = prevStep ? prevStep.focusCenter || 0 : 0;
  const nextFocus = nextStep ? nextStep.focusCenter || 0 : 0;

  const currZoom = getZoom(
    currStep,
    lineHeight,
    containerHeight,
    stepDimensions
  );
  const prevZoom =
    getZoom(prevStep, lineHeight, containerHeight, prevStepDims) || currZoom;
  const nextZoom =
    getZoom(nextStep, lineHeight, containerHeight, nextStepDims) || currZoom;

  const animation = (
    <chain durations={[0.5, 0.5]}>
      <parallel>
        <tween
          from={{
            focusY: prevFocus * lineHeight,
            scale: prevZoom
          }}
          to={{
            focusY: currentFocus * lineHeight,
            scale: currZoom
          }}
          ease={easing.easeInOutQuad}
        />
        <chain durations={[0.5, 0.5]}>
          <tween
            from={{
              opacity: 1
            }}
            to={{
              opacity: 0
            }}
            ease={easing.easeInOutQuad}
          />
          <tween
            from={{
              opacity: 0
            }}
            to={{
              opacity: 1
            }}
            ease={easing.easeInOutQuad}
          />
        </chain>
      </parallel>
      <parallel>
        <tween
          from={{
            focusY: currentFocus * lineHeight,
            scale: currZoom
          }}
          to={{
            focusY: nextFocus * lineHeight,
            scale: nextZoom
          }}
          ease={easing.easeInOutQuad}
        />
        <chain durations={[0.5, 0.5]}>
          <tween
            from={{
              opacity: 1
            }}
            to={{
              opacity: 0
            }}
            ease={easing.easeInOutQuad}
          />
          <tween
            from={{
              opacity: 0
            }}
            to={{
              opacity: 1
            }}
            ease={easing.easeInOutQuad}
          />
        </chain>
      </parallel>
    </chain>
  );

  return run(animation, t);
}
