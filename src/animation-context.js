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
    useAnimation: (animation, config) => {
      const prev = ctx._prev();
      const next = ctx._next();
      const t = ctx._t();
      return animation(prev, next, t);
    },
    map: fn => {
      const current = ctx.current();
      if (!Array.isArray(current)) {
        throw new Error("Map is only possible in array's contexts");
      }
      return current.map((item, i) =>
        fn({ key: item.key, ctx: ctx.select(c => c[i]) }, i)
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
      const index = Math.round(playhead);
      return items[index];
    },
    useAnimation: (animation, config) => {
      const prev = ctx._prev();
      const next = ctx._next();
      const t = ctx._t();
      return animation(prev, next, t);
    },
    useAnimations: animations => {},
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
    _next: () => items[Math.ceil(playhead)],
    _t: () => playhead % 1
  };
  return ctx;
}
