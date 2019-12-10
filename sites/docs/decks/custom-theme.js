export default {
  colors: {
    background: "#222",
    text: "#ddd",
    primary: "#a66"
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
      }
    }
  }
};
