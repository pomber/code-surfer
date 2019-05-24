import { addColors } from "./utils";

// Original: https://raw.githubusercontent.com/PrismJS/prism-themes/master/themes/prism-ghcolors.css

const prismTheme = {
  plain: {
    color: "#393A34",
    backgroundColor: "#f6f8fa"
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#999988",
        fontStyle: "italic"
      }
    },
    {
      types: ["namespace"],
      style: {
        opacity: 0.7
      }
    },
    {
      types: ["string", "attr-value"],
      style: {
        color: "#e3116c"
      }
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "#393A34"
      }
    },
    {
      types: [
        "entity",
        "url",
        "symbol",
        "number",
        "boolean",
        "variable",
        "constant",
        "property",
        "regex",
        "inserted"
      ],
      style: {
        color: "#36acaa"
      }
    },
    {
      types: ["atrule", "keyword", "attr-name", "selector"],
      style: {
        color: "#00a4db"
      }
    },
    {
      types: ["function", "deleted", "tag"],
      style: {
        color: "#d73a49"
      }
    },
    {
      types: ["function-variable"],
      style: {
        color: "#6f42c1"
      }
    },
    {
      types: ["tag", "selector"],
      style: {
        color: "#00009f"
      }
    }
  ]
};

const githubLight = {
  codeSurfer: {
    styles: prismTheme.styles,
    title: {
      background: "rgb(246, 248, 250, 0.8)"
    },
    subtitle: {
      color: "#d6deeb",
      background: "rgba(2,2,2,0.9)"
    },
    pre: {
      color: prismTheme.plain.color,
      background: prismTheme.plain.backgroundColor
    },
    code: {
      color: prismTheme.plain.color,
      background: prismTheme.plain.backgroundColor
    }
  }
};

const fullGithubLight = addColors(githubLight, prismTheme);

export { githubLight, fullGithubLight };
