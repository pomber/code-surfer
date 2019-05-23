import React from "react";

// TODO remove this after https://github.com/jxnblk/mdx-deck/pull/359
import { useTheme } from "./use-theme";

function useTokenStyles() {
  const theme = useTheme();

  const themeStylesByType = React.useMemo(() => {
    const themeStylesByType = Object.create(null);
    // TODO check theme.codeSurfer is defined or use default
    theme.codeSurfer.styles.forEach(({ types, style }) => {
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
    () => token => {
      return themeStylesByType[token.type] || {};
    },
    [themeStylesByType]
  );

  return getStyleForToken;
}

function usePreStyle() {
  const theme = useTheme();
  return {
    color: theme.colors.pre || "inherit",
    background: theme.colors.preBackground || "inherit"
  };
}

function useContainerStyle() {
  const theme = useTheme();
  return {
    color: theme.colors.text || "inherit",
    background: theme.colors.background || "inherit"
  };
}

function useTitleStyle() {
  const theme = useTheme();
  const base = {
    position: "absolute",
    top: 0,
    width: "100%",
    margin: 0,
    padding: "1em 0"
  };
  const style = (theme.codeSurfer && theme.codeSurfer.title) || {};
  return { ...base, ...style };
}

function useSubtitleStyle() {
  const theme = useTheme();
  const base = {
    position: "absolute",
    bottom: 0,
    width: "calc(100% - 2em)",
    boxSizing: "border-box",
    margin: "0.3em 1em",
    padding: "0.5em",
    background: "rgba(2,2,2,0.9)"
  };
  const style = (theme.codeSurfer && theme.codeSurfer.subtitle) || {};
  return { ...base, ...style };
}

export {
  useTokenStyles,
  usePreStyle,
  useContainerStyle,
  useSubtitleStyle,
  useTitleStyle
};
