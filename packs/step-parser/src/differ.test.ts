import { linesDiff, generateIds } from "./differ";

describe("generate line ids", () => {
  it("works with empty array", () => {
    const ids: number[] = [];
    const newIds = generateIds(ids, undefined, 1);
    expect(newIds).toEqual([0.5]);
    expect(ids).toEqual([0.5]);
  });
  it("works with empty array and several new", () => {
    const ids: number[] = [];
    const newIds = generateIds(ids, undefined, 3);
    expect(newIds).toEqual([0.25, 0.5, 0.75]);
    expect(ids).toEqual([0.25, 0.5, 0.75]);
  });
  it("works before existing ids", () => {
    const ids = [0.5];
    const newIds = generateIds(ids, undefined, 3);
    expect(newIds).toEqual([0.125, 0.25, 0.375]);
    expect(ids).toEqual([0.125, 0.25, 0.375, 0.5]);
  });
  it("works after existing ids", () => {
    const ids = [0.5];
    const newIds = generateIds(ids, 0.5, 3);
    expect(newIds).toEqual([0.625, 0.75, 0.875]);
    expect(ids).toEqual([0.5, 0.625, 0.75, 0.875]);
  });
  it("works between existing ids", () => {
    const ids = [0.2, 0.6];
    const newIds = generateIds(ids, 0.2, 3);
    expect(newIds).toEqual([0.3, 0.4, 0.5]);
    expect(ids).toEqual([0.2, 0.3, 0.4, 0.5, 0.6]);
  });
});

describe("differ", () => {
  it("works", () => {
    const codes = [
      `
  console.log(1)
  console.log(2)
  console.log(3)
    `.trim(),
      `
  console.log(1)
  console.log(4)
      `.trim(),
      `
  console.log(1)
  console.log(3)
  console.log(4)
        `.trim(),
      `
  console.log(1)
  console.log(3)
  console.log(4)
          `.trim()
    ];
    expect(linesDiff(codes)).toMatchSnapshot();
  });

  it("works with empty old code", () => {
    const codes = [
      ``,
      `
  console.log(1)
  console.log(4)
      `.trim(),
      ``
    ];
    expect(linesDiff(codes)).toMatchSnapshot();
  });

  it("works when last line changes", () => {
    const codes = [
      `
  console.log(1)
      `.trim(),
      `
  console.log(1)
  console.log(4)
      `.trim()
    ];
    expect(linesDiff(codes)).toMatchSnapshot();
  });

  it("works ?", () => {
    const codes = [
      `var x1 = 1

console.log(x1)
debugger

`,
      ""
    ];
    expect(linesDiff(codes)).toMatchSnapshot();
  });
});
