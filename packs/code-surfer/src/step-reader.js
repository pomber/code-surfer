import { parseMetastring } from "./codeblock-metastring-parser";

export function isCode(element) {
  return element && element.props && element.props.mdxType === "pre";
}

export function readStepFromElement(element) {
  if (!isCode(element)) {
    throw new Error(
      "Invalid element inside <CodeSurfer/>. Make sure to add empty lines (no spaces) before and after each codeblock."
    );
  }

  const { props } = element.props.children;

  const className = props.className && props.className.split(" ")[0];
  return {
    code: props.children,
    lang: className && className.substring("language-".length),
    ...parseMetastring(props.metastring)
  };
}
