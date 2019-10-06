/** @jsx jsx */
import { ThemeProvider, jsx, useThemeUI, SxStyleProp } from "theme-ui";
import { theme as baseTheme } from "./theme.base";
import { CodeSurferTheme, CodeSurferStyles } from "./utils";
import React from "react";

function StylesProvider({
  theme = {},
  children
}: {
  theme?: CodeSurferTheme;
  children: React.ReactNode;
}) {
  const outer = useThemeUI().theme || {};

  const base = {
    ...baseTheme,
    ...outer,
    styles: {
      ...baseTheme.styles,
      ...outer.styles
    }
  };

  return (
    <ThemeProvider theme={base}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeProvider>
  );
}

function useStyles(): CodeSurferStyles {
  const { theme } = useThemeUI();
  return (theme as any).styles.CodeSurfer;
}

function getClassFromTokenType(type: string) {
  return "token-" + type;
}

function usePreStyle() {
  const styles = useStyles();
  const preSx = React.useMemo(() => {
    const sx = {
      ...styles.pre
    };
    Object.keys(styles.tokens).forEach(key => {
      const classList = key
        .split(/\s/)
        .map(type => "." + getClassFromTokenType(type))
        .join(", ");
      sx[classList] = styles.tokens[key];
    });
    return sx;
  }, [styles]);
  return preSx;
}

const baseTitle: SxStyleProp = {
  position: "absolute" as "absolute",
  top: 0,
  width: "100%",
  margin: 0,
  padding: "1em 0",
  textAlign: "center"
};

const baseSubtitle: SxStyleProp = {
  position: "absolute" as "absolute",
  bottom: 0,
  width: "calc(100% - 2em)",
  boxSizing: "border-box" as "border-box",
  margin: "0.3em 1em",
  padding: "0.5em",
  background: "rgba(2,2,2,0.9)",
  textAlign: "center"
};

type HTMLProps<T> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>;

const Styled = {
  Placeholder: () => {
    return (
      <div
        sx={{
          height: "100%",
          width: "100%",
          backgroundColor: useStyles().pre.backgroundColor as string
        }}
      />
    );
  },
  Code: (props: HTMLProps<HTMLElement>) => (
    <code {...props} sx={useStyles().code} />
  ),
  Pre: React.forwardRef(
    (props: HTMLProps<HTMLPreElement>, ref: React.Ref<HTMLPreElement>) => (
      <pre {...props} sx={usePreStyle()} ref={ref} />
    )
  ),
  Title: (props: HTMLProps<HTMLHeadingElement>) => (
    <h4 {...props} sx={{ ...baseTitle, ...useStyles().title }} />
  ),
  Subtitle: (props: HTMLProps<HTMLParagraphElement>) => (
    <p {...props} sx={{ ...baseSubtitle, ...useStyles().subtitle }} />
  )
};

function useUnfocusedStyle() {
  return useStyles().unfocused || { opacity: 0.3 };
}
export { StylesProvider, Styled, getClassFromTokenType, useUnfocusedStyle };
