import { ThemeContext } from "@emotion/core";
import React from "react";

// TODO remove this after https://github.com/jxnblk/mdx-deck/pull/359

function useTheme() {
  return React.useContext(ThemeContext);
}

export { useTheme };
