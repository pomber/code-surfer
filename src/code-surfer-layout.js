import React from "react";
import { useDeck } from "mdx-deck";
import CodeSurfer from "./code-surfer";

function CodeSurferLayout({ children, ...props }) {
  const deck = useDeck();
  console.log("layout props", props);
  console.log("layout deck", deck);
  const steps = React.useMemo(getStepsFromChildren(children), [deck.index]);
  const lang = steps.length && steps[0].lang;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <CodeSurfer steps={steps} lang={lang} />
    </div>
  );
}

const getStepsFromChildren = children => () => {
  const cs = React.Children.toArray(children);
  return cs
    .map(c => {
      if (!c.props.children || !c.props.children.props) {
        return null;
      }
      const { props } = c.props.children;
      return {
        code: props.children,
        lang: props.className[0].substring("language-".length),
        focus: props.metastring
      };
    })
    .filter(x => x);
};

export default CodeSurferLayout;
