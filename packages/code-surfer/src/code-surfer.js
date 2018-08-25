import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/duotoneDark";
import lightTheme from "prism-react-renderer/themes/duotoneLight";
import * as Scroller from "./scroller";
import { css } from "glamor";
import getTokensPerLine from "./step-parser";

const selectedRules = css({
  opacity: 1,
  transition: "opacity 300ms"
});
const unselectedRules = css({
  opacity: 0.3,
  transition: "opacity 300ms"
});

const CodeSurfer = ({ code, step, lang, showNumbers, dark }) => {
  const tokensPerLine = getTokensPerLine(step);
  const isSelected = (lineIndex, tokenIndex) =>
    tokensPerLine[lineIndex + 1] !== undefined &&
    (tokensPerLine[lineIndex + 1] === null ||
      tokensPerLine[lineIndex + 1].includes(tokenIndex));
  return (
    <Highlight
      {...defaultProps}
      code={code}
      language={lang || "jsx"}
      theme={dark ? darkTheme : lightTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Scroller.Container
          type="pre"
          className={className}
          style={Object.assign({}, style, { background: null })}
        >
          <Scroller.Content type="code">
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {showNumbers && (
                  <span
                    className={
                      "token comment " +
                      (tokensPerLine[i + 1] !== undefined
                        ? selectedRules
                        : unselectedRules)
                    }
                    style={{ userSelect: "none" }}
                  >
                    {(i + 1 + ".").padStart(3)}{" "}
                  </span>
                )}
                {line.map((token, key) => (
                  <Scroller.Element
                    type="span"
                    {...getTokenProps({
                      token,
                      key,
                      selected: isSelected(i, key),
                      className: isSelected(i, key)
                        ? selectedRules
                        : unselectedRules
                    })}
                  />
                ))}
              </div>
            ))}
          </Scroller.Content>
        </Scroller.Container>
      )}
    </Highlight>
  );
};

export default CodeSurfer;
