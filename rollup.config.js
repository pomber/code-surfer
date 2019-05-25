import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import svgr from "@svgr/rollup";

import pkg from "./package.json";
import themesPkg from "./themes/package.json";

const plugins = [
  external(),
  postcss({
    modules: true
  }),
  url(),
  svgr(),
  babel({
    exclude: "node_modules/**",
    plugins: ["external-helpers"]
  }),
  resolve(),
  commonjs()
];
export default [
  {
    input: "themes/src/index.js",
    output: [
      {
        file: "themes/" + themesPkg.main,
        format: "cjs",
        sourcemap: true
      },
      {
        file: "themes/" + themesPkg.module,
        format: "es",
        sourcemap: true
      }
    ],
    plugins
  },
  {
    input: "src/index.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true
      },
      {
        file: pkg.module,
        format: "es",
        sourcemap: true
      }
    ],
    plugins
  }
];
