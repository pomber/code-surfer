// // https://github.com/PrismJS/prism/issues/1303#issuecomment-375353987
// global.Prism = { disableWorkerMessageHandler: true };
// const Prism = require("prismjs");
import Prism from "prismjs";
const newlineRe = /\r\n|\r|\n/;

export function tokenize(code: string, lang: string) {
  const grammar = Prism.languages[lang];
  if (!grammar) {
    throw new MissingGrammarError(lang);
  }

  const prismTokens = Prism.tokenize(code, Prism.languages[lang]);
  const nestedTokens = tokenizeStrings(prismTokens);
  const tokens = flattenTokens(nestedTokens);

  let currentLine: FlatToken[] = [];
  let currentTokenLine: string[] = [];
  let currentTypeLine: string[] = [];

  const lines = [currentLine];
  const tokenLines = [currentTokenLine];
  const typeLines = [currentTypeLine];

  tokens.forEach(token => {
    const contentLines = token.content.split(newlineRe);

    const firstContent = contentLines.shift();
    if (firstContent !== undefined && firstContent !== "") {
      currentLine.push({ type: token.type, content: firstContent });
      currentTokenLine.push(firstContent);
      currentTypeLine.push(token.type);
    }
    contentLines.forEach(content => {
      currentLine = [];
      currentTokenLine = [];
      currentTypeLine = [];
      lines.push(currentLine);
      tokenLines.push(currentTokenLine);
      typeLines.push(currentTypeLine);
      if (content !== "") {
        currentLine.push({ type: token.type, content });
        currentTokenLine.push(content);
        currentTypeLine.push(token.type);
      }
    });
  });
  return {
    tokens: tokenLines,
    types: typeLines
  };
}

type NestedToken = {
  type: string;
  content: string | NestedToken[];
};

function tokenizeStrings(
  prismTokens: (string | Prism.Token)[],
  parentType = "plain"
): NestedToken[] {
  return prismTokens.map(prismToken => wrapToken(prismToken, parentType));
}

function wrapToken(
  prismToken: string | Prism.Token,
  parentType = "plain"
): NestedToken {
  if (typeof prismToken === "string") {
    return {
      type: parentType,
      content: prismToken
    };
  }

  if (Array.isArray(prismToken.content)) {
    return {
      type: prismToken.type,
      content: tokenizeStrings(prismToken.content, prismToken.type)
    };
  }

  return wrapToken(prismToken.content, prismToken.type);
}

type FlatToken = {
  type: string;
  content: string;
};

// Take a list of nested tokens
// (token.content may contain an array of tokens)
// and flatten it so content is always a string
// and type the type of the leaf
function flattenTokens(tokens: NestedToken[]) {
  const flatList: FlatToken[] = [];
  tokens.forEach(token => {
    const { type, content } = token;
    if (Array.isArray(content)) {
      flatList.push(...flattenTokens(content));
    } else {
      flatList.push({ type, content });
    }
  });
  return flatList;
}

export class MissingGrammarError extends Error {
  lang: string;
  constructor(lang: string) {
    super(`Missing syntax highlighting for language "${lang}"`);
    this.lang = lang;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
