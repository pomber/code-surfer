import { parse } from "shell-quote";

/**
 * The metastring is the thing that comes after the language in markdown codeblocks
 *
 * ```js this is the metastring
 * code goes here
 * ```
 */

export function parseMetastring(metastring) {
  if (!metastring) {
    return {};
  }

  const argv = parse(metastring);

  const result = {};
  argv.forEach(arg => {
    if (!arg.includes("=")) {
      result.focus = arg;
    } else {
      const [key, value] = arg.split(/=(.*)/);
      result[key] = { value };
    }
  });
  return result;
}
