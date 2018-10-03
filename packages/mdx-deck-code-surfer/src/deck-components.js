import React from "react";
import DeckCodeSurfer from "./deck-code-surfer";

class Code extends React.PureComponent {
  render() {
    const { children, metaString, className } = this.props;
    const [src, steps] = children.split("\n----");
    const language = className.slice(9);
    return (
      <DeckCodeSurfer
        code={src}
        steps={steps}
        title={metaString}
        lang={language}
      />
    );
  }
}

export default {
  code: Code
};
