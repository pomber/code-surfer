/** @jsx jsx */
import { ThemeProvider, jsx, useThemeUI, SxStyleProp } from "theme-ui";
import baseTheme from "./themes/base";
import React from "react";

type CodeSurferStyles = {
  title: SxStyleProp;
  subtitle: SxStyleProp;
  code: SxStyleProp;
  pre: SxStyleProp;
  tokens: Record<string, SxStyleProp>;
};

function StylesProvider({ theme = {}, children }) {
  const { theme: outer } = useThemeUI();
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

function useTokenStyle(tokenType: string): SxStyleProp {
  const theme = useStyles();

  const tokenStyles = React.useMemo(() => {
    const tokenStyles: Record<string, SxStyleProp> = {};
    Object.keys(theme.tokens).forEach(key =>
      key.split(/\s/).forEach(type => {
        tokenStyles[type] = theme.tokens[key];
      })
    );
    return tokenStyles;
  }, [theme]);

  return tokenStyles[tokenType];
}

const baseTitle = {
  position: "absolute" as "absolute",
  top: 0,
  width: "100%",
  margin: 0,
  padding: "1em 0",
  textAlign: "center"
};

const baseSubtitle = {
  position: "absolute" as "absolute",
  bottom: 0,
  width: "calc(100% - 2em)",
  boxSizing: "border-box" as "border-box",
  margin: "0.3em 1em",
  padding: "0.5em",
  background: "rgba(2,2,2,0.9)",
  textAlign: "center"
};

const Styled = {
  Code: props => <code {...props} sx={useStyles().code} />,
  Pre: React.forwardRef(
    (
      props: React.PropsWithChildren<any>,
      ref: React.MutableRefObject<HTMLPreElement>
    ) => <pre {...props} sx={useStyles().pre} ref={ref} />
  ),
  Title: props => <h4 {...props} sx={{ ...baseTitle, ...useStyles().title }} />,
  Subtitle: props => (
    <p {...props} sx={{ ...baseSubtitle, ...useStyles().subtitle }} />
  ),
  Token: ({ tokenType, ...props }) => (
    <span {...props} sx={useTokenStyle(tokenType)} />
  )
};

export { StylesProvider, Styled };
