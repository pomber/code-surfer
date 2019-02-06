import React from "react";
import { Notes } from "mdx-deck";
import DeckCodeSurfer from "./deck-code-surfer";

class Code extends React.PureComponent {
  render() {
    const { children, metaString, className, Prism } = this.props;
    const [src, steps] = children.split("\n----");
    const language = className.slice(9);
    return language === "notes" ? (
      <Notes {...this.props} />
    ) : (
      <DeckCodeSurfer
        code={src}
        steps={steps}
        title={metaString}
        lang={language}
        Prism={Prism}
      />
    );
  }
}

export default {
  code: Code
};
