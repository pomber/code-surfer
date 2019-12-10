import { tokenize, MissingGrammarError } from "./tokenizer";

describe("tokenizer", () => {
  it("works", () => {
    const tokens = tokenize(
      `
console.log(1)
function x() {
  return "foo"
}
    `.trim(),
      "javascript"
    );
    expect(tokens).toMatchSnapshot();
  });

  it("throws the correct error", () => {
    const action = () => tokenize(`foo bar`.trim(), "foolang");
    expect(action).toThrowError(MissingGrammarError);
  });
});
