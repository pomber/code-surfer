import { parseMetastring } from "../src/codeblock-metastring-parser";

/**
 * The metastring is the thing that comes after the language in markdown codeblocks
 *
 * ```js this is the metastring
 * code goes here
 * ```
 */

describe("Parsing Codeblock Metastring", () => {
  it("return empty object when metastring is empty", () => {
    expect(parseMetastring(undefined)).toEqual({});
    expect(parseMetastring(null)).toEqual({});
    expect(parseMetastring("")).toEqual({});
    expect(parseMetastring("     ")).toEqual({});
  });

  it("return focus by default", () => {
    expect(parseMetastring("12:20")).toEqual({ focus: "12:20" });
  });

  it("return any string property", () => {
    expect(parseMetastring("title=foo")).toEqual({ title: "foo" });
  });

  it("return properties with spaces", () => {
    expect(parseMetastring(`title="foo bar"`)).toEqual({
      title: "foo bar"
    });
  });

  it("return properties containing the equals sign", () => {
    expect(parseMetastring(`title="foo=bar"`)).toEqual({
      title: "foo=bar"
    });
  });

  it("return properties with quotes", () => {
    expect(parseMetastring(`title="foo \\"bar"`)).toEqual({
      title: `foo "bar`
    });
  });
});
