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
    background: theme.colors.preBackround || "inherit"
  };
}

function useContainerStyle() {
  const theme = useTheme();
  return {
    color: theme.colors.text || "inherit",
    background: theme.colors.background || "inherit"
  };
}

export { useTokenStyles, usePreStyle, useContainerStyle };
