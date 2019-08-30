import { parseFocus } from "../src/standalone/focus-parser";

describe("Parsing Focus String", () => {
  it("it throws when string is empty", () => {
    expect(() => parseFocus("")).toThrow();
    expect(() => parseFocus(null)).toThrow();
  });

  it("works with single lines", () => {
    const focus = "1";
    const result = parseFocus(focus);
    expect(result.get(0)).toBeTruthy();
  });

  it("works with lists", () => {
    const focus = "1,5";
    const result = parseFocus(focus);
    expect(result.get(0)).toBeTruthy();
    expect(result.get(2)).toBeFalsy();
    expect(result.get(4)).toBeTruthy();
  });

  it("works with ranges", () => {
    const focus = "2:5";
    const result = parseFocus(focus);
    expect(result.get(0)).toBeFalsy();
    expect(result.get(1)).toBeTruthy();
    expect(result.get(2)).toBeTruthy();
    expect(result.get(4)).toBeTruthy();
    expect(result.get(5)).toBeFalsy();
  });

  it("works with lists and ranges", () => {
    const focus = "1,4:5,6,8";
    const result = parseFocus(focus);
    expect(result.get(0)).toBeTruthy();
    expect(result.get(3)).toBeTruthy();
    expect(result.get(4)).toBeTruthy();
    expect(result.get(5)).toBeTruthy();
    expect(result.get(7)).toBeTruthy();
  });

  it("works with single column", () => {
    const focus = "1[5]";
    const result = parseFocus(focus);
    expect(result.get(0)).toEqual([4]);
  });

  it("works with column range", () => {
    const focus = "1[5:7],3[1:2]";
    const result = parseFocus(focus);
    expect(result.get(0)).toEqual([4, 5, 6]);
    expect(result.get(2)).toEqual([0, 1]);
  });

  it("works with column list and range", () => {
    const focus = "1[5:7,10,12:13],3[1:2],5:6";
    const result = parseFocus(focus);
    expect(result.get(0)).toEqual([4, 5, 6, 9, 11, 12]);
    expect(result.get(2)).toEqual([0, 1]);
    expect(result.get(4)).toBeTruthy();
    expect(result.get(5)).toBeTruthy();
  });

  it("throws when string is invalid", () => {
    const runParseFocus = v => () => parseFocus(v);
    expect(runParseFocus("foo")).toThrow();
    expect(runParseFocus("12:foo")).toThrow();
    expect(runParseFocus("1,2,3[4,-10]")).toThrow();
    expect(runParseFocus("0:10")).toThrow();
  });
});
