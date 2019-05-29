import React from "react";
import Tuple from "./tuple";

function context(tuple, t) {
  const ctx = {
    useSelect: selector => {
      const newTuple = React.useMemo(() => tuple.select(selector), [tuple]);
      return context(newTuple, t);
    },
    map: mapper =>
      tuple.map((childTuple, key) => mapper(context(childTuple, t), key)),
    animate: (animation, config = {}) => {
      const [prev, next] = tuple.spread();
      if (config.when && !config.when(prev, next)) {
        return {};
      }
      return animation(prev, next, t);
    },
    animations: animations => {
      const results = animations.map(({ animation, ...config }) =>
        ctx.animate(animation, config)
      );
      return merge(results);
    }
  };
  return ctx;
}

export function useAnimationContext(items, playhead) {
  const prev = items[Math.floor(playhead)];
  const next = items[Math.floor(playhead) + 1];
  const tuple = React.useMemo(() => new Tuple(prev, next), [prev, next]);
  return context(tuple, playhead % 1);
}

const MULTIPLY = "multiply";

function merge(results, composite = MULTIPLY) {
  const firstResult = results[0];
  if (results.length < 2) {
    return firstResult;
  }
  if (Array.isArray(firstResult)) {
    return firstResult.map((_, i) => {
      return mergeResults(results.map(result => result[i]), composite);
    });
  } else {
    const merged = Object.assign({}, ...results);

    if (composite === MULTIPLY) {
      const opacities = results.map(x => x.opacity).filter(x => x != null);
      if (opacities.length !== 0) {
        merged.opacity = opacities.reduce((a, b) => a * b);
      }
    }
    return merged;
  }
}
