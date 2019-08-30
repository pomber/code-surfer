import { grammarNotFound } from "./errors";

// // https://github.com/PrismJS/prism/issues/1303#issuecomment-375353987
// global.Prism = { disableWorkerMessageHandler: true };
// const Prism = require("prismjs");
import Prism from "prismjs";

const newlineRe = /\r\n|\r|\n/;

type NestedToken = {
  type: string;
  content: string | NestedToken[];
};

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

// Wrap strings in tokens
function tokenizeStrings(
  prismTokens: (string | Prism.Token)[],
  parentType = "plain"
): NestedToken[] {
  return prismTokens.map(prismToken => wrapToken(prismToken, parentType));
}

export default function tokenize(code: string, language = "javascript") {
  const grammar = Prism.languages[language];
  if (!grammar) {
    throw grammarNotFound({ lang: language });
  }
  const prismTokens = Prism.tokenize(code, Prism.languages[language]);
  const nestedTokens = tokenizeStrings(prismTokens);
  const tokens = flattenTokens(nestedTokens);

  let currentLine: FlatToken[] = [];
  const lines = [currentLine];
  tokens.forEach(token => {
    const contentLines = token.content.split(newlineRe);

    const firstContent = contentLines.shift();
    if (firstContent !== undefined && firstContent !== "") {
      currentLine.push({ type: token.type, content: firstContent });
    }
    contentLines.forEach(content => {
      currentLine = [];
      lines.push(currentLine);
      if (content !== "") {
        currentLine.push({ type: token.type, content });
      }
    });
  });
  return lines;
}
