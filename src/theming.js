import React from "react";

// TODO remove this after https://github.com/jxnblk/mdx-deck/pull/359
import { useTheme } from "./use-theme";
import { default as base } from "../themes";

function useSafeTheme() {
  const unsafeTheme = useTheme();
  return unsafeTheme.codeSurfer
    ? unsafeTheme
    : { ...unsafeTheme, codeSurfer: base.codeSurfer };
}

function useTokenStyles() {
  const theme = useSafeTheme();

  const themeStylesByType = React.useMemo(() => {
    const themeStylesByType = Object.create(null);

    const styles = theme.codeSurfer.styles;
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
    () => token => {
      return themeStylesByType[token.type] || {};
    },
    [themeStylesByType]
  );

  return getStyleForToken;
}

function usePreStyle() {
  const theme = useSafeTheme();
  return theme.codeSurfer.pre || {};
}
function useCodeStyle() {
  const theme = useSafeTheme();
  return theme.codeSurfer.code || {};
}

function useContainerStyle() {
  const theme = useSafeTheme();
  return theme.codeSurfer.container || {};
}

function useTitleStyle() {
  const theme = useSafeTheme();
  const base = {
    position: "absolute",
    top: 0,
    width: "100%",
    margin: 0,
    padding: "1em 0"
  };
  const style = theme.codeSurfer.title || {};
  return { ...base, ...style };
}

function useSubtitleStyle() {
  const theme = useSafeTheme();
  const base = {
    position: "absolute",
    bottom: 0,
    width: "calc(100% - 2em)",
    boxSizing: "border-box",
    margin: "0.3em 1em",
    padding: "0.5em",
    background: "rgba(2,2,2,0.9)"
  };
  const style = theme.codeSurfer.subtitle || {};
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
