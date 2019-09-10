import { Tuple } from "./tuple";
import React, { CSSProperties } from "react";
import {
  enterLine,
  exitLine,
  StyleAnimation,
  emptyStyle,
  changeFocus
} from "./animation";

type Step = {
  lines: number[];
  focus: Record<number, true | number[]>;
};

type LineListProps = {
  stepPair: Tuple<Step>;
  t: number;
  tokens: string[][];
  types: string[][];
  dimensions?: { lineHeight: number };
};

export function LineList({
  stepPair,
  t,
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

      const areTokensAnimated =
        !isStatic && (Array.isArray(prevFocus) || Array.isArray(nextFocus));
      const areTokensStatic = !areTokensAnimated;

      const tokenElements =
        areTokensStatic &&
        tokens[lineKey].map((token, tokeni) => (
          <span className={"token-" + types[lineKey][tokeni]} key={tokeni}>
            {token}
          </span>
        ));

      const lineElement = isStatic && (
        <div
          style={{
            overflow: "hidden",
            opacity: prevFocus ? undefined : offOpacity
          }}
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

      let getLineStyle: StyleAnimation = emptyStyle;
      const { lineHeight } = dimensions || {};
      if (!isStatic) {
        if (!prevLine) {
          const fromOpacity = Array.isArray(nextFocus) ? 1 : 0;
          const toOpacity = nextFocus ? 1 : offOpacity;
          getLineStyle = enterLine(fromOpacity, toOpacity, lineHeight);
        } else if (!nextLine) {
          const fromOpacity = prevFocus ? 1 : offOpacity;
          const toOpacity = Array.isArray(prevFocus) ? 1 : 0;
          getLineStyle = exitLine(fromOpacity, toOpacity, lineHeight);
        } else if (!prevFocus && nextFocus) {
          const fromOpacity = Array.isArray(nextFocus) ? 1 : offOpacity;
          const toOpacity = 1;
          getLineStyle = changeFocus(fromOpacity, toOpacity);
        } else if (prevFocus && !nextFocus) {
          const fromOpacity = 1;
          const toOpacity = Array.isArray(prevFocus) ? 1 : offOpacity;
          getLineStyle = changeFocus(fromOpacity, toOpacity);
        }
      }

      let getTokenStyle:
        | undefined
        | ((t: number, i: number) => CSSProperties) = undefined;
      if (!areTokensStatic) {
        const fromFocus = tokens[lineKey].map((_, tokeni) =>
          Array.isArray(prevFocus) ? prevFocus.includes(tokeni) : prevFocus
        );
        const toFocus = tokens[lineKey].map((_, tokeni) =>
          Array.isArray(nextFocus) ? nextFocus.includes(tokeni) : nextFocus
        );
        getTokenStyle = (t, i) => {
          const animation = changeFocus(
            !prevLine ? 0 : fromFocus[i] ? 1 : offOpacity,
            !nextLine ? 0 : toFocus[i] ? 1 : offOpacity
          );
          const result = animation(t);
          return result;
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
            <div
              style={{ overflow: "hidden", ...getLineStyle(t) }}
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
                      style={getTokenStyle!(t, tokeni)}
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
