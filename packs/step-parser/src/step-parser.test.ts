import { parseSteps } from "./step-parser";

describe("Parsing steps", () => {
  it("works", () => {
    const steps = [
      {
        code: `
console.log(1)
console.log(2)
console.log(3)
      `.trim(),
        lang: "javascript",
        focus: "1,2"
      },
      {
        code: `
console.log(1)
console.log(3)
      `.trim(),
        lang: "javascript",
        focus: "1[3:5],2"
      }
    ];
    const result = parseSteps(steps);
    expect(result).toMatchSnapshot();
  });

  it("adds default focus", () => {
    const steps = [
      {
        code: `
console.log(1)
console.log(2)
console.log(3)
      `.trim(),
        lang: "javascript"
      },
      {
        code: `
console.log(1)
console.log(3)
console.log(4)
      `.trim()
      }
    ];
    const result = parseSteps(steps);
    expect(result).toMatchSnapshot();
  });

  it.only("works with empty diff", () => {
    const steps = [
      {
        code: `
console.log(1)
console.log(2)
console.log(3)
      `.trim(),
        lang: "javascript"
      },
      {
        code: ``,
        lang: "diff"
      }
    ];
    const result = parseSteps(steps);
    expect(result).toMatchSnapshot();
  });
});
