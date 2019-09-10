import { CodeSurferStyles } from "../styles";
import { SxStyleProp } from "theme-ui";

type StyleItem = {
  types: string[];
  style: SxStyleProp;
};

export type PrismTheme = {
  plain: { color: string; backgroundColor: string };
  styles: StyleItem[];
};

export function makeTheme(
  prismTheme: PrismTheme,
  override: Partial<CodeSurferStyles> = {}
): { styles: { CodeSurfer: CodeSurferStyles } } {
  const tokens = {} as Record<string, SxStyleProp>;
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
