import { CodeSurferTheme } from "./utils";

const theme: CodeSurferTheme = {
  colors: {
    background: "rgb(246, 248, 250)",
    text: "rgb(57, 58, 52)",
    primary: "rgb(0, 164, 219)"
  },
  styles: {
    CodeSurfer: {
      pre: {
        color: "text",
        backgroundColor: "background"
      },
      code: {
        color: "text",
        backgroundColor: "background"
      },
      tokens: {
        "comment cdata doctype": {
          fontStyle: "italic"
        },
        "builtin changed keyword punctuation operator tag deleted string attr-value char number inserted": {
          color: "primary"
        }
      },
      title: {
        backgroundColor: "background",
        color: "text"
      },
      subtitle: {
        color: "#d6deeb",
        backgroundColor: "rgba(10,10,10,0.9)"
      },
      unfocused: {
        opacity: 0.3
      }
    }
  }
};

export { theme };
