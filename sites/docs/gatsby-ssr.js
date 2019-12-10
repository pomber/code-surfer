exports.wrapPageElement = ({ element, props }) => {
  // dont ssr errors deck
  if (props["*"] && props["*"].startsWith("errors")) return "";
  return element;
};
