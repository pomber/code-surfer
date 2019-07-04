import Component, * as allThemes from "code-surfer/dist/standalone.esm";

/**
 * @typedef { import("code-surfer/dist/standalone/code-surfer").default } CodeSurferComponent
 * @typedef { import("code-surfer/dist/standalone/themes") } AllThemes
 */

/** @type {CodeSurferComponent} */
const CodeSurfer = Component;

/** @type {AllThemes} */
const themes = allThemes;
export { themes, CodeSurfer };
