import easing from "./easing";
const MULTIPLY = "multiply";

/* eslint-disable */
function mergeResults(results, composite) {
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

const playhead = {
  tween: (props, context) => t => {
    const { from, to, ease = easing.linear } = props;

    const style = {};
    Object.keys(from).forEach(key => {
      const value = from[key] + (to[key] - from[key]) * ease(t);
      if (key === "x") {
        style["transform"] = `translateX(${value}px)`;
      } else {
        style[key] = value;
      }
    });

    return style;
  },
  chain: ({ children: fns, durations }, ctx) => {
    return (t, ...args) => {
      let style = run(fns[0], 0, ctx);
      let lowerDuration = 0;
      for (let i = 0; i < fns.length; i++) {
        const fn = fns[i];
        const thisDuration = durations[i];
        const upperDuration = lowerDuration + thisDuration;
        if (lowerDuration <= t && t <= upperDuration) {
          const innerT = (t - lowerDuration) / thisDuration;
          style = mergeResults([style, run(fn, innerT, ctx)]);
        } else if (upperDuration < t) {
          // merge the end of previous animation
          style = mergeResults([style, run(fn, 1, ctx)]);
        } else if (t < lowerDuration) {
          // merge the start of future animation
          style = mergeResults([run(fn, 0, ctx), style]);
        }
        lowerDuration = upperDuration;
      }
      return style;
    };
  },
  delay: () => () => ({}),
  parallel: ({ children: fns }, ctx) => {
    return t => {
      const styles = fns.map(fn => run(fn, t, ctx));
      const result = mergeResults(styles, MULTIPLY);
      return result;
    };
  },
  list: ({ forEach: items, children }, ctx) => t => {
    const mapper = children[0];
    const results = items.map(mapper);
    return results.map(element => run(element, t, ctx));
  }
};

export function createAnimation(type, config, ...children) {
  const props = { ...config, children };
  return {
    type: typeof type === "string" ? playhead[type] : type,
    props
  };
}

/* @jsx createAnimation */
export const Stagger = (props, ctx) => t => {
  const targets = props.targets;
  const filter = target => !props.filter || props.filter(target);
  const interval =
    targets.filter(filter).length < 2
      ? 0
      : props.interval / (targets.filter(filter).length - 1);
  let i = 0;
  return targets.map(target => {
    // console.log(target, props.filter(target));
    if (!filter(target)) {
      return {};
    }
    const animation = (
      <parallel>
        <chain durations={[i * interval, 1 - props.interval]}>
          <delay />
          {props.children[0]}
        </chain>
      </parallel>
    );
    i++;
    const result = run(animation, t, ctx);
    // console.log("Stagger Result", t, result);
    return result;
  });
};

export function Context() {
  throw Error("shouldnt run Context");
}

export function run(node, t, context = {}) {
  if (node.type === Context) {
    const { children, ...patch } = node.props;
    const newContext = { ...context, ...patch };
    return run(children[0], t, newContext);
  }

  const result = node.type(node.props, context);
  if (result.type) {
    return run(result, t, context);
  } else {
    return result(t);
  }
}
