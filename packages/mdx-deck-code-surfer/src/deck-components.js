import React from "react";
import { Notes } from "mdx-deck";
import DeckCodeSurfer from "./deck-code-surfer";

const getLanguage = className => className.slice(9);

class Code extends React.PureComponent {
  render() {
    const { children, metaString, className } = this.props;
    const [src, steps] = children.split("\n----");
    const language = getLanguage(className);
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

const NotesOrCode = props =>
  getLanguage(props.className) === "notes" ? (
    <Notes {...props} />
  ) : (
    <Code {...props} />
  );

export default {
  code: NotesOrCode
};
