import { addColors, makeTheme } from "./utils";

// From: https://github.com/FormidableLabs/prism-react-renderer/blob/master/themes/

const prismTheme = {
  plain: {
    color: "#282a2e",
    backgroundColor: "#ffffff"
  },
  styles: [
    {
      types: ["comment"],
      style: {
        color: "rgb(197, 200, 198)"
      }
    },
    {
      types: ["string", "number", "builtin", "variable"],
      style: {
        color: "rgb(150, 152, 150)"
      }
    },
    {
      types: ["class-name", "function", "tag", "attr-name"],
      style: {
        color: "rgb(40, 42, 46)"
      }
    }
  ]
};

const theme = makeTheme(prismTheme);
const fullTheme = addColors(theme, prismTheme);

export { theme, fullTheme };
