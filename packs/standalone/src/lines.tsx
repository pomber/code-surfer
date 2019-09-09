import { Tuple } from "./tuple";
import React, { CSSProperties } from "react";
import {
  enterLine,
  exitLine,
  focus,
  unfocus,
  StyleAnimation,
  tween
} from "./animation";

type Step = {
  lines: number[];
  focus: Record<number, true | number[]>;
};

type LineListProps = {
  stepPair: Tuple<Step>;
  progress: number;
  tokens: string[][];
  types: string[][];
  dimensions?: { lineHeight: number };
};

export function LineList({
  stepPair,
  progress,
  tokens,
  types,
  dimensions
}: LineListProps) {
  const lines = React.useMemo(() => {
    const linesPair = stepPair.selectMany((step: Step) =>
      step.lines.map((lineKey, lineIndex) => ({
        key: lineKey,
        focus: step.focus[lineIndex]
      }))
    );
    return linesPair.map((lineTuple, lineKey) => {
      //TODO get from theme
      const offOpacity = 0.3;

      const [prevLine, nextLine] = lineTuple.spread();
      const [prevFocus, nextFocus] = lineTuple.select(l => l.focus).spread();
      const isMoving = !prevLine || !nextLine;
      const isChangingFocus = prevFocus !== nextFocus;
      const isStatic = !isMoving && !isChangingFocus;

      const areTokensStatic =
        isStatic || (!Array.isArray(prevFocus) && !Array.isArray(nextFocus));

      const tokenElements =
        areTokensStatic &&
        tokens[lineKey].map((token, tokeni) => (
          <span className={"token-" + types[lineKey][tokeni]} key={tokeni}>
            {token}
          </span>
        ));

      const lineElement = isStatic && (
        <div
          style={{ overflow: "hidden", opacity: !prevFocus && offOpacity }}
          key={lineKey}
        >
          <div
            style={{ display: "inline-block" }}
            className={`cs-line cs-line-${lineKey}`}
          >
            {tokenElements}
          </div>
        </div>
      );

      let getLineStyle: StyleAnimation;
      const { lineHeight } = dimensions || {};
      if (!isStatic) {
        if (!prevLine) {
          getLineStyle = enterLine(nextFocus ? 1 : offOpacity, lineHeight);
        } else if (!nextLine) {
          getLineStyle = exitLine(prevFocus ? 1 : offOpacity, lineHeight);
        } else if (!prevFocus && nextFocus) {
          getLineStyle = focus(offOpacity);
        } else if (prevFocus && !nextFocus) {
          getLineStyle = unfocus(offOpacity);
        }
      }

      let getTokenStyle: (t: number, i: number) => CSSProperties;
      if (!areTokensStatic) {
        const fromFocus = tokens.map((_, tokeni) =>
          Array.isArray(prevFocus) ? prevFocus.includes(tokeni) : prevFocus
        );
        const toFocus = tokens.map((_, tokeni) =>
          Array.isArray(nextFocus) ? nextFocus.includes(tokeni) : nextFocus
        );
        getTokenStyle = (t, i) => {
          return {
            opacity: tween(
              fromFocus[i] ? 1 : offOpacity,
              toFocus[i] ? 1 : offOpacity,
              t
            )
          };
        };
      }

      return {
        lineKey,
        lineElement,
        tokenElements,
        getLineStyle,
        getTokenStyle
      };
    });
  }, [stepPair]);

  return (
    <React.Fragment>
      {lines.map(
        ({
          lineElement,
          lineKey,
          tokenElements,
          getLineStyle,
          getTokenStyle
        }) =>
          lineElement || (
            // TODO avoid spreading (move static style to class)
            <div
              style={{ overflow: "hidden", ...getLineStyle(progress) }}
              key={lineKey}
            >
              <div
                style={{ display: "inline-block" }}
                className={`cs-line cs-line-${lineKey}`}
              >
                {tokenElements ||
                  tokens[lineKey].map((token, tokeni) => (
                    <span
                      className={"token-" + types[lineKey][tokeni]}
                      style={getTokenStyle(progress, tokeni)}
                      key={tokeni}
                    >
                      {token}
                    </span>
                  ))}
              </div>
            </div>
          )
      )}
    </React.Fragment>
  );
}
