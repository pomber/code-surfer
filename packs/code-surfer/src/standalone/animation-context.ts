import React from "react";
import { Tuple, ArrayTuple } from "./tuple";
import { AnimationAndConfig, AnimationConfig, Animation } from "playhead-types";

export class Context<T> {
  tuple: Tuple<T>;
  t: number;
  parent: ListContext<T> | undefined;

  constructor(tuple: Tuple<T>, t: number, parent?: ListContext<T>) {
    this.tuple = tuple;
    this.t = t;
    this.parent = parent;
  }

  useSelect<S>(selector: (x: T) => S) {
    const newTuple = React.useMemo(() => this.tuple.select(selector), [
      this.tuple
    ]);
    return new Context(newTuple, this.t);
  }

  useSelectMany<S extends { key?: any }>(
    selector: (x: T) => S[]
  ): ListContext<S> {
    const newTuple = React.useMemo(() => this.tuple.selectMany(selector), [
      this.tuple
    ]);

    return new ListContext(newTuple, this.t);
  }

  spread() {
    return this.tuple.spread();
  }

  animate<R>(animation: Animation<T, R>, config = {} as AnimationConfig<T>): R {
    const [prev, next] = this.tuple.spread();

    if (config.when && !config.when(prev, next)) {
      return {} as R;
    }

    let staggeredT = this.t;

    if (config.stagger) {
      if (!this.parent) {
        throw Error("Can't use stagger without a parent context");
      }

      const items = this.parent
        .map(childCtx => {
          const [prevChild, nextChild] = childCtx.spread();
          return {
            isSelected: !config.when || config.when(prevChild, nextChild),
            isThisChild: prevChild === prev && nextChild === next
          };
        })
        .filter(x => x.isSelected);

      const N = items.length;
      if (N > 1) {
        const currentIndex = items.findIndex(x => x.isThisChild);
        const duration = 1 - config.stagger;
        const tick = config.stagger / (N - 1);
        staggeredT = Math.min(
          1,
          Math.max(0, (this.t - currentIndex * tick) / duration)
        );
      }
    }

    return animation(prev, next, staggeredT);
  }

  animations<R>(animations: AnimationAndConfig<T, R>[]) {
    const results = animations.map(({ animation, ...config }) =>
      this.animate(animation, config)
    );
    return merge(results);
  }
}

export class ListContext<T extends { key?: any }> extends Context<T[]> {
  tuple: ArrayTuple<T>;

  constructor(tuple: ArrayTuple<T>, t: number) {
    super(tuple, t);
    this.tuple = tuple;
  }

  map<M>(mapper: (childCtx: Context<T>, key: any) => M): M[] {
    return this.tuple.map((childTuple: Tuple<T>, key: any) =>
      mapper(new Context(childTuple, this.t, this), key)
    );
  }
}

export function useAnimationContext<T>(items: T[], playhead: number) {
  const prev = items[Math.floor(playhead)];
  const next = items[Math.floor(playhead) + 1];
  const tuple = React.useMemo(() => new Tuple(prev, next), [prev, next]);
  return new Context(tuple, playhead % 1);
}

const MULTIPLY = "multiply";

type MergeableObjects<T> = T[];
type MergeableArrays<T> = MergeableObjects<T>[];
type Mergeable<T> = MergeableObjects<T> | MergeableArrays<T>;

function merge<T>(results: Mergeable<T>, composite = MULTIPLY) {
  const firstResult = results[0];
  if (results.length < 2) {
    return firstResult;
  }
  if (Array.isArray(firstResult)) {
    return mergeArrays(results as MergeableArrays<T>, composite);
  } else {
    return mergeObjects(results as MergeableObjects<T>, composite);
  }
}

function mergeObjects<T extends { opacity?: number }>(
  results: MergeableObjects<T>,
  composite: string
) {
  const merged = Object.assign({}, ...results) as T;

  if (composite === MULTIPLY) {
    const opacities = results
      .map(x => x.opacity)
      .filter(x => x != null) as number[];
    if (opacities.length !== 0) {
      merged.opacity = opacities.reduce((a, b) => a * b);
    }
  }
  return merged;
}

function mergeArrays<T>(results: MergeableArrays<T>, composite: string): T[] {
  const firstResult = results[0];
  return firstResult.map((_, i) => {
    return merge(results.map(result => result[i]), composite) as T;
  });
}
