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

function createContextFromParent(parent, selector) {
  const ctx = {
    _prev: () => {
      const prevParent = parent._prev();
      return prevParent && selector(prevParent);
    },
    _next: () => {
      const nextParent = parent._next();
      return nextParent && selector(nextParent);
    },
    _t: () => parent._t(),
    select: f => {
      return createContextFromParent(ctx, f);
    },
    current: () => {
      return selector(parent.current());
    },
    useAnimation: (animation, config = {}) => {
      const prev = ctx._prev();
      const next = ctx._next();
      if (config.when && !config.when(prev, next)) {
        return {};
      }
      const t = ctx._t();
      return animation(prev, next, t);
    },
    useAnimations: (animations, start) => {
      const results = animations.map(({ animation, ...config }) =>
        ctx.useAnimation(animation, config)
      );
      return merge(results);
    },
    map: fn => {
      const prevs = ctx._prev();
      const nexts = ctx._next();
      if (!Array.isArray(prevs || nexts)) {
        throw new Error("Map is only possible in array's contexts");
      }

      const itemsByKey = new Map();
      (prevs || []).forEach(prev => {
        itemsByKey.set(prev.key, { prev });
      });
      (nexts || []).forEach(next => {
        const { prev } = itemsByKey.get(next.key) || {};
        itemsByKey.set(next.key, { prev, next });
      });

      let keys = [...itemsByKey.keys()];
      keys.sort((a, b) => a - b);
      return keys.map((key, i) =>
        fn({ key, ctx: ctx.select(c => c.find(x => x.key === key)) }, i)
      );
    }
  };
  return ctx;
}

export function useAnimationContext(items, playhead) {
  const ctx = {
    select: f => {
      return createContextFromParent(ctx, f);
    },
    current: () => {
      const index = Math.floor(playhead);
      return items[index];
    },
    useAnimation: (animation, config = {}) => {
      const prev = ctx._prev();
      const next = ctx._next();
      const t = ctx._t();
      return animation(prev, next, t);
    },
    useAnimations: animations => {
      throw new Error("not implemented");
    },
    map: fn => {
      const current = ctx.current();
      if (!Array.isArray(current)) {
        throw new Error("Map is only possible in array's contexts");
      }
      return current.map((item, i) =>
        fn({ key: item.key, ctx: ctx.select(c => c[i]) }, i)
      );
    },
    _prev: () => items[Math.floor(playhead)],
    _next: () => items[Math.floor(playhead) + 1],
    _t: () => playhead % 1
  };
  return ctx;
}
