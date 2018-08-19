import React from "react";
import Prism from "prismjs";

import "prismjs/components/prism-jsx.js";
import "prismjs/themes/prism.css";

const parseCode = code => {
  const grammar = Prism.languages["jsx"];
  const language = null;
  const env = {
    code: code,
    grammar: grammar,
    language: language
  };
  Prism.hooks.run("before-tokenize", env);
  env.tokens = Prism.tokenize(env.code, env.grammar);
  Prism.hooks.run("after-tokenize", env);

  return Prism.Token.stringify(Prism.util.encode(env.tokens), env.language);
};

class CodeSurfer extends React.Component {
  render() {
    return (
      <pre>
        <code
          dangerouslySetInnerHTML={{
            __html: parseCode(this.props.code)
          }}
        />
      </pre>
    );
  }
}

export default CodeSurfer;
