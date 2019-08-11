import { StyleItem } from "code-surfer-types";
import { CodeSurferTheme, CodeSurferStyles } from "../styles";

type PrismTheme = {
  plain: { color: string; backgroundColor: string };
  styles: StyleItem[];
};

export function makeTheme(
  prismTheme: PrismTheme,
  override: Partial<CodeSurferStyles> = {}
): any {
  const tokens = {};
  prismTheme.styles.forEach(s => {
    tokens[s.types.join(" ")] = s.style;
  });

  return {
    styles: {
      CodeSurfer: {
        tokens,
        title: {
          backgroundColor: prismTheme.plain.backgroundColor
        },
        subtitle: {
          color: "#d6deeb",
          backgroundColor: "rgba(10,10,10,0.9)"
        },
        pre: {
          color: prismTheme.plain.color,
          backgroundColor: prismTheme.plain.backgroundColor
        },
        code: {
          color: prismTheme.plain.color,
          backgroundColor: prismTheme.plain.backgroundColor
        },
        ...override
      }
    }
  };
}
