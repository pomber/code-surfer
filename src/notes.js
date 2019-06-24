import { useDeck } from "mdx-deck";
import React from "react";

export function useNotes(notesElements) {
  const context = useDeck();
  React.useEffect(() => {
    if (!context || !context.register) return;
    if (typeof context.index === "undefined") return;

    const notes = getNotesFromElements(notesElements);

    context.register(context.index, {
      notes
    });
  }, []);
}

function getNotesFromElements(notesElements) {
  const notes = notesElements.map(element => {
    if (!element) {
      // this is a step with empty notes
      return null;
    }

    const { props } = element;

    if (props.inline) {
      // this is <Notes inline={true} />
      return {
        inline: true,
        text: props.children
      };
    }

    // this is <Notes>something</Notes>
    // we shouldn't return an object here,
    // to be compatible with the default Presenter
    return props && props.children;
  });

  if (notes.length) {
    const lastNotes = notes[notes.length - 1];
    // we add an extra EOL to the last step
    notes[notes.length - 1] = (lastNotes || "") + "\n";
  }

  return notes;
}

export function getTextFromNotes(notes) {
  if (notes === null) {
    // this is a step with empty notes
    // we don't add extra lines here
    // to allow a line of text with multiple notes
    return "";
  }

  if (typeof notes === "object") {
    // this comes from a step with inline=true
    // but we check again just in case
    return notes.text + (notes.inline ? "" : "\n");
  } else {
    // this could be an empty note from any slide
    // or a note from a step without the inline prop
    return notes + "\n";
  }
}
