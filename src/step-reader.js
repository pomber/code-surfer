import { parseMetastring } from "./codeblock-metastring-parser";
import Code from "./code";

export function readStepFromElement(element) {
  if (element.props && element.props.originalType === Code) {
    // wrap everything except [code, lang, focus] in {value}
    const stepEntries = Object.entries(element.props).map(([key, value]) => ({
      [key]: ["code", "focus", "lang"].includes(key) ? value : { value }
    }));
    return Object.assign({}, ...stepEntries);
  }
  if (!element.props.children || !element.props.children.props) {
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
