import {
  tween,
  chain,
  exitLine,
  enterLine,
  stagger,
  fadeInFocus
} from "./animation";
import { table, TableUserConfig } from "table";
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

  const animation = chain<{ x?: number; y?: number }>([
    [0.5, (t: number) => ({ x: t })],
    [0.75, undefined],
    [1, (t: number) => ({ y: t })]
  ]);

  const data = ts.map(t => {
    const { x, y } = animation(t);
    return [t, x, y];
  });

  expect(toTable(data, ["t", "x", "y"], [, 6, 6])).toMatchSnapshot();
});

test("Stagger", () => {
  const ts = Array(21)
    .fill(0)
    .map((_, i) => i / 20);

  const animation = (t: number) => tween(0, 100, t);

  const data = ts.map(t => {
    return [
      t,
      stagger(animation, 0, 3)(t),
      stagger(animation, 1, 3)(t),
      stagger(animation, 2, 3)(t)
    ];
  });

  expect(toTable(data, ["t", "s0", "s1", "s2"], [, 6, 6, 6])).toMatchSnapshot();
});

test("Fade In Focus", () => {
  const ts = Array(21)
    .fill(0)
    .map((_, i) => i / 20);

  const data = ts.map(t => {
    return [
      t,
      fadeInFocus(0, 1, 0, 3)(t).opacity,
      fadeInFocus(0, 1, 1, 3)(t).opacity,
      fadeInFocus(0, 1, 2, 3)(t).opacity
    ];
  });

  expect(toTable(data, ["t", "s0", "s1", "s2"], [, 6, 6, 6])).toMatchSnapshot();
});

test("Line Exit", () => {
  const ts = Array(21)
    .fill(0)
    .map((_, i) => i / 20);

  const animation = exitLine(0.8, 0, 0, 1, 100);
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

  const animation = enterLine(0, 0.8, 0, 1, 100);
  const data = ts.map(t => {
    const { transform, height, opacity } = animation(t);
    return [t, transform, height, opacity];
  });

  expect(
    toTable(data, ["t", "transform", "height", "opacity"], [, 20, 6, 6])
  ).toMatchSnapshot();
});

function toTable(
  data: any[][],
  hr: string[],
  truncate: (number | undefined)[] = []
) {
  const config: TableUserConfig = {
    drawHorizontalLine: (index, size) => {
      return index === 0 || index === 1 || index === size;
    }
  };

  const newData = data.map(row =>
    row.map((value, coli) =>
      truncate[coli]
        ? (value == null ? "" : value).toString().slice(0, truncate[coli])
        : value
    )
  );

  return "\n" + table([hr, ...newData], config);
}
