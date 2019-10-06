export default {
  colors: {
    background: "#222",
    text: "#ddd",
    primary: "#1e9"
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
        "builtin changed keyword punctuation operator tag deleted string attr-value char number inserted attr-name": {
          color: "primary"
        },
        function: {
          color: "text"
        }
      },
      title: {
        backgroundColor: "background",
        color: "text",
        border: "25px solid",
        borderColor: "primary",
        marginBottom: "30px",
        padding: "25px",
        textAlign: "right"
      },
      subtitle: {
        color: "#222",
        backgroundColor: "#d6deeb99",
        transform: "rotate(-5deg) translateY(-100px)"
      },
      unfocused: {
        opacity: 0.1
      }
    }
  }
};
