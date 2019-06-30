import React from "react";
import { Tuple } from "./tuple";

function context<T>(tuple: Tuple<T>, t: number, parentCtx = null) {
  const ctx = {
    useSelect: selector => {
      const newTuple = React.useMemo(() => tuple.select(selector), [tuple]);
      return context(newTuple, t, ctx);
    },
    useSelectMany: selector => {
      const newTuple = React.useMemo(() => tuple.selectMany(selector), [tuple]);
      return context(newTuple, t, ctx);
    },
    map: mapper =>
      tuple.map((childTuple, key) => mapper(context(childTuple, t, ctx), key)),
    animate: (animation, config = {} as any) => {
      const [prev, next] = tuple.spread();

      if (config.when && !config.when(prev, next)) {
        return {};
      }

      let staggeredT = t;

      if (config.stagger) {
        const items = parentCtx
          .map(childCtx => {
            const [prevChild, nextChild] = childCtx.spread();
            if (!config.when(prevChild, nextChild)) {
              return null;
            }
            return {
              isThisChild: prevChild === prev && nextChild === next
            };
          })
          .filter(x => x != null);

        const N = items.length;
        if (N > 1) {
          const currentIndex = items.findIndex(x => x.isThisChild);
          const duration = 1 - config.stagger;
          const tick = config.stagger / (N - 1);
          staggeredT = Math.min(
            1,
            Math.max(0, (t - currentIndex * tick) / duration)
          );
        }
      }

      return animation(prev, next, staggeredT);
    },
    animations: animations => {
      const results = animations.map(({ animation, ...config }) =>
        ctx.animate(animation, config)
      );
      return merge(results);
    },
    spread: () => tuple.spread()
  };
  return ctx;
}

export function useAnimationContext<T>(items: T[], playhead: number) {
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
      return merge(results.map(result => result[i]), composite);
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
