import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";

export default ({ children, className }) => {
  const language = className.replace(/language-/, "");
  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            padding: "20px",
            border: "1px solid #999",
            borderRadius: "5px",
            overflow: "auto"
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

const theme = {
  plain: {
    color: "rgb(57, 58, 52)",
    backgroundColor: "rgb(246, 248, 250)"
  },
  styles: [
    {
      types: [
        "builtin",
        "changed",
        "keyword",
        "punctuation",
        "operator",
        "tag",
        "deleted",
        "string",
        "attr-value",
        "char",
        "number",
        "inserted"
      ],
      style: {
        color: "rgb(0, 164, 219)"
      }
    },
    {
      types: ["comment"],
      style: {
        fontStyle: "italic"
      }
    }
  ]
};
