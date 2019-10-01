import { parseMetastring } from "./codeblock-metastring-parser";

export function readStepFromElement(element) {
  if (
    !element ||
    !element.props ||
    !element.props.children ||
    !element.props.children.props
  ) {
    return null;
  }
  const { props } = element.props.children;
  const className = props.className;
  return {
    code: props.children,
    lang: className && className.substring("language-".length),
    ...parseMetastring(props.metastring)
  };
}
