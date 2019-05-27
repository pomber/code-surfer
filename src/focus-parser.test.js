import { parseFocus } from "./focus-parser";

describe("Parsing Focus String", () => {
  it("return null when string is empty", () => {
    expect(parseFocus("")).toBeNull();
    expect(parseFocus(null)).toBeNull();
  });
});
