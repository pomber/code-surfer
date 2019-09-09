import { tween, chain, exitLine, enterLine } from "./animation";
import { table } from "table";
import easing from "./easing";

test("Tween Easing", () => {
  const ts = Array(21)
    .fill(0)
    .map((_, i) => i / 20);

  const from = 10;
  const to = 20;

  const data = ts.map(t => {
    return [
      t,
      tween(from, to, t, easing.linear),
      tween(from, to, t, easing.easeInQuad),
      tween(from, to, t, easing.easeOutQuad),
      tween(from, to, t, easing.easeInOutQuad)
    ];
  });

  expect(
    toTable(
      data,
      ["t", "Linear", "In Quad", "Out Quad", "In Out Quad"],
      [, 5, 5, 5, 5]
    )
  ).toMatchSnapshot();
});

test("Chain", () => {
  const ts = Array(21)
    .fill(0)
    .map((_, i) => i / 20);

  const animation = chain([
    [0.5, (t: number) => ({ x: t, y: undefined })],
    [0.75, undefined],
    [1, (t: number) => ({ y: t, x: undefined })]
  ]);

  const data = ts.map(t => {
    const { x, y } = animation(t);
    return [t, x, y];
  });

  expect(toTable(data, ["t", "x", "y"], [, 6, 6])).toMatchSnapshot();
});

test("Line Exit", () => {
  const ts = Array(21)
    .fill(0)
    .map((_, i) => i / 20);

  const animation = exitLine(0.8, 100);
  const data = ts.map(t => {
    const { transform, height, opacity } = animation(t);
    return [t, transform, height, opacity];
  });

  expect(
    toTable(data, ["t", "transform", "height", "opacity"], [, 20, 6, 6])
  ).toMatchSnapshot();
});

test("Line Enter", () => {
  const ts = Array(21)
    .fill(0)
    .map((_, i) => i / 20);

  const animation = enterLine(0.8, 100);
  const data = ts.map(t => {
    const { transform, height, opacity } = animation(t);
    return [t, transform, height, opacity];
  });

  expect(
    toTable(data, ["t", "transform", "height", "opacity"], [, 20, 6, 6])
  ).toMatchSnapshot();
});

function toTable(data: any[][], hr: string[], truncate: number[] = []) {
  const config = {
    drawHorizontalLine: (index, size) => {
      return index === 0 || index === 1 || index === size;
    }
  };

  const newData = data.map((row, rowi) =>
    row.map((value, coli) =>
      truncate[coli]
        ? (value == null ? "" : value).toString().slice(0, truncate[coli])
        : value
    )
  );

  return "\n" + table([hr, ...newData], config);
}
