import Prism from "prismjs";
import memoize from "lodash.memoize";

import "prismjs/components/prism-jsx.js";

function parseToken(token, counter) {
  if (token === "\n") {
    counter.current = 0;
    return token;
  } else if (typeof token === "string" && token.includes("\n")) {
    const [left, ...rest] = token.split("\n");
    const right = rest.join("\n");
    const tokens = addCustomTokens([left, "\n", right], counter);
    return tokens;
  } else if (typeof token === "string" && !token.trim()) {
    // whitespace
    return token;
  } else if (typeof token === "string") {
    counter.current++;
    return new Prism.Token(
      "free-text",
      token,
      ["token-" + counter.current, "token-leaf"],
      token
    );
  } else if (Prism.util.type(token.content) === "Array") {
    token.content = addCustomTokens(token.content, counter);
    return token;
  } else {
    counter.current++;
    const aliases =
      Prism.util.type(token.alias) === "Array" ? token.alias : [token.alias];
    aliases.push("token-" + counter.current, "token-leaf");
    token.alias = aliases;
    return token;
  }
}

function addCustomTokens(tokens, counter = { current: 0 }) {
  const newTokens = tokens.map(token => parseToken(token, counter));
  // flatten
  return newTokens.concat.apply([], newTokens);
}

const highlight = code => {
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

  env.tokens = addCustomTokens(env.tokens);

  return Prism.Token.stringify(Prism.util.encode(env.tokens), env.language);
};

const highlightLines = code => {
  const html = highlight(code);
  const lines = html.split("\n");
  if (lines.length && lines[lines.length - 1].trim() == "") {
    // Remove last line if it's empty
    lines.pop();
  }
  return lines;
};

export default memoize(highlightLines);
