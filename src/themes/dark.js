import { dark } from "mdx-deck/themes";

const tokenStyles = [
  {
    types: ["changed"],
    style: {
      color: "rgb(162, 191, 252)",
      fontStyle: "italic"
    }
  },
  {
    types: ["deleted"],
    style: {
      color: "rgba(239, 83, 80, 0.56)",
      fontStyle: "italic"
    }
  },
  {
    types: ["inserted", "attr-name"],
    style: {
      color: "rgb(173, 219, 103)",
      fontStyle: "italic"
    }
  },
  {
    types: ["comment"],
    style: {
      color: "rgb(99, 119, 119)",
      fontStyle: "italic"
    }
  },
  {
    types: ["string", "url"],
    style: {
      color: "rgb(173, 219, 103)"
    }
  },
  {
    types: ["variable"],
    style: {
      color: "rgb(214, 222, 235)"
    }
  },
  {
    types: ["number"],
    style: {
      color: "rgb(247, 140, 108)"
    }
  },
  {
    types: ["builtin", "char", "constant", "function"],
    style: {
      color: "rgb(130, 170, 255)"
    }
  },
  {
    types: ["punctuation"],
    style: {
      color: "rgb(199, 146, 234)"
    }
  },
  {
    types: ["selector", "doctype"],
    style: {
      color: "rgb(199, 146, 234)",
      fontStyle: "italic"
    }
  },
  {
    types: ["class-name"],
    style: {
      color: "rgb(255, 203, 139)"
    }
  },
  {
    types: ["tag", "operator", "keyword"],
    style: {
      color: "rgb(127, 219, 202)"
    }
  },
  {
    types: ["boolean"],
    style: {
      color: "rgb(255, 88, 116)"
    }
  },
  {
    types: ["property"],
    style: {
      color: "rgb(128, 203, 196)"
    }
  },
  {
    types: ["namespace"],
    style: {
      color: "rgb(178, 204, 214)"
    }
  }
];

const theme = {
  ...dark,
  colors: {
    text: "#d6deeb",
    background: "#011627",
    link: "#rgb(173, 219, 103)",
    pre: "#d6deeb",
    code: "#d6deeb",
    preBackground: "#011627"
  },
  codeSurfer: {
    styles: tokenStyles,
    title: {
      background: "rgba(1, 22, 39, 0.8)"
    },
    subtitle: {
      background: "rgba(2,2,2,0.9)"
    }
  }
};

export default theme;
