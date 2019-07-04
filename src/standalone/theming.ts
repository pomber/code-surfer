import React from "react";

import { default as base } from "./themes";
import { CodeSurferTheme, Token } from "code-surfer-types";

export const ThemeContext = React.createContext<CodeSurferTheme | null>(null);

function useSafeTheme() {
  const contextTheme = React.useContext(ThemeContext);

  const theme = contextTheme || base;

  return theme;
}

function useTokenStyles() {
  const theme = useSafeTheme();

  const themeStylesByType = React.useMemo(() => {
    const themeStylesByType: {
      [type: string]: React.CSSProperties;
    } = Object.create(null);

    const styles = theme.styles;
    styles.forEach(({ types, style }) => {
      types.forEach(type => {
        themeStylesByType[type] = Object.assign(
          themeStylesByType[type] || {},
          style
        );
      });
    });
    return themeStylesByType;
  }, [theme]);

  const getStyleForToken = React.useMemo(
    () => (token: Token) => {
      return themeStylesByType[token.type] || {};
    },
    [themeStylesByType]
  );

  return getStyleForToken;
}

function usePreStyle() {
  const theme = useSafeTheme();
  return theme.pre || {};
}
function useCodeStyle() {
  const theme = useSafeTheme();
  return theme.code || {};
}

function useContainerStyle() {
  const theme = useSafeTheme();
  return theme.container || {};
}

function useTitleStyle() {
  const theme = useSafeTheme();
  const base = {
    position: "absolute" as "absolute",
    top: 0,
    width: "100%",
    margin: 0,
    padding: "1em 0"
  };
  const style = theme.title || {};
  return { ...base, ...style };
}

function useSubtitleStyle() {
  const theme = useSafeTheme();
  const base = {
    position: "absolute" as "absolute",
    bottom: 0,
    width: "calc(100% - 2em)",
    boxSizing: "border-box" as "border-box",
    margin: "0.3em 1em",
    padding: "0.5em",
    background: "rgba(2,2,2,0.9)"
  };
  const style = theme.subtitle || {};
  return { ...base, ...style };
}

export {
  useTokenStyles,
  usePreStyle,
  useCodeStyle,
  useContainerStyle,
  useSubtitleStyle,
  useTitleStyle
};
