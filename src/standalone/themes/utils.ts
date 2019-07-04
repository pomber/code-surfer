import { StyleItem, CodeSurferTheme } from "code-surfer-types";

type PrismTheme = {
  plain: { color: string; backgroundColor: string };
  styles: StyleItem[];
};

export function makeTheme(
  prismTheme: PrismTheme,
  override: Partial<CodeSurferTheme> = {}
): CodeSurferTheme {
  return {
    styles: prismTheme.styles,
    title: {
      background: prismTheme.plain.backgroundColor
    },
    subtitle: {
      color: "#d6deeb",
      background: "rgba(10,10,10,0.9)"
    },
    pre: {
      color: prismTheme.plain.color,
      background: prismTheme.plain.backgroundColor
    },
    code: {
      color: prismTheme.plain.color,
      background: prismTheme.plain.backgroundColor
    },
    ...override
  };
}
