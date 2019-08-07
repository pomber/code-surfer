import Presenter from "./presenter";
import {
  dracula as draculaTheme,
  duotoneLight as duotoneLightTheme,
  duotoneDark as duotoneDarkTheme,
  github as githubTheme,
  nightOwl as nightOwlTheme,
  oceanicNext as oceanicNextTheme,
  shadesOfPurple as shadesOfPurpleTheme,
  ultramin as ultraminTheme,
  vsDark as vsDarkTheme
} from "./standalone/themes";

function mdThemes(theme) {
  // const stringStyle = theme.styles.find(s => s.types.includes("string"));

  // const color = theme.pre.color;
  // const bg = theme.pre.background;

  // return [
  //   { codeSurfer: theme },
  //   {
  //     colors: {
  //       text: color,
  //       background: bg,
  //       link: stringStyle && stringStyle.style.color,
  //       pre: color,
  //       code: color,
  //       preBackground: bg
  //     },
  //     Presenter,
  //     codeSurfer: theme
  //   }
  // ];
  return [theme, theme];
}

const [draculaPartial, dracula] = mdThemes(draculaTheme);
const [duotoneLightPartial, duotoneLight] = mdThemes(duotoneLightTheme);
const [duotoneDarkPartial, duotoneDark] = mdThemes(duotoneDarkTheme);
const [githubPartial, github] = mdThemes(githubTheme);
const [nightOwlPartial, nightOwl] = mdThemes(nightOwlTheme);
const [oceanicNextPartial, oceanicNext] = mdThemes(oceanicNextTheme);
const [shadesOfPurplePartial, shadesOfPurple] = mdThemes(shadesOfPurpleTheme);
const [ultraminPartial, ultramin] = mdThemes(ultraminTheme);
const [vsDarkPartial, vsDark] = mdThemes(vsDarkTheme);

export {
  dracula,
  draculaPartial,
  duotoneLight,
  duotoneLightPartial,
  duotoneDark,
  duotoneDarkPartial,
  github,
  githubPartial,
  nightOwl,
  nightOwlPartial,
  oceanicNext,
  oceanicNextPartial,
  shadesOfPurple,
  shadesOfPurplePartial,
  ultramin,
  ultraminPartial,
  vsDark,
  vsDarkPartial
};
